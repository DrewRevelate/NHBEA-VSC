import {
  validateConferenceRegistrationForm,
  validateRegistrationRequirements,
  sanitizeRegistrationData,
  determineRegistrationType,
  calculateRegistrationFee,
  ConferenceRegistrationFormData,
  conferenceRegistrationSchema
} from './conferenceValidation';

describe('Conference Registration Validation', () => {
  const validRegistrationData: ConferenceRegistrationFormData = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    institution: 'Example University',
    jobTitle: 'Professor',
    membershipStatus: 'member',
    membershipId: 'MEM-12345',
    address: '123 Main St',
    city: 'Anytown',
    state: 'NH',
    zipCode: '03101',
    registrationType: 'regular',
    dietaryRestrictions: 'No peanuts',
    accessibilityNeeds: '',
    sessionPreferences: ['Session 1', 'Session 2'],
    networkingOptIn: true,
    agreeToTerms: true,
    marketingConsent: false,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  };

  describe('validateConferenceRegistrationForm', () => {
    it('should validate correct registration data', () => {
      const result = validateConferenceRegistrationForm(validRegistrationData);
      expect(result.isValid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should reject invalid email', () => {
      const invalidData = { ...validRegistrationData, email: 'invalid-email' };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email: Please enter a valid email address');
    });

    it('should reject empty full name', () => {
      const invalidData = { ...validRegistrationData, fullName: '' };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('fullName: Full name is required');
    });

    it('should reject invalid phone number', () => {
      const invalidData = { ...validRegistrationData, phone: '123' };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('phone: Please enter a valid phone number');
    });

    it('should accept optional phone number when empty', () => {
      const dataWithoutPhone = { ...validRegistrationData, phone: undefined };
      const result = validateConferenceRegistrationForm(dataWithoutPhone);
      expect(result.isValid).toBe(true);
    });

    it('should require membership ID for members', () => {
      const invalidData = { 
        ...validRegistrationData, 
        membershipStatus: 'member' as const,
        membershipId: '' 
      };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('membershipId: Membership ID is required for current members');
    });

    it('should not require membership ID for non-members', () => {
      const validData = { 
        ...validRegistrationData, 
        membershipStatus: 'non-member' as const,
        membershipId: undefined 
      };
      const result = validateConferenceRegistrationForm(validData);
      expect(result.isValid).toBe(true);
    });

    it('should require terms agreement', () => {
      const invalidData = { ...validRegistrationData, agreeToTerms: false };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('agreeToTerms: You must agree to the terms and conditions');
    });

    it('should validate ZIP code format', () => {
      const invalidData = { ...validRegistrationData, zipCode: '123' };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('zipCode: Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    });

    it('should accept valid ZIP code formats', () => {
      const validZipCodes = ['12345', '12345-6789', '03101'];
      
      validZipCodes.forEach(zipCode => {
        const validData = { ...validRegistrationData, zipCode };
        const result = validateConferenceRegistrationForm(validData);
        expect(result.isValid).toBe(true);
      });
    });

    it('should validate session preferences limit', () => {
      const tooManyPreferences = Array(15).fill('Session');
      const invalidData = { ...validRegistrationData, sessionPreferences: tooManyPreferences };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('sessionPreferences: You can select up to 10 session preferences');
    });

    it('should handle emergency contact validation', () => {
      const invalidData = {
        ...validRegistrationData,
        emergencyContact: {
          name: '',
          phone: '',
          relationship: 'Spouse'
        }
      };
      const result = validateConferenceRegistrationForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('emergencyContact: Emergency contact must include at least a name or phone number');
    });
  });

  describe('validateRegistrationRequirements', () => {
    it('should pass validation for complete data', () => {
      const result = validateRegistrationRequirements(validRegistrationData);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should identify missing required fields', () => {
      const incompleteData = {
        fullName: '',
        email: '',
        institution: '',
        membershipStatus: undefined,
        registrationType: undefined,
        agreeToTerms: false
      } as any;

      const result = validateRegistrationRequirements(incompleteData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('fullName');
      expect(result.missingFields).toContain('email');
      expect(result.missingFields).toContain('institution');
      expect(result.missingFields).toContain('membershipStatus');
      expect(result.missingFields).toContain('registrationType');
      expect(result.missingFields).toContain('agreeToTerms');
    });

    it('should require membership ID for members', () => {
      const memberData = {
        ...validRegistrationData,
        membershipStatus: 'member' as const,
        membershipId: ''
      };

      const result = validateRegistrationRequirements(memberData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('membershipId');
    });
  });

  describe('sanitizeRegistrationData', () => {
    it('should remove script tags', () => {
      const maliciousData = {
        fullName: 'John<script>alert("xss")</script>Doe',
        email: 'john@example.com',
        institution: 'Evil<script>University</script>'
      };

      const sanitized = sanitizeRegistrationData(maliciousData);
      expect(sanitized.fullName).toBe('JohnDoe');
      expect(sanitized.institution).toBe('Evil');
    });

    it('should remove javascript: URLs', () => {
      const maliciousData = {
        fullName: 'javascript:alert("xss")',
        email: 'john@example.com'
      };

      const sanitized = sanitizeRegistrationData(maliciousData);
      expect(sanitized.fullName).toBe('alert("xss")');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(2000);
      const dataWithLongString = {
        fullName: longString,
        email: 'john@example.com'
      };

      const sanitized = sanitizeRegistrationData(dataWithLongString);
      expect(sanitized.fullName?.length).toBe(1000);
    });

    it('should handle emergency contact sanitization', () => {
      const dataWithEmergencyContact = {
        fullName: 'John Doe',
        emergencyContact: {
          name: 'Jane<script>alert("xss")</script>Doe',
          phone: '(555) 123-4567',
          relationship: 'Spouse<script>Evil</script>'
        }
      };

      const sanitized = sanitizeRegistrationData(dataWithEmergencyContact);
      expect(sanitized.emergencyContact?.name).toBe('JaneDoe');
      expect(sanitized.emergencyContact?.relationship).toBe('Spouse');
    });
  });

  describe('determineRegistrationType', () => {
    it('should return student for student membership', () => {
      const result = determineRegistrationType('student');
      expect(result).toBe('student');
    });

    it('should return early_bird when deadline has not passed', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const result = determineRegistrationType('member', futureDate);
      expect(result).toBe('early_bird');
    });

    it('should return regular when early bird deadline has passed', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const result = determineRegistrationType('member', pastDate);
      expect(result).toBe('regular');
    });

    it('should return regular when no early bird deadline provided', () => {
      const result = determineRegistrationType('member');
      expect(result).toBe('regular');
    });
  });

  describe('calculateRegistrationFee', () => {
    const mockFees = {
      member: 100,
      nonMember: 150,
      student: 50,
      earlyBird: {
        amount: 75,
        deadline: new Date(Date.now() + 86400000) // Tomorrow
      }
    };

    it('should calculate early bird pricing', () => {
      const fee = calculateRegistrationFee('early_bird', 'member', mockFees);
      expect(fee).toBe(75);
    });

    it('should calculate student pricing', () => {
      const fee = calculateRegistrationFee('student', 'student', mockFees);
      expect(fee).toBe(50);
    });

    it('should calculate member pricing', () => {
      const fee = calculateRegistrationFee('regular', 'member', mockFees);
      expect(fee).toBe(100);
    });

    it('should calculate non-member pricing', () => {
      const fee = calculateRegistrationFee('regular', 'non-member', mockFees);
      expect(fee).toBe(150);
    });

    it('should prioritize student pricing over member status', () => {
      const fee = calculateRegistrationFee('student', 'member', mockFees);
      expect(fee).toBe(50);
    });

    it('should handle missing early bird configuration', () => {
      const feesWithoutEarlyBird = {
        member: 100,
        nonMember: 150,
        student: 50
      };

      const fee = calculateRegistrationFee('early_bird', 'member', feesWithoutEarlyBird);
      expect(fee).toBe(100); // Falls back to member pricing
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      const result = validateConferenceRegistrationForm(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle null values gracefully', () => {
      const result = validateConferenceRegistrationForm(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle empty object', () => {
      const result = validateConferenceRegistrationForm({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should handle special characters in names', () => {
      const dataWithSpecialChars = {
        ...validRegistrationData,
        fullName: "John O'Connor-Smith Jr."
      };
      
      const result = validateConferenceRegistrationForm(dataWithSpecialChars);
      expect(result.isValid).toBe(true);
    });

    it('should reject names with numbers', () => {
      const dataWithNumbers = {
        ...validRegistrationData,
        fullName: "John123 Doe"
      };
      
      const result = validateConferenceRegistrationForm(dataWithNumbers);
      expect(result.isValid).toBe(false);
    });
  });
});