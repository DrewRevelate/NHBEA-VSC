/**
 * Member Data Cleanup Migration
 * Addresses organization data corruption and implements enhanced member data model
 */

import { db } from '../firebase';
import { collection, doc, getDocs, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { Member } from '@/types/dataModels';

export interface OrganizationCorruptionPattern {
  originalData: Record<string, string>;
  organizationAddress: string;
  title: string;
  decodedString?: string;
}

export interface MigrationResult {
  totalRecords: number;
  corruptedRecords: number;
  cleanedRecords: number;
  errors: string[];
  backup: any[];
}

/**
 * Decode organization data corruption pattern
 * Converts indexed character mapping back to readable string
 */
export function decodeOrganizationData(organizationData: any): string | null {
  if (!organizationData || typeof organizationData !== 'object') {
    return null;
  }

  // Check if this has the corruption pattern (indexed characters)
  const hasIndexedChars = Object.keys(organizationData).some(key => 
    !isNaN(parseInt(key)) && typeof organizationData[key] === 'string'
  );

  if (!hasIndexedChars) {
    return null; // No corruption detected
  }

  try {
    // Extract indexed characters and sort by key
    const characters: Array<{index: number, char: string}> = [];
    
    Object.keys(organizationData).forEach(key => {
      const index = parseInt(key);
      if (!isNaN(index)) {
        characters.push({ index, char: organizationData[key] });
      }
    });

    // Sort by index and concatenate
    characters.sort((a, b) => a.index - b.index);
    const decodedString = characters.map(item => item.char).join('');
    
    return decodedString;
  } catch (error) {
    console.error('Error decoding organization data:', error);
    return null;
  }
}

/**
 * Analyze organization data corruption across all member records
 */
export async function analyzeOrganizationCorruption(): Promise<OrganizationCorruptionPattern[]> {
  try {
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    const corruptionPatterns: OrganizationCorruptionPattern[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const organizationData = data.organization;
      
      if (organizationData) {
        const decodedString = decodeOrganizationData(organizationData);
        
        if (decodedString) {
          corruptionPatterns.push({
            originalData: organizationData,
            organizationAddress: organizationData.address || '',
            title: organizationData.title || '',
            decodedString
          });
        }
      }
    });
    
    return corruptionPatterns;
  } catch (error) {
    console.error('Error analyzing organization corruption:', error);
    throw new Error('Failed to analyze organization corruption');
  }
}

/**
 * Create mapping between corrupted organization data and clean Firebase references
 */
export async function createOrganizationMapping(): Promise<Map<string, string>> {
  const corruptionPatterns = await analyzeOrganizationCorruption();
  const mapping = new Map<string, string>();
  
  // Group similar decoded strings to organization addresses
  const addressToDecodedMap = new Map<string, string>();
  
  corruptionPatterns.forEach(pattern => {
    if (pattern.organizationAddress && pattern.decodedString) {
      addressToDecodedMap.set(pattern.organizationAddress, pattern.decodedString);
    }
  });
  
  // Create bidirectional mapping
  addressToDecodedMap.forEach((decoded, address) => {
    mapping.set(decoded, address);
  });
  
  return mapping;
}

/**
 * Create comprehensive backup of all member data before migration
 */
export async function createMemberDataBackup(): Promise<any[]> {
  try {
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    const backup: any[] = [];
    
    snapshot.forEach((doc) => {
      backup.push({
        id: doc.id,
        data: doc.data(),
        timestamp: new Date().toISOString()
      });
    });
    
    // Store backup in a separate collection for safety
    const backupCollection = collection(db, 'member_data_backups');
    const batch = writeBatch(db);
    
    backup.forEach((record, index) => {
      const backupDoc = doc(backupCollection, `backup_${Date.now()}_${index}`);
      batch.set(backupDoc, record);
    });
    
    await batch.commit();
    
    console.log(`Created backup of ${backup.length} member records`);
    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create member data backup');
  }
}

/**
 * Clean organization data corruption in member records
 */
export async function cleanOrganizationData(): Promise<MigrationResult> {
  console.log('Starting organization data cleanup...');
  
  const result: MigrationResult = {
    totalRecords: 0,
    corruptedRecords: 0,
    cleanedRecords: 0,
    errors: [],
    backup: []
  };
  
  try {
    // Create backup first
    result.backup = await createMemberDataBackup();
    
    // Get organization mapping
    const organizationMapping = await createOrganizationMapping();
    
    // Process all member records
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    result.totalRecords = snapshot.size;
    
    const batch = writeBatch(db);
    let batchCount = 0;
    
    for (const memberDoc of snapshot.docs) {
      const data = memberDoc.data();
      const organizationData = data.organization;
      
      if (organizationData) {
        const decodedString = decodeOrganizationData(organizationData);
        
        if (decodedString) {
          result.corruptedRecords++;
          
          // Find mapped organization address
          const cleanAddress = organizationMapping.get(decodedString) || organizationData.address;
          
          // Clean organization data - keep only necessary fields
          const cleanedOrganization = {
            address: cleanAddress,
            title: organizationData.title || '',
            secondary_title: organizationData.secondary_title || undefined
          };
          
          // Remove undefined fields
          Object.keys(cleanedOrganization).forEach(key => {
            if (cleanedOrganization[key as keyof typeof cleanedOrganization] === undefined) {
              delete cleanedOrganization[key as keyof typeof cleanedOrganization];
            }
          });
          
          // Update the document
          const memberRef = doc(db, 'members', memberDoc.id);
          batch.update(memberRef, {
            organization: cleanedOrganization,
            'metadata.updatedAt': new Date(),
            'metadata.migrationNote': 'Organization data cleaned - Phase 1 migration'
          });
          
          result.cleanedRecords++;
          
          // Commit batch every 450 operations (Firestore limit is 500)
          batchCount++;
          if (batchCount >= 450) {
            await batch.commit();
            batchCount = 0;
          }
        }
      }
    }
    
    // Commit remaining operations
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`Organization cleanup completed:`, result);
    return result;
    
  } catch (error) {
    const errorMessage = `Organization cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMessage);
    result.errors.push(errorMessage);
    throw error;
  }
}

/**
 * Validate organization data integrity after cleanup
 */
export async function validateOrganizationIntegrity(): Promise<{
  totalRecords: number;
  validRecords: number;
  corruptionRate: number;
  issues: string[];
}> {
  try {
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    let totalRecords = 0;
    let validRecords = 0;
    const issues: string[] = [];
    
    snapshot.forEach((doc) => {
      totalRecords++;
      const data = doc.data();
      const organizationData = data.organization;
      
      if (organizationData) {
        // Check for corruption pattern
        const hasCorruption = decodeOrganizationData(organizationData) !== null;
        
        if (!hasCorruption) {
          validRecords++;
        } else {
          issues.push(`Record ${doc.id} still has organization data corruption`);
        }
        
        // Check for required fields
        if (!organizationData.address) {
          issues.push(`Record ${doc.id} missing organization.address`);
        }
        
        if (!organizationData.title) {
          issues.push(`Record ${doc.id} missing organization.title`);
        }
      } else {
        issues.push(`Record ${doc.id} missing organization data entirely`);
      }
    });
    
    const corruptionRate = totalRecords > 0 ? ((totalRecords - validRecords) / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      validRecords,
      corruptionRate,
      issues
    };
  } catch (error) {
    console.error('Error validating organization integrity:', error);
    throw new Error('Failed to validate organization integrity');
  }
}

/**
 * Rollback organization data cleanup (restore from backup)
 */
export async function rollbackOrganizationCleanup(backupData: any[]): Promise<void> {
  try {
    console.log(`Starting rollback of ${backupData.length} records...`);
    
    const batch = writeBatch(db);
    let batchCount = 0;
    
    for (const backupRecord of backupData) {
      const memberRef = doc(db, 'members', backupRecord.id);
      batch.set(memberRef, backupRecord.data);
      
      batchCount++;
      if (batchCount >= 450) {
        await batch.commit();
        batchCount = 0;
      }
    }
    
    // Commit remaining operations
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Error during rollback:', error);
    throw new Error('Failed to rollback organization cleanup');
  }
}

/**
 * Run comprehensive organization data cleanup with validation
 */
export async function runOrganizationDataCleanup(): Promise<MigrationResult> {
  console.log('🚀 Starting comprehensive organization data cleanup...');
  
  try {
    // Step 1: Analyze current corruption
    console.log('📊 Analyzing organization data corruption...');
    const corruptionPatterns = await analyzeOrganizationCorruption();
    console.log(`Found ${corruptionPatterns.length} corruption patterns`);
    
    // Step 2: Run cleanup
    console.log('🧹 Running organization data cleanup...');
    const result = await cleanOrganizationData();
    
    // Step 3: Validate results
    console.log('✅ Validating cleanup results...');
    const validation = await validateOrganizationIntegrity();
    
    if (validation.corruptionRate > 1) {
      console.warn(`⚠️  Corruption rate still ${validation.corruptionRate.toFixed(2)}% - may need additional cleanup`);
    } else {
      console.log(`✅ Cleanup successful! Corruption rate: ${validation.corruptionRate.toFixed(2)}%`);
    }
    
    return {
      ...result,
      errors: [...result.errors, ...validation.issues]
    };
    
  } catch (error) {
    console.error('❌ Organization data cleanup failed:', error);
    throw error;
  }
}