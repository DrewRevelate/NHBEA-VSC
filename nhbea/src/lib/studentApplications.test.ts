import {
  submitStudentApplication,
  validateFirestoreSchema,
  sanitizeInput,
  sanitizeApplicationData
} from './studentApplications';
import { StudentMembershipFormData } from '@/types/membership';

// Mock Firebase
jest.mock('./firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 }))
}));

import { addDoc, collection } from 'firebase/firestore';
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;

describe('Student Applications', () => {
  const validApplicationData: StudentMembershipFormData = {
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@student.edu',
      phone: '(555) 987-6543'
    },
    academicInfo: {
      institution: 'Test University',
      major: 'Business Education',
      graduationYear: 2025,
      gpa: 3.75
    },
    essay: 'I am passionate about business education and want to contribute to the NHBEA community by sharing my insights and learning from experienced educators.',
    references: [
      {
        name: 'Dr. John Professor',
        email: 'j.professor@university.edu',
        relationship: 'Academic Advisor'
      },
      {
        name: 'Prof. Mary Teacher',
        email: 'm.teacher@university.edu',
        relationship: 'Course Instructor'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Setup collection mock
    mockCollection.mockReturnValue('mock-collection-ref' as any);
  });

  describe('submitStudentApplication', () => {
    it('successfully submits application to Firestore', async () => {
      const mockDocRef = { id: 'test-doc-id' };
      mockAddDoc.mockResolvedValueOnce(mockDocRef as any);

      const result = await submitStudentApplication(validApplicationData);

      expect(result.success).toBe(true);
      expect(result.message).toContain('submitted successfully');
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          personalInfo: validApplicationData.personalInfo,
          academicInfo: validApplicationData.academicInfo,
          essay: validApplicationData.essay,
          references: validApplicationData.references,
          status: 'pending',
          reviewNotes: '',
          submittedAt: expect.anything()
        })
      );
      expect(console.log).toHaveBeenCalledWith(
        'Student application submitted successfully:',
        expect.objectContaining({
          applicationId: 'test-doc-id',
          studentName: 'Jane Smith',
          studentEmail: 'jane.smith@student.edu',
          institution: 'Test University'
        })
      );
    });

    it('handles Firestore errors gracefully', async () => {
      const error = new Error('Firestore connection failed');
      mockAddDoc.mockRejectedValueOnce(error);

      const result = await submitStudentApplication(validApplicationData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to submit application');
      expect(result.error).toBe('Firestore connection failed');
      expect(console.error).toHaveBeenCalledWith('Error submitting student application:', error);
    });

    it('handles unknown errors', async () => {
      mockAddDoc.mockRejectedValueOnce('Unknown error');

      const result = await submitStudentApplication(validApplicationData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to submit application');
      expect(result.error).toBe('Unknown error occurred');
    });

    it('includes server timestamp in submission', async () => {
      const mockDocRef = { id: 'test-doc-id' };
      mockAddDoc.mockResolvedValueOnce(mockDocRef as any);

      await submitStudentApplication(validApplicationData);

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          submittedAt: expect.anything()
        })
      );
    });
  });

  describe('validateFirestoreSchema', () => {
    it('validates complete application data', () => {
      const result = validateFirestoreSchema(validApplicationData);
      expect(result).toBe(true);
    });

    it('rejects data with missing personal info fields', () => {
      const invalidData = {
        ...validApplicationData,
        personalInfo: {
          ...validApplicationData.personalInfo,
          firstName: ''
        }
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });

    it('rejects data with missing academic info fields', () => {
      const invalidData = {
        ...validApplicationData,
        academicInfo: {
          ...validApplicationData.academicInfo,
          institution: ''
        }
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });

    it('rejects data with missing essay', () => {
      const invalidData = {
        ...validApplicationData,
        essay: ''
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });

    it('rejects data with insufficient references', () => {
      const invalidData = {
        ...validApplicationData,
        references: [validApplicationData.references[0]]
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });

    it('rejects data with invalid reference structure', () => {
      const invalidData = {
        ...validApplicationData,
        references: [
          {
            name: 'Dr. John Professor',
            email: '', // Missing email
            relationship: 'Academic Advisor'
          },
          validApplicationData.references[1]
        ]
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });

    it('handles schema validation errors gracefully', () => {
      const invalidData = null as any;
      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Schema validation error:', expect.any(Error));
    });

    it('validates GPA as number including zero', () => {
      const dataWithZeroGPA = {
        ...validApplicationData,
        academicInfo: {
          ...validApplicationData.academicInfo,
          gpa: 0
        }
      };

      const result = validateFirestoreSchema(dataWithZeroGPA);
      expect(result).toBe(true);
    });

    it('rejects data with undefined GPA', () => {
      const invalidData = {
        ...validApplicationData,
        academicInfo: {
          ...validApplicationData.academicInfo,
          gpa: undefined as any
        }
      };

      const result = validateFirestoreSchema(invalidData);
      expect(result).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace from input', () => {
      const result = sanitizeInput('  test input  ');
      expect(result).toBe('test input');
    });

    it('removes script tags', () => {
      const maliciousInput = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeInput(maliciousInput);
      expect(result).toBe('Hello  World');
    });

    it('removes javascript: protocols', () => {
      const maliciousInput = 'javascript:alert("xss")';
      const result = sanitizeInput(maliciousInput);
      expect(result).toBe('alert("xss")');
    });

    it('removes onclick and other event handlers', () => {
      const maliciousInput = 'Hello onclick="alert()" World';
      const result = sanitizeInput(maliciousInput);
      expect(result).toBe('Hello "alert()" World');
    });

    it('enforces maximum length', () => {
      const longInput = 'a'.repeat(3000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(2000);
    });

    it('handles empty strings', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('handles strings with only whitespace', () => {
      const result = sanitizeInput('   ');
      expect(result).toBe('');
    });

    it('preserves normal text content', () => {
      const normalInput = 'This is a normal business education essay about my goals.';
      const result = sanitizeInput(normalInput);
      expect(result).toBe(normalInput);
    });
  });

  describe('sanitizeApplicationData', () => {
    it('sanitizes all string fields in application data', () => {
      const inputWithWhitespace = {
        personalInfo: {
          firstName: '  Jane  ',
          lastName: '  Smith  ',
          email: '  JANE.SMITH@STUDENT.EDU  ',
          phone: '  (555) 987-6543  '
        },
        academicInfo: {
          institution: '  Test University  ',
          major: '  Business Education  ',
          graduationYear: 2025,
          gpa: 3.75
        },
        essay: '  I am passionate about business education.  ',
        references: [
          {
            name: '  Dr. John Professor  ',
            email: '  J.PROFESSOR@UNIVERSITY.EDU  ',
            relationship: '  Academic Advisor  '
          }
        ]
      };

      const result = sanitizeApplicationData(inputWithWhitespace);

      expect(result.personalInfo.firstName).toBe('Jane');
      expect(result.personalInfo.lastName).toBe('Smith');
      expect(result.personalInfo.email).toBe('jane.smith@student.edu');
      expect(result.personalInfo.phone).toBe('(555) 987-6543');
      expect(result.academicInfo.institution).toBe('Test University');
      expect(result.academicInfo.major).toBe('Business Education');
      expect(result.essay).toBe('I am passionate about business education.');
      expect(result.references[0].name).toBe('Dr. John Professor');
      expect(result.references[0].email).toBe('j.professor@university.edu');
      expect(result.references[0].relationship).toBe('Academic Advisor');
    });

    it('preserves numeric fields unchanged', () => {
      const result = sanitizeApplicationData(validApplicationData);
      expect(result.academicInfo.graduationYear).toBe(validApplicationData.academicInfo.graduationYear);
      expect(result.academicInfo.gpa).toBe(validApplicationData.academicInfo.gpa);
    });

    it('converts emails to lowercase', () => {
      const dataWithUppercaseEmails = {
        ...validApplicationData,
        personalInfo: {
          ...validApplicationData.personalInfo,
          email: 'JANE.SMITH@STUDENT.EDU'
        },
        references: [
          {
            ...validApplicationData.references[0],
            email: 'J.PROFESSOR@UNIVERSITY.EDU'
          }
        ]
      };

      const result = sanitizeApplicationData(dataWithUppercaseEmails);
      expect(result.personalInfo.email).toBe('jane.smith@student.edu');
      expect(result.references[0].email).toBe('j.professor@university.edu');
    });

    it('sanitizes malicious content in essay', () => {
      const dataWithMaliciousEssay = {
        ...validApplicationData,
        essay: 'I want to join NHBEA <script>alert("xss")</script> because I love business education.'
      };

      const result = sanitizeApplicationData(dataWithMaliciousEssay);
      expect(result.essay).toBe('I want to join NHBEA  because I love business education.');
    });

    it('handles all references in the array', () => {
      const dataWithMultipleRefs = {
        ...validApplicationData,
        references: [
          {
            name: '  Dr. First Reference  ',
            email: '  FIRST@UNIVERSITY.EDU  ',
            relationship: '  Professor  '
          },
          {
            name: '  Dr. Second Reference  ',
            email: '  SECOND@UNIVERSITY.EDU  ',
            relationship: '  Advisor  '
          },
          {
            name: '  Dr. Third Reference  ',
            email: '  THIRD@UNIVERSITY.EDU  ',
            relationship: '  Department Head  '
          }
        ]
      };

      const result = sanitizeApplicationData(dataWithMultipleRefs);
      expect(result.references).toHaveLength(3);
      expect(result.references[0].name).toBe('Dr. First Reference');
      expect(result.references[1].email).toBe('second@university.edu');
      expect(result.references[2].relationship).toBe('Department Head');
    });
  });
});