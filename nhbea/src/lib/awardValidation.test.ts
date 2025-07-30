import { 
  awardNominationFormSchema, 
  awardSelectionSchema,
  nomineeInformationSchema,
  nominatorInformationSchema,
  nominationDetailsSchema,
  awardValidationUtils,
  type AwardNominationFormData 
} from './awardValidation';

describe('Award Validation Schemas', () => {
  
  describe('awardSelectionSchema', () => {
    it('should validate valid award selection', () => {
      const validData = {
        awardId: 'award123',
        awardCategory: 'Excellence' as const
      };

      const result = awardSelectionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid award category', () => {
      const invalidData = {
        awardId: 'award123',
        awardCategory: 'InvalidCategory'
      };

      const result = awardSelectionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing award ID', () => {
      const invalidData = {
        awardCategory: 'Excellence'
      };

      const result = awardSelectionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('nomineeInformationSchema', () => {
    it('should validate valid nominee information', () => {
      const validData = {
        nomineeInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          organization: 'Test School',
          position: 'Teacher'
        }
      };

      const result = nomineeInformationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        nomineeInfo: {
          name: 'John Doe',
          email: 'invalid-email',
          organization: 'Test School',
          position: 'Teacher'
        }
      };

      const result = nomineeInformationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      const invalidData = {
        nomineeInfo: {
          name: 'John123 Doe',
          email: 'john.doe@example.com',
          organization: 'Test School',
          position: 'Teacher'
        }
      };

      const result = nomineeInformationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept names with valid special characters', () => {
      const validData = {
        nomineeInfo: {
          name: "Mary O'Connor-Smith",
          email: 'mary@example.com',
          organization: 'Test School',
          position: 'Teacher'
        }
      };

      const result = nomineeInformationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('nominatorInformationSchema', () => {
    it('should validate valid nominator information', () => {
      const validData = {
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          organization: 'Another School',
          position: 'Principal'
        }
      };

      const result = nominatorInformationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow optional organization and position', () => {
      const validData = {
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com'
        }
      };

      const result = nominatorInformationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('nominationDetailsSchema', () => {
    it('should validate valid nomination details', () => {
      const validData = {
        nominationText: 'This is a detailed nomination statement that meets the minimum character requirement of 50 characters and provides meaningful information about the nominee.',
        agreedToTerms: true
      };

      const result = nominationDetailsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject nomination text that is too short', () => {
      const invalidData = {
        nominationText: 'Too short',
        agreedToTerms: true
      };

      const result = nominationDetailsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject nomination text that is too long', () => {
      const invalidData = {
        nominationText: 'x'.repeat(2001),
        agreedToTerms: true
      };

      const result = nominationDetailsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject when terms are not agreed', () => {
      const invalidData = {
        nominationText: 'This is a detailed nomination statement that meets the minimum character requirement of 50 characters.',
        agreedToTerms: false
      };

      const result = nominationDetailsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

  });

  describe('awardNominationFormSchema (complete form)', () => {
    const validFormData: AwardNominationFormData = {
      awardId: 'award123',
      awardCategory: 'Excellence',
      nomineeInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        organization: 'Test School',
        position: 'Teacher'
      },
      nominatorInfo: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        organization: 'Another School',
        position: 'Principal'
      },
      nominationText: 'This is a comprehensive nomination statement that describes why John Doe deserves this award. He has shown exceptional dedication to business education.',
      agreedToTerms: true
    };

    it('should validate complete valid form data', () => {
      const result = awardNominationFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should reject form with missing required fields', () => {
      const invalidData = {
        ...validFormData,
        nomineeInfo: {
          ...validFormData.nomineeInfo,
          name: ''
        }
      };

      const result = awardNominationFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Award Validation Utils', () => {
  
  describe('validateNominationForm', () => {
    const validFormData = {
      awardId: 'award123',
      awardCategory: 'Excellence',
      nomineeInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        organization: 'Test School',
        position: 'Teacher'
      },
      nominatorInfo: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        organization: 'Another School',
        position: 'Principal'
      },
      nominationText: 'This is a comprehensive nomination statement that describes why John Doe deserves this award.',
      agreedToTerms: true
    };

    it('should return valid result for correct data', () => {
      const result = awardValidationUtils.validateNominationForm(validFormData);
      
      expect(result.isValid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should return invalid result with errors for incorrect data', () => {
      const invalidData = {
        ...validFormData,
        nomineeInfo: {
          ...validFormData.nomineeInfo,
          email: 'invalid-email'
        }
      };

      const result = awardValidationUtils.validateNominationForm(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('validateStep', () => {
    it('should validate step 1 correctly', () => {
      const stepData = {
        awardId: 'award123',
        awardCategory: 'Excellence'
      };

      const result = awardValidationUtils.validateStep(1, stepData);
      expect(result.isValid).toBe(true);
    });

    it('should validate step 2 correctly', () => {
      const stepData = {
        nomineeInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        }
      };

      const result = awardValidationUtils.validateStep(2, stepData);
      expect(result.isValid).toBe(true);
    });

    it('should return errors for invalid step data', () => {
      const invalidStepData = {
        nomineeInfo: {
          name: '',
          email: 'invalid-email'
        }
      };

      const result = awardValidationUtils.validateStep(2, invalidStepData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle invalid step number', () => {
      const result = awardValidationUtils.validateStep(99, {});
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('sanitizeText', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> world';
      const result = awardValidationUtils.sanitizeText(input);
      expect(result).toBe('Hello  world');
    });

    it('should remove javascript: protocols', () => {
      const input = 'Click javascript:alert("xss") here';
      const result = awardValidationUtils.sanitizeText(input);
      expect(result).toBe('Click alert("xss") here');
    });

    it('should trim whitespace', () => {
      const input = '  Hello world  ';
      const result = awardValidationUtils.sanitizeText(input);
      expect(result).toBe('Hello world');
    });

    it('should enforce maximum length', () => {
      const input = 'x'.repeat(3000);
      const result = awardValidationUtils.sanitizeText(input);
      expect(result.length).toBe(2000);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format field error messages correctly', () => {
      const result = awardValidationUtils.formatErrorMessage('nomineeInfo.email', 'Invalid email format');
      expect(result).toBe('Nominee Email: Invalid email format');
    });

    it('should handle unknown field paths', () => {
      const result = awardValidationUtils.formatErrorMessage('unknownField', 'Some error');
      expect(result).toBe('unknownField: Some error');
    });
  });
});