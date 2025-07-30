import { POST } from './route';
import { NextRequest } from 'next/server';
import { nominationsRepository } from '@/lib/awards';
import { awardValidationUtils } from '@/lib/awardValidation';

// Mock the dependencies
jest.mock('@/lib/awards', () => ({
  nominationsRepository: {
    createNomination: jest.fn(),
  }
}));

jest.mock('@/lib/awardValidation', () => ({
  awardValidationUtils: {
    validateNominationForm: jest.fn(),
    sanitizeText: jest.fn((text) => text.replace(/<script.*?<\/script>/gi, '')),
  }
}));

const mockNominationsRepository = nominationsRepository as jest.Mocked<typeof nominationsRepository>;
const mockAwardValidationUtils = awardValidationUtils as jest.Mocked<typeof awardValidationUtils>;

describe('Nominations API Route Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Console spy to suppress error logs during testing
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/nominations', () => {
    const validNominationData = {
      awardId: 'award123',
      awardCategory: 'Excellence',
      nomineeInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        organization: 'Test High School',
        position: 'Business Teacher'
      },
      nominatorInfo: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        organization: 'Another School',
        position: 'Principal'
      },
      nominationText: 'John is an exceptional educator who has transformed business education at our school. His innovative teaching methods and dedication to student success make him truly deserving of this recognition.',
      agreedToTerms: true
    };

    it('should successfully create a nomination with valid data', async () => {
      // Setup mocks
      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: validNominationData,
        errors: null
      });
      
      mockNominationsRepository.createNomination.mockResolvedValue('nomination123');

      // Create request
      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(validNominationData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Execute
      const response = await POST(request);
      const responseData = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Nomination submitted successfully! Thank you for recognizing excellence in business education.',
        nominationId: 'nomination123'
      });

      // Verify validation was called
      expect(mockAwardValidationUtils.validateNominationForm).toHaveBeenCalledWith(validNominationData);

      // Verify nomination was created with proper data structure
      expect(mockNominationsRepository.createNomination).toHaveBeenCalledWith({
        awardId: 'award123',
        awardCategory: 'Excellence',
        nomineeInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          organization: 'Test High School',
          position: 'Business Teacher'
        },
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          organization: 'Another School',
          position: 'Principal'
        },
        nominationText: 'John is an exceptional educator who has transformed business education at our school. His innovative teaching methods and dedication to student success make him truly deserving of this recognition.',
        status: 'pending'
      });
    });

    it('should handle validation errors and return 400 status', async () => {
      // Setup validation to fail
      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: false,
        data: null,
        errors: ['Email is required', 'Nomination text is too short']
      });

      const invalidData = {
        ...validNominationData,
        nomineeInfo: {
          ...validNominationData.nomineeInfo,
          email: '' // Invalid email
        },
        nominationText: 'Too short' // Too short
      };

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        success: false,
        message: 'Form validation failed',
        error: 'Email is required, Nomination text is too short'
      });

      // Verify nomination was not created
      expect(mockNominationsRepository.createNomination).not.toHaveBeenCalled();
    });

    it('should handle database errors and return 503 status', async () => {
      // Setup validation to pass
      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: validNominationData,
        errors: null
      });

      // Setup database to fail
      mockNominationsRepository.createNomination.mockRejectedValue(
        new Error('Failed to submit nomination')
      );

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(validNominationData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(503);
      expect(responseData).toEqual({
        success: false,
        message: 'Unable to submit nomination at this time. Please try again later.',
        error: 'Database error'
      });
    });

    it('should handle unknown errors and return 500 status', async () => {
      // Setup validation to pass
      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: validNominationData,
        errors: null
      });

      // Setup database to fail with unknown error
      mockNominationsRepository.createNomination.mockRejectedValue(
        new Error('Unknown database error')
      );

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(validNominationData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: 'Unknown database error'
      });
    });

    it('should properly sanitize nomination text', async () => {
      const dataWithScripts = {
        ...validNominationData,
        nominationText: 'Great teacher <script>alert("xss")</script> with excellent skills.'
      };

      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: dataWithScripts,
        errors: null
      });

      mockNominationsRepository.createNomination.mockResolvedValue('nomination123');

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(dataWithScripts),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await POST(request);

      // Verify sanitization was called
      expect(mockAwardValidationUtils.sanitizeText).toHaveBeenCalledWith(
        'Great teacher <script>alert("xss")</script> with excellent skills.'
      );
    });

    it('should trim and format organization and position fields correctly', async () => {
      const dataWithWhitespace = {
        ...validNominationData,
        nomineeInfo: {
          name: '  John Doe  ',
          email: '  JOHN@EXAMPLE.COM  ',
          organization: '  Test High School  ',
          position: '  Business Teacher  '
        },
        nominatorInfo: {
          name: '  Jane Smith  ',
          email: '  JANE@EXAMPLE.COM  ',
          organization: '  Another School  ',
          position: '  Principal  '
        }
      };

      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: dataWithWhitespace,
        errors: null
      });

      mockNominationsRepository.createNomination.mockResolvedValue('nomination123');

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(dataWithWhitespace),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await POST(request);

      // Verify nomination was created with trimmed and formatted data
      expect(mockNominationsRepository.createNomination).toHaveBeenCalledWith({
        awardId: 'award123',
        awardCategory: 'Excellence',
        nomineeInfo: {
          name: 'John Doe',
          email: 'john@example.com', // Lowercase and trimmed
          organization: 'Test High School', // Trimmed
          position: 'Business Teacher' // Trimmed
        },
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com', // Lowercase and trimmed
          organization: 'Another School', // Trimmed
          position: 'Principal' // Trimmed
        },
        nominationText: 'John is an exceptional educator who has transformed business education at our school. His innovative teaching methods and dedication to student success make him truly deserving of this recognition.',
        status: 'pending'
      });
    });

    it('should handle optional fields correctly when empty', async () => {
      const dataWithoutOptionalFields = {
        ...validNominationData,
        nomineeInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          // organization and position omitted
        },
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          // organization and position omitted
        }
      };

      mockAwardValidationUtils.validateNominationForm.mockReturnValue({
        isValid: true,
        data: dataWithoutOptionalFields,
        errors: null
      });

      mockNominationsRepository.createNomination.mockResolvedValue('nomination123');

      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: JSON.stringify(dataWithoutOptionalFields),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await POST(request);

      // Verify nomination was created with only required fields
      expect(mockNominationsRepository.createNomination).toHaveBeenCalledWith({
        awardId: 'award123',
        awardCategory: 'Excellence',
        nomineeInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          // organization and position should be undefined, not included
        },
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          // organization and position should be undefined, not included
        },
        nominationText: 'John is an exceptional educator who has transformed business education at our school. His innovative teaching methods and dedication to student success make him truly deserving of this recognition.',
        status: 'pending'
      });
    });

    it('should handle malformed JSON requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/nominations', {
        method: 'POST',
        body: '{ invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('An unexpected error occurred. Please try again.');
    });
  });
});