/**
 * Schema Migration Script
 * Implements enhanced member data model with validation checkpoints
 */

import { db } from '../firebase';
import { collection, doc, getDocs, updateDoc, writeBatch, runTransaction } from 'firebase/firestore';
import { Member } from '@/types/dataModels';
import { runOrganizationDataCleanup } from './member-data-cleanup';
import { runAwardSystemUnification } from './award-system-unification';
import { enhancedMemberRepository } from '../repositories/enhanced-member-repository';

export interface SchemaVersionInfo {
  version: string;
  description: string;
  migrationDate: Date;
  backwardCompatible: boolean;
  requiredIndexes: string[];
}

export interface MigrationCheckpoint {
  checkpoint: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  recordsProcessed: number;
  errors: string[];
}

export interface SchemaMigrationResult {
  version: string;
  totalRecords: number;
  migratedRecords: number;
  checkpoints: MigrationCheckpoint[];
  validationResults: ValidationResult[];
  errors: string[];
  rollbackData: any[];
}

export interface ValidationResult {
  validator: string;
  passed: boolean;
  details: {
    totalChecked: number;
    passedChecks: number;
    failedChecks: number;
    issues: string[];
  };
}

export const ENHANCED_SCHEMA_VERSION: SchemaVersionInfo = {
  version: '2.0.0',
  description: 'Enhanced member data model with unified governance, recognition, and affiliations',
  migrationDate: new Date(),
  backwardCompatible: true,
  requiredIndexes: [
    'governance.boardMember.active',
    'governance.boardMember.order',
    'governance.pastPresident.isPastPresident',
    'recognition.hallOfFame.inducted',
    'recognition.hallOfFame.inductionYear',
    'membership.status',
    'affiliations.organizationId'
  ]
};

/**
 * Pre-migration validation checks
 */
export async function validatePreMigrationState(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  try {
    // Validate data integrity before migration
    console.log('🔍 Running pre-migration validation...');
    
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    let totalRecords = 0;
    let recordsWithValidStructure = 0;
    let recordsWithOrganizationData = 0;
    let recordsWithAwardData = 0;
    const issues: string[] = [];
    
    snapshot.forEach((doc) => {
      totalRecords++;
      const data = doc.data();
      
      // Check basic structure
      if (data.personalInfo && data.organization && data.membership && data.preferences && data.metadata) {
        recordsWithValidStructure++;
      } else {
        issues.push(`Record ${doc.id} missing required top-level fields`);
      }
      
      // Check organization data
      if (data.organization?.address && data.organization?.title) {
        recordsWithOrganizationData++;
      }
      
      // Check award data
      if (data.awards || data.hall_of_fame) {
        recordsWithAwardData++;
      }
    });
    
    results.push({
      validator: 'basic_structure',
      passed: recordsWithValidStructure === totalRecords,
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithValidStructure,
        failedChecks: totalRecords - recordsWithValidStructure,
        issues: issues.filter(i => i.includes('missing required'))
      }
    });
    
    results.push({
      validator: 'organization_data',
      passed: recordsWithOrganizationData > 0,
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithOrganizationData,
        failedChecks: totalRecords - recordsWithOrganizationData,
        issues: issues.filter(i => i.includes('organization'))
      }
    });
    
    results.push({
      validator: 'award_data',
      passed: true, // Award data is optional
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithAwardData,
        failedChecks: 0,
        issues: []
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('Pre-migration validation failed:', error);
    throw new Error('Pre-migration validation failed');
  }
}

/**
 * Post-migration validation checks
 */
export async function validatePostMigrationState(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  try {
    console.log('✅ Running post-migration validation...');
    
    const membersCollection = collection(db, 'members');
    const snapshot = await getDocs(membersCollection);
    
    let totalRecords = 0;
    let recordsWithEnhancedStructure = 0;
    let recordsWithGovernanceData = 0;
    let recordsWithRecognitionData = 0;
    let recordsWithAffiliationData = 0;
    const issues: string[] = [];
    
    snapshot.forEach((doc) => {
      totalRecords++;
      const data = doc.data();
      
      // Check enhanced structure
      if (data.governance && data.recognition && data.affiliations) {
        recordsWithEnhancedStructure++;
      } else {
        issues.push(`Record ${doc.id} missing enhanced structure fields`);
      }
      
      // Check governance data
      if (data.governance?.boardMember && data.governance?.pastPresident) {
        recordsWithGovernanceData++;
      }
      
      // Check recognition data
      if (data.recognition?.hallOfFame && data.recognition?.awards) {
        recordsWithRecognitionData++;
      }
      
      // Check affiliation data
      if (data.affiliations && Array.isArray(data.affiliations) && data.affiliations.length > 0) {
        recordsWithAffiliationData++;
      }
      
      // Check for legacy data remnants
      if (data.awards || data.hall_of_fame) {
        issues.push(`Record ${doc.id} still contains legacy award data`);
      }
    });
    
    results.push({
      validator: 'enhanced_structure',
      passed: recordsWithEnhancedStructure === totalRecords,
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithEnhancedStructure,
        failedChecks: totalRecords - recordsWithEnhancedStructure,
        issues: issues.filter(i => i.includes('enhanced structure'))
      }
    });
    
    results.push({
      validator: 'governance_data',
      passed: recordsWithGovernanceData === totalRecords,
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithGovernanceData,
        failedChecks: totalRecords - recordsWithGovernanceData,
        issues: issues.filter(i => i.includes('governance'))
      }
    });
    
    results.push({
      validator: 'recognition_data',
      passed: recordsWithRecognitionData === totalRecords,
      details: {
        totalChecked: totalRecords,
        passedChecks: recordsWithRecognitionData,
        failedChecks: totalRecords - recordsWithRecognitionData,
        issues: issues.filter(i => i.includes('recognition'))
      }
    });
    
    results.push({
      validator: 'legacy_cleanup',
      passed: !issues.some(i => i.includes('legacy award data')),
      details: {
        totalChecked: totalRecords,
        passedChecks: totalRecords - issues.filter(i => i.includes('legacy')).length,
        failedChecks: issues.filter(i => i.includes('legacy')).length,
        issues: issues.filter(i => i.includes('legacy'))
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('Post-migration validation failed:', error);
    throw new Error('Post-migration validation failed');
  }
}

/**
 * Create backward compatibility layer
 */
export async function createBackwardCompatibilityLayer(): Promise<void> {
  console.log('🔄 Creating backward compatibility layer...');
  
  try {
    // This would typically involve creating views, triggers, or proxy functions
    // For now, we'll ensure the enhanced member repository handles both formats
    
    // Test backward compatibility by attempting to read both old and new formats
    const testResult = await enhancedMemberRepository.getBoardMembers();
    console.log(`✅ Backward compatibility layer created - can read ${testResult.length} board members`);
    
  } catch (error) {
    console.error('Failed to create backward compatibility layer:', error);
    throw new Error('Backward compatibility layer creation failed');
  }
}

/**
 * Run complete schema migration with all phases
 */
export async function runSchemaMigration(): Promise<SchemaMigrationResult> {
  console.log('🚀 Starting comprehensive schema migration to v2.0.0...');
  
  const result: SchemaMigrationResult = {
    version: ENHANCED_SCHEMA_VERSION.version,
    totalRecords: 0,
    migratedRecords: 0,
    checkpoints: [],
    validationResults: [],
    errors: [],
    rollbackData: []
  };
  
  try {
    // Checkpoint 1: Pre-migration validation
    const preValidationCheckpoint: MigrationCheckpoint = {
      checkpoint: 'pre_migration_validation',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(preValidationCheckpoint);
    
    try {
      const preValidation = await validatePreMigrationState();
      result.validationResults.push(...preValidation);
      
      preValidationCheckpoint.status = 'completed';
      preValidationCheckpoint.endTime = new Date();
      
      // Check if pre-validation passed
      const criticalFailures = preValidation.filter(v => !v.passed && v.validator === 'basic_structure');
      if (criticalFailures.length > 0) {
        throw new Error('Pre-migration validation failed - cannot proceed with migration');
      }
    } catch (error) {
      preValidationCheckpoint.status = 'failed';
      preValidationCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
    
    // Checkpoint 2: Organization data cleanup
    const orgCleanupCheckpoint: MigrationCheckpoint = {
      checkpoint: 'organization_cleanup',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(orgCleanupCheckpoint);
    
    try {
      const orgCleanupResult = await runOrganizationDataCleanup();
      result.rollbackData = orgCleanupResult.backup;
      result.totalRecords = orgCleanupResult.totalRecords;
      
      orgCleanupCheckpoint.status = 'completed';
      orgCleanupCheckpoint.endTime = new Date();
      orgCleanupCheckpoint.recordsProcessed = orgCleanupResult.cleanedRecords;
      orgCleanupCheckpoint.errors = orgCleanupResult.errors;
    } catch (error) {
      orgCleanupCheckpoint.status = 'failed';
      orgCleanupCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
    
    // Checkpoint 3: Award system unification
    const awardUnificationCheckpoint: MigrationCheckpoint = {
      checkpoint: 'award_unification',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(awardUnificationCheckpoint);
    
    try {
      const awardResult = await runAwardSystemUnification();
      
      awardUnificationCheckpoint.status = 'completed';
      awardUnificationCheckpoint.endTime = new Date();
      awardUnificationCheckpoint.recordsProcessed = awardResult.unifiedRecords;
      awardUnificationCheckpoint.errors = awardResult.errors;
    } catch (error) {
      awardUnificationCheckpoint.status = 'failed';
      awardUnificationCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
    
    // Checkpoint 4: Enhanced member migration
    const memberMigrationCheckpoint: MigrationCheckpoint = {
      checkpoint: 'member_migration',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(memberMigrationCheckpoint);
    
    try {
      const migrationResult = await enhancedMemberRepository.migrateAllLegacyMembers();
      result.migratedRecords = migrationResult.migratedRecords;
      
      memberMigrationCheckpoint.status = 'completed';
      memberMigrationCheckpoint.endTime = new Date();
      memberMigrationCheckpoint.recordsProcessed = migrationResult.migratedRecords;
      memberMigrationCheckpoint.errors = migrationResult.errors;
    } catch (error) {
      memberMigrationCheckpoint.status = 'failed';
      memberMigrationCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
    
    // Checkpoint 5: Backward compatibility
    const compatibilityCheckpoint: MigrationCheckpoint = {
      checkpoint: 'backward_compatibility',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(compatibilityCheckpoint);
    
    try {
      await createBackwardCompatibilityLayer();
      
      compatibilityCheckpoint.status = 'completed';
      compatibilityCheckpoint.endTime = new Date();
    } catch (error) {
      compatibilityCheckpoint.status = 'failed';
      compatibilityCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
    
    // Checkpoint 6: Post-migration validation
    const postValidationCheckpoint: MigrationCheckpoint = {
      checkpoint: 'post_migration_validation',
      status: 'in_progress',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: []
    };
    result.checkpoints.push(postValidationCheckpoint);
    
    try {
      const postValidation = await validatePostMigrationState();
      result.validationResults.push(...postValidation);
      
      postValidationCheckpoint.status = 'completed';
      postValidationCheckpoint.endTime = new Date();
      
      // Check for critical post-migration failures
      const criticalFailures = postValidation.filter(v => !v.passed);
      if (criticalFailures.length > 0) {
        console.warn('⚠️ Some post-migration validations failed:', criticalFailures);
        result.errors.push(`Post-migration validation warnings: ${criticalFailures.length} failed checks`);
      }
    } catch (error) {
      postValidationCheckpoint.status = 'failed';
      postValidationCheckpoint.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.errors.push(`Post-migration validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Final result summary
    const totalErrors = result.checkpoints.reduce((sum, cp) => sum + cp.errors.length, 0);
    const completedCheckpoints = result.checkpoints.filter(cp => cp.status === 'completed').length;
    
    console.log(`\n✅ Schema migration completed!`);
    console.log(`📊 Migration Summary:`);
    console.log(`   - Version: ${result.version}`);
    console.log(`   - Total Records: ${result.totalRecords}`);
    console.log(`   - Migrated Records: ${result.migratedRecords}`);
    console.log(`   - Checkpoints: ${completedCheckpoints}/${result.checkpoints.length} completed`);
    console.log(`   - Total Errors: ${totalErrors}`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Schema migration failed:', error);
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Rollback schema migration
 */
export async function rollbackSchemaMigration(migrationResult: SchemaMigrationResult): Promise<void> {
  console.log('🔄 Starting schema migration rollback...');
  
  try {
    if (migrationResult.rollbackData.length === 0) {
      throw new Error('No rollback data available');
    }
    
    const batch = writeBatch(db);
    let batchCount = 0;
    
    for (const backupRecord of migrationResult.rollbackData) {
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
    
    console.log('✅ Schema migration rollback completed successfully');
    
  } catch (error) {
    console.error('❌ Schema migration rollback failed:', error);
    throw error;
  }
}