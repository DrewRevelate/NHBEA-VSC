'use client';

import { useState } from 'react';
import { 
  runFullDataMigration,
  migrateToOrganizations,
  migrateMembersToNewSchema,
  migrateConferencesToNewSchema,
  migrateRegistrantsToNewSchema,
  migrateLegacyBoardMembers
} from '@/lib/dataMigration';
import { seedAllCollections, seedAwards } from '@/lib/seedData';
import { findAndFixAllLegacyMembers } from '@/lib/legacyMemberFix';
import { importV1Data } from '@/lib/v1DataImport';

export default function MigrationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedMigration, setSelectedMigration] = useState<string>('v1-import');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runMigration = async () => {
    setIsRunning(true);
    setLogs([]);
    addLog('Starting migration...');

    try {
      switch (selectedMigration) {
        case 'v1-import':
          addLog('📁 Importing V1 CSV data with exact structure preservation...');
          await importV1Data();
          addLog('✅ V1 data imported successfully!');
          addLog('🎉 James Dowding imported with profile.activeBoardMember structure!');
          addLog('📊 Check Firestore console to see V1-aligned data.');
          break;
          
        case 'seed':
          addLog('🌱 Creating comprehensive dummy data for all collections...');
          await seedAllCollections();
          addLog('✅ All collections seeded with dummy data successfully!');
          addLog('🎉 You can now visit /about to see board members in action!');
          addLog('📊 Check your Firestore console to see all the new data.');
          break;
          
        case 'full':
          addLog('Running full data migration...');
          await runFullDataMigration();
          addLog('✅ Full migration completed successfully!');
          break;
          
        case 'organizations':
          addLog('Creating organizations collection...');
          await migrateToOrganizations();
          addLog('✅ Organizations migration completed!');
          break;
          
        case 'members':
          addLog('Updating members with organization references...');
          await migrateMembersToNewSchema();
          addLog('✅ Members migration completed!');
          break;
          
        case 'conferences':
          addLog('Updating conferences with virtual support...');
          await migrateConferencesToNewSchema();
          addLog('✅ Conferences migration completed!');
          break;
          
        case 'registrants':
          addLog('Updating registrants with member links...');
          await migrateRegistrantsToNewSchema();
          addLog('✅ Registrants migration completed!');
          break;
          
        case 'legacy-board':
          addLog('Migrating legacy board members...');
          await migrateLegacyBoardMembers();
          addLog('✅ Legacy board members migration completed!');
          break;
          
        case 'fix-legacy':
          addLog('🔧 Finding and fixing legacy member data structures...');
          await findAndFixAllLegacyMembers();
          addLog('✅ All legacy members fixed successfully!');
          addLog('🎉 James Dowding should now appear on the board members page!');
          addLog('📝 Visit /about to see the updated board members.');
          break;
          
        case 'awards':
          addLog('🏆 Seeding awards from V1 CSV data...');
          const awardIds = await seedAwards();
          addLog(`✅ ${awardIds.length} awards created with original V1 IDs!`);
          addLog('🎯 Awards: Educator of the Year & Kaliski Award');
          addLog('📝 Check FireCMS admin panel to see the awards collection.');
          break;
      }
    } catch (error) {
      addLog(`❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              NHBEA CMS Data Migration
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Migrate your data to the enhanced CMS data models
            </p>
          </div>

          <div className="p-6">
            {/* Migration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Migration Type
              </label>
              <select
                value={selectedMigration}
                onChange={(e) => setSelectedMigration(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isRunning}
              >
                <option value="v1-import">📁 Import V1 CSV Data (Preserves Exact Structure)</option>
                <option value="seed">🌱 Seed All Collections with Dummy Data (Start Here!)</option>
                <option value="full">Full Migration (All Steps)</option>
                <option value="organizations">Step 1: Create Organizations</option>
                <option value="members">Step 2: Update Members</option>
                <option value="conferences">Step 3: Update Conferences</option>
                <option value="registrants">Step 4: Update Registrants</option>
                <option value="legacy-board">Legacy: Migrate Board Members</option>
                <option value="fix-legacy">🔧 Fix Legacy Member Data Structure</option>
              </select>
            </div>

            {/* Migration Descriptions */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                What this migration does:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {selectedMigration === 'v1-import' && (
                  <>
                    <li>• Imports your existing V1 CSV data preserving exact nested structure</li>
                    <li>• Organizations, Members (James Dowding), Registrants, Sponsors</li>
                    <li>• Uses personalInfo.firstName, profile.activeBoardMember format</li>
                    <li>• Perfect alignment with your current data structure</li>
                    <li><strong>🎯 RECOMMENDED: Start with this for V1 compatibility!</strong></li>
                  </>
                )}
                {selectedMigration === 'seed' && (
                  <>
                    <li>• Creates 5 organizations (schools, colleges, nonprofits)</li>
                    <li>• Creates 6 members including 5 board members with proper roles</li>
                    <li>• Creates 2 conferences (1 in-person, 1 virtual)</li>
                    <li>• Creates 4 conference registrants with member links</li>
                    <li>• Adds homepage content and sponsors for immediate testing</li>
                    <li><strong>⭐ RECOMMENDED: Start with this option to populate your collections!</strong></li>
                  </>
                )}
                {selectedMigration === 'full' && (
                  <>
                    <li>• Creates organizations collection from existing member data</li>
                    <li>• Updates members with organization references and board flags</li>
                    <li>• Enhances conferences with virtual URL support</li>
                    <li>• Updates registrants with member links and payment tracking</li>
                  </>
                )}
                {selectedMigration === 'organizations' && (
                  <li>• Extracts unique organizations from member data and creates organization records</li>
                )}
                {selectedMigration === 'members' && (
                  <li>• Adds organizationId references, isBoardMember flags, and enhanced communication preferences</li>
                )}
                {selectedMigration === 'conferences' && (
                  <li>• Adds isVirtual boolean, virtualUrl field, and other enhanced conference features</li>
                )}
                {selectedMigration === 'registrants' && (
                  <li>• Links registrants to members, adds payment receipt tracking, and guest info support</li>
                )}
                {selectedMigration === 'legacy-board' && (
                  <li>• Converts old boardMembers collection entries to enhanced member records</li>
                )}
                {selectedMigration === 'fix-legacy' && (
                  <>
                    <li>• Finds members using old nested data structure (personalInfo, membership, profile)</li>
                    <li>• Converts to new flat structure (firstName, lastName, isBoardMember, status)</li>
                    <li>• Fixes board member detection and display issues</li>
                    <li><strong>🎯 PERFECT for fixing James Dowding's visibility issue!</strong></li>
                  </>
                )}
              </ul>
            </div>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Before You Begin
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Make sure you have a backup of your Firestore data</li>
                      <li>This migration will modify your existing data</li>
                      <li>Run migrations during low-traffic periods</li>
                      <li>Test on a development environment first if possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Migration Button */}
            <button
              onClick={runMigration}
              disabled={isRunning}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Migration...
                </>
              ) : (
                'Run Migration'
              )}
            </button>

            {/* Migration Logs */}
            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Migration Log
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-green-400 font-mono max-h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Post-Migration Instructions */}
            {logs.some(log => log.includes('✅')) && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Next Steps
                </h3>
                <div className="text-sm text-green-700 space-y-2">
                  <p>1. Verify the migration in your Firestore console</p>
                  <p>2. Update your FireCMS configuration with the new collections</p>
                  <p>3. Test your application to ensure everything works correctly</p>
                  <p>4. Visit <a href="/about" className="underline">the About page</a> to see enhanced board members</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Firestore Console Link */}
        <div className="mt-6 text-center">
          <a
            href="https://console.firebase.google.com/project/nhbea-64cab/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Firestore Console
          </a>
        </div>
      </div>
    </div>
  );
}