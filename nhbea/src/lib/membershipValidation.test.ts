import {
  validateProfessionalMembershipForm,
  validateRenewalRequirements,
  professionalMembershipSchema
} from './membershipValidation';

describe('Membership Validation', () => {
  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    institution: 'Test University',
    position: 'Professor',
    yearsExperience: 10,
    address: '123 Main St',
    city: 'Manchester',
    state: 'NH' as const,
    zipCode: '03101',
    membershipType: 'new' as const,
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true
    }
  };

  describe('validateProfessionalMembershipForm', () => {
    it('validates correct form data', () => {
      const result = validateProfessionalMembershipForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validFormData);
      expect(result.errors).toBeUndefined();
    });

    it('rejects invalid email', () => {
      const invalidData = {
        ...validFormData,
        email: 'invalid-email'
      };

      const result = validateProfessionalMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('email'))).toBe(true);
    });

    it('rejects invalid phone number', () => {
      const invalidData = {
        ...validFormData,
        phone: '123'
      };

      const result = validateProfessionalMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('phone'))).toBe(true);
    });

    it('rejects invalid ZIP code', () => {
      const invalidData = {
        ...validFormData,
        zipCode: '123'
      };

      const result = validateProfessionalMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('zipCode'))).toBe(true);
    });

    it('rejects negative years of experience', () => {
      const invalidData = {
        ...validFormData,
        yearsExperience: -1
      };

      const result = validateProfessionalMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('yearsExperience'))).toBe(true);
    });

    it('rejects invalid state', () => {
      const invalidData = {
        ...validFormData,
        state: 'XX' as any
      };

      const result = validateProfessionalMembershipForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('state'))).toBe(true);
    });

    it('requires previous member number for renewal membership', () => {
      const renewalData = {
        ...validFormData,
        membershipType: 'renewal' as const,
        previousMemberNumber: undefined
      };

      const result = validateProfessionalMembershipForm(renewalData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('previousMemberNumber'))).toBe(true);
    });

    it('accepts valid renewal membership with previous member number', () => {
      const renewalData = {
        ...validFormData,
        membershipType: 'renewal' as const,
        previousMemberNumber: 'NHBEA-2023-0001'
      };

      const result = validateProfessionalMembershipForm(renewalData);
      expect(result.isValid).toBe(true);
      expect(result.data?.previousMemberNumber).toBe('NHBEA-2023-0001');
    });
  });

  describe('validateRenewalRequirements', () => {
    it('validates new membership without previous member number', () => {
      const data = {
        membershipType: 'new' as const
      };

      const result = validateRenewalRequirements(data);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('validates renewal membership with previous member number', () => {
      const data = {
        membershipType: 'renewal' as const,
        previousMemberNumber: 'NHBEA-2023-0001'
      };

      const result = validateRenewalRequirements(data);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('identifies missing previous member number for renewal', () => {
      const data = {
        membershipType: 'renewal' as const
      };

      const result = validateRenewalRequirements(data);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('previousMemberNumber');
    });

    it('identifies empty previous member number for renewal', () => {
      const data = {
        membershipType: 'renewal' as const,
        previousMemberNumber: ''
      };

      const result = validateRenewalRequirements(data);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('previousMemberNumber');
    });
  });
});