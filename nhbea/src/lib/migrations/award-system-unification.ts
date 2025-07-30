/**
 * Award System Unification Migration
 * Merges hall_of_fame and awards arrays into unified recognition system
 */

import { db } from '../firebase';
import { collection, doc, getDocs, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { Member } from '@/types/dataModels';

export interface AwardRecord {
  id: string;
  awardId: string;
  year: number;
  active: boolean;
  category?: string;
  description?: string;
  source: 'legacy_awards' | 'hall_of_fame' | 'manual';
}

export interface UnificationResult {
  totalRecords: number;
  recordsWithAwards: number;
  recordsWithHallOfFame: number;
  unifiedRecords: number;
  errors: string[];
  conflictsResolved: number;
}

/**
 * Analyze existing award systems for conflicts and duplication
 */
export async function analyzeAwardSystems(): Promise<{
  membersWithBothSystems: number;
  potentialConflicts: Array<{
    memberId: string;
    name: string;
    conflicts: string[];
  }>;
  duplicateAwards: number;
}> {
  try {
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    let membersWithBothSystems = 0;
    const potentialConflicts: Array<{
      memberId: string;
      name: string;
      conflicts: string[];
    }> = [];
    let duplicateAwards = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const hasAwards = data.awards && Array.isArray(data.awards) && data.awards.length > 0;
      const hasHallOfFame = data.hall_of_fame && (data.hall_of_fame.isactive || data.hall_of_fame.award);
      
      if (hasAwards && hasHallOfFame) {
        membersWithBothSystems++;
        
        const conflicts: string[] = [];
        const awards = data.awards || [];
        const hofAwards = data.hall_of_fame?.award || [];
        
        // Check for duplicate award references
        const awardIds = new Set();
        awards.forEach((award: any) => {
          const awardId = award.award || award.awardId;
          if (awardIds.has(awardId)) {
            duplicateAwards++;
            conflicts.push(`Duplicate award: ${awardId}`);
          }
          awardIds.add(awardId);
        });
        
        hofAwards.forEach((award: any) => {
          const awardId = award.id;
          if (awardIds.has(`awards/${awardId}`)) {
            duplicateAwards++;
            conflicts.push(`Hall of Fame award conflicts with legacy award: ${awardId}`);
          }
        });
        
        // Check for inconsistent hall of fame status
        const isHallOfFame = data.hall_of_fame?.isactive;
        const hasHallOfFameAwards = hofAwards.length > 0;
        if (isHallOfFame !== hasHallOfFameAwards) {
          conflicts.push('Hall of Fame status inconsistent with awards');
        }
        
        if (conflicts.length > 0) {
          potentialConflicts.push({
            memberId: doc.id,
            name: `${data.personalInfo?.firstName || ''} ${data.personalInfo?.lastName || ''}`,
            conflicts
          });
        }
      }
    });
    
    return {
      membersWithBothSystems,
      potentialConflicts,
      duplicateAwards
    };
  } catch (error) {
    console.error('Error analyzing award systems:', error);
    throw new Error('Failed to analyze award systems');
  }
}

/**
 * Unify legacy awards and hall of fame into single recognition system
 */
export function unifyMemberAwards(memberData: any): {
  unifiedAwards: AwardRecord[];
  hallOfFameStatus: {
    inducted: boolean;
    inductionYear?: number;
    category?: string;
  };
} {
  const unifiedAwards: AwardRecord[] = [];
  let earliestHofYear: number | undefined;
  
  // Process legacy awards array
  if (memberData.awards && Array.isArray(memberData.awards)) {
    memberData.awards.forEach((award: any, index: number) => {
      unifiedAwards.push({
        id: `legacy_${index}_${Date.now()}`,
        awardId: award.award || award.awardId || '',
        year: award.year || new Date().getFullYear(),
        active: award.active !== false, // Default to true unless explicitly false
        category: award.category || 'general',
        source: 'legacy_awards'
      });
    });
  }
  
  // Process hall of fame awards
  if (memberData.hall_of_fame?.award && Array.isArray(memberData.hall_of_fame.award)) {
    memberData.hall_of_fame.award.forEach((award: any, index: number) => {
      const awardYear = award.year || new Date().getFullYear();
      if (!earliestHofYear || awardYear < earliestHofYear) {
        earliestHofYear = awardYear;
      }
      
      unifiedAwards.push({
        id: `hof_${index}_${Date.now()}`,
        awardId: award.id || '',
        year: awardYear,
        active: true,
        category: 'hall_of_fame',
        description: 'Hall of Fame Award',
        source: 'hall_of_fame'
      });
    });
  }
  
  // Determine hall of fame status
  const hallOfFameStatus = {
    inducted: memberData.hall_of_fame?.isactive || false,
    inductionYear: earliestHofYear,
    category: unifiedAwards.find(a => a.source === 'hall_of_fame')?.category
  };
  
  // Remove duplicates based on awardId and year
  const uniqueAwards = unifiedAwards.reduce((acc: AwardRecord[], current) => {
    const exists = acc.find(award => 
      award.awardId === current.awardId && 
      award.year === current.year
    );
    
    if (!exists) {
      acc.push(current);
    }
    
    return acc;
  }, []);
  
  return {
    unifiedAwards: uniqueAwards,
    hallOfFameStatus
  };
}

/**
 * Run award system unification across all member records
 */
export async function unifyAllAwardSystems(): Promise<UnificationResult> {
  console.log('🏆 Starting award system unification...');
  
  const result: UnificationResult = {
    totalRecords: 0,
    recordsWithAwards: 0,
    recordsWithHallOfFame: 0,
    unifiedRecords: 0,
    errors: [],
    conflictsResolved: 0
  };
  
  try {
    // Analyze current state
    const analysis = await analyzeAwardSystems();
    console.log(`Found ${analysis.membersWithBothSystems} members with both award systems`);
    console.log(`Found ${analysis.potentialConflicts.length} potential conflicts`);
    
    // Process all member records
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    result.totalRecords = snapshot.size;
    
    const batch = writeBatch(db);
    let batchCount = 0;
    
    for (const memberDoc of snapshot.docs) {
      try {
        const data = memberDoc.data();
        const hasAwards = data.awards && Array.isArray(data.awards) && data.awards.length > 0;
        const hasHallOfFame = data.hall_of_fame && (data.hall_of_fame.isactive || data.hall_of_fame.award);
        
        if (hasAwards) result.recordsWithAwards++;
        if (hasHallOfFame) result.recordsWithHallOfFame++;
        
        if (hasAwards || hasHallOfFame) {
          const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(data);
          
          // Update member record with unified structure
          const memberRef = doc(db, 'members', memberDoc.id);
          const updateData: any = {
            'recognition.awards': unifiedAwards,
            'recognition.hallOfFame': hallOfFameStatus,
            'metadata.updatedAt': new Date(),
            'metadata.awardUnificationDate': new Date(),
            'metadata.awardUnificationVersion': 'v1.0'
          };
          
          // Remove old award systems
          updateData['awards'] = null;
          updateData['hall_of_fame'] = null;
          
          batch.update(memberRef, updateData);
          result.unifiedRecords++;
          
          // Count conflicts resolved
          if (hasAwards && hasHallOfFame) {
            result.conflictsResolved++;
          }
          
          // Commit batch every 450 operations
          batchCount++;
          if (batchCount >= 450) {
            await batch.commit();
            batchCount = 0;
          }
        }
      } catch (error) {
        const errorMsg = `Failed to unify awards for member ${memberDoc.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    // Commit remaining operations
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`✅ Award unification completed:`, result);
    return result;
    
  } catch (error) {
    console.error('❌ Award system unification failed:', error);
    throw error;
  }
}

/**
 * Validate award system unification results
 */
export async function validateAwardUnification(): Promise<{
  totalRecords: number;
  recordsWithUnifiedAwards: number;
  recordsWithLegacyAwards: number;
  recordsWithLegacyHallOfFame: number;
  unificationRate: number;
  issues: string[];
}> {
  try {
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    let totalRecords = 0;
    let recordsWithUnifiedAwards = 0;
    let recordsWithLegacyAwards = 0;
    let recordsWithLegacyHallOfFame = 0;
    const issues: string[] = [];
    
    snapshot.forEach((doc) => {
      totalRecords++;
      const data = doc.data();
      
      // Check for unified awards
      if (data.recognition?.awards && Array.isArray(data.recognition.awards)) {
        recordsWithUnifiedAwards++;
      }
      
      // Check for remaining legacy systems
      if (data.awards && Array.isArray(data.awards) && data.awards.length > 0) {
        recordsWithLegacyAwards++;
        issues.push(`Record ${doc.id} still has legacy awards array`);
      }
      
      if (data.hall_of_fame && (data.hall_of_fame.isactive || data.hall_of_fame.award)) {
        recordsWithLegacyHallOfFame++;
        issues.push(`Record ${doc.id} still has legacy hall_of_fame data`);
      }
      
      // Check for data integrity issues
      if (data.recognition?.hallOfFame?.inducted && (!data.recognition?.awards || data.recognition.awards.length === 0)) {
        issues.push(`Record ${doc.id} marked as hall of fame but has no awards`);
      }
    });
    
    const unificationRate = totalRecords > 0 ? (recordsWithUnifiedAwards / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      recordsWithUnifiedAwards,
      recordsWithLegacyAwards,
      recordsWithLegacyHallOfFame,
      unificationRate,
      issues
    };
  } catch (error) {
    console.error('Error validating award unification:', error);
    throw new Error('Failed to validate award unification');
  }
}

/**
 * Rollback award system unification
 */
export async function rollbackAwardUnification(backupData: any[]): Promise<void> {
  try {
    console.log(`Starting rollback of award unification for ${backupData.length} records...`);
    
    const batch = writeBatch(db);
    let batchCount = 0;
    
    for (const backupRecord of backupData) {
      const memberRef = doc(db, 'members', backupRecord.id);
      
      // Restore original award structure
      const restoreData: any = {
        awards: backupRecord.data.awards || null,
        hall_of_fame: backupRecord.data.hall_of_fame || null,
        'metadata.updatedAt': new Date(),
        'metadata.rollbackDate': new Date()
      };
      
      // Remove unified structure
      restoreData['recognition.awards'] = null;
      restoreData['recognition.hallOfFame'] = null;
      
      batch.update(memberRef, restoreData);
      
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
    
    console.log('Award unification rollback completed successfully');
  } catch (error) {
    console.error('Error during award unification rollback:', error);
    throw new Error('Failed to rollback award unification');
  }
}

/**
 * Run comprehensive award system unification with validation
 */
export async function runAwardSystemUnification(): Promise<UnificationResult> {
  console.log('🚀 Starting comprehensive award system unification...');
  
  try {
    // Step 1: Analyze current state
    console.log('📊 Analyzing current award systems...');
    const analysis = await analyzeAwardSystems();
    console.log(`Analysis complete - ${analysis.membersWithBothSystems} members need unification`);
    
    // Step 2: Run unification
    console.log('🔄 Running award system unification...');
    const result = await unifyAllAwardSystems();
    
    // Step 3: Validate results
    console.log('✅ Validating unification results...');
    const validation = await validateAwardUnification();
    
    if (validation.unificationRate < 98) {
      console.warn(`⚠️ Unification rate ${validation.unificationRate.toFixed(2)}% - may need additional work`);
    } else {
      console.log(`✅ Unification successful! Rate: ${validation.unificationRate.toFixed(2)}%`);
    }
    
    return {
      ...result,
      errors: [...result.errors, ...validation.issues]
    };
    
  } catch (error) {
    console.error('❌ Award system unification failed:', error);
    throw error;
  }
}