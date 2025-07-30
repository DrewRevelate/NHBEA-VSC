import {
  validateStudentMembershipForm,
  validateReference,
  studentMembershipSchema
} from './studentApplicationValidation';

describe('Student Application Validation', () => {
  const validFormData = {
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@student.edu',
      phone: '(555) 987-6543'
    },
    academicInfo: {
      institution: 'Test University',
      major: 'Business Education',
      graduationYear: new Date().getFullYear() + 1,
      gpa: 3.75
    },
    essay: 'I am passionate about business education and want to contribute to the NHBEA community by sharing my insights and learning from experienced educators. This opportunity would help me develop professionally and gain valuable experience in the field.',
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

  describe('validateStudentMembershipForm', () => {
    it('validates correct form data', () => {
      const result = validateStudentMembershipForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validFormData);
      expect(result.errors).toBeUndefined();
    });

    it('rejects invalid email in personal info', () => {
      const invalidData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          email: 'invalid-email'
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('email'))).toBe(true);
    });

    it('rejects invalid phone number', () => {
      const invalidData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          phone: '123'
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('phone'))).toBe(true);
    });

    it('rejects invalid names with special characters', () => {
      const invalidData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          firstName: 'J@ne123'
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('firstName'))).toBe(true);
    });

    it('rejects GPA outside valid range', () => {
      const invalidData = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          gpa: 5.0
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('gpa'))).toBe(true);
    });

    it('rejects negative GPA', () => {
      const invalidData = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          gpa: -1.0
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('gpa'))).toBe(true);
    });

    it('rejects graduation year in the past', () => {
      const invalidData = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          graduationYear: 2020
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('graduationYear'))).toBe(true);
    });

    it('rejects graduation year too far in future', () => {
      const invalidData = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          graduationYear: new Date().getFullYear() + 15
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('graduationYear'))).toBe(true);
    });

    it('rejects essay that is too short', () => {
      const invalidData = {
        ...validFormData,
        essay: 'Too short'
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('essay'))).toBe(true);
    });

    it('rejects essay that is too long', () => {
      const invalidData = {
        ...validFormData,
        essay: 'a'.repeat(2001) // Exceeds 2000 character limit
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('essay'))).toBe(true);
    });

    it('rejects insufficient references', () => {
      const invalidData = {
        ...validFormData,
        references: [
          {
            name: 'Dr. John Professor',
            email: 'j.professor@university.edu',
            relationship: 'Academic Advisor'
          }
        ]
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('references'))).toBe(true);
    });

    it('rejects too many references', () => {
      const invalidData = {
        ...validFormData,
        references: [
          ...validFormData.references,
          {
            name: 'Dr. Third Reference',
            email: 'third@university.edu',
            relationship: 'Professor'
          },
          {
            name: 'Dr. Fourth Reference',
            email: 'fourth@university.edu',
            relationship: 'Department Head'
          }
        ]
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('references'))).toBe(true);
    });

    it('rejects references with invalid email', () => {
      const invalidData = {
        ...validFormData,
        references: [
          {
            name: 'Dr. John Professor',
            email: 'invalid-email',
            relationship: 'Academic Advisor'
          },
          ...validFormData.references.slice(1)
        ]
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('references') && error.includes('email'))).toBe(true);
    });

    it('accepts valid references with proper range', () => {
      const validWithThreeRefs = {
        ...validFormData,
        references: [
          ...validFormData.references,
          {
            name: 'Dr. Third Reference',
            email: 'third@university.edu',
            relationship: 'Department Head'
          }
        ]
      };

      const result = validateStudentMembershipForm(validWithThreeRefs);
      expect(result.isValid).toBe(true);
      expect(result.data?.references).toHaveLength(3);
    });

    it('validates GPA with decimal precision', () => {
      const dataWithDecimalGPA = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          gpa: 3.85
        }
      };

      const result = validateStudentMembershipForm(dataWithDecimalGPA);
      expect(result.isValid).toBe(true);
      expect(result.data?.academicInfo.gpa).toBe(3.85);
    });

    it('rejects GPA with too many decimal places', () => {
      const invalidData = {
        ...validFormData,
        academicInfo: {
          ...validFormData.academicInfo,
          gpa: 3.855 // More than 2 decimal places
        }
      };

      const result = validateStudentMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('gpa'))).toBe(true);
    });
  });

  describe('validateReference', () => {
    const validReference = {
      name: 'Dr. John Professor',
      email: 'j.professor@university.edu',
      relationship: 'Academic Advisor'
    };

    it('validates correct reference data', () => {
      const result = validateReference(validReference);
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('rejects reference with missing name', () => {
      const invalidReference = {
        ...validReference,
        name: ''
      };

      const result = validateReference(invalidReference);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('Name'))).toBe(true);
    });

    it('rejects reference with invalid email', () => {
      const invalidReference = {
        ...validReference,
        email: 'invalid-email'
      };

      const result = validateReference(invalidReference);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('email'))).toBe(true);
    });

    it('rejects reference with missing relationship', () => {
      const invalidReference = {
        ...validReference,
        relationship: ''
      };

      const result = validateReference(invalidReference);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('Relationship'))).toBe(true);
    });
  });

  describe('schema edge cases', () => {
    it('handles empty object', () => {
      const result = validateStudentMembershipForm({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('handles null input', () => {
      const result = validateStudentMembershipForm(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('handles undefined input', () => {
      const result = validateStudentMembershipForm(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('handles non-object input', () => {
      const result = validateStudentMembershipForm('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});