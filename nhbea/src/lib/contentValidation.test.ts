import {
  validateHomepageContent,
  validateContentSection,
  validateRequiredFields,
  validateImageURL,
  performContentIntegrityCheck,
  createSafeContent
} from './contentValidation';
import { HomepageContent, ContentSection } from '@/types/content';

describe('Content Validation', () => {
  describe('validateHomepageContent', () => {
    const validHomepageContent: HomepageContent = {
      heroTitle: 'Test Hero Title',
      heroSubtitle: 'Test Hero Subtitle',
      heroImageURL: 'https://example.com/hero.jpg',
      missionTitle: 'Our Mission',
      missionContent: 'This is our mission statement that is long enough to be meaningful.',
      aboutTitle: 'About Us',
      aboutContent: 'This is about us content that provides meaningful information.'
    };

    it('should validate correct homepage content', () => {
      const result = validateHomepageContent(validHomepageContent);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validHomepageContent);
      expect(result.errors).toBeUndefined();
    });

    it('should reject content with missing required fields', () => {
      const invalidContent = {
        heroTitle: 'Test Hero Title',
        // Missing heroSubtitle
        missionTitle: 'Our Mission',
        missionContent: 'Mission content',
        aboutTitle: 'About Us',
        aboutContent: 'About content'
      };

      const result = validateHomepageContent(invalidContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('heroSubtitle'))).toBe(true);
    });

    it('should reject content with empty required fields', () => {
      const invalidContent = {
        ...validHomepageContent,
        heroTitle: '', // Empty required field
      };

      const result = validateHomepageContent(invalidContent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(error => error.includes('heroTitle'))).toBe(true);
    });

    it('should accept content with empty optional fields', () => {
      const contentWithoutImage = {
        ...validHomepageContent,
        heroImageURL: ''
      };

      const result = validateHomepageContent(contentWithoutImage);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid URL format', () => {
      const contentWithInvalidURL = {
        ...validHomepageContent,
        heroImageURL: 'not-a-valid-url'
      };

      const result = validateHomepageContent(contentWithInvalidURL);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateContentSection', () => {
    const validContentSection: ContentSection = {
      id: 'test-section',
      title: 'Test Section Title',
      content: 'This is test content for the section.',
      imageURL: 'https://example.com/section.jpg',
      order: 1
    };

    it('should validate correct content section', () => {
      const result = validateContentSection(validContentSection);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validContentSection);
    });

    it('should reject content section with missing required fields', () => {
      const invalidSection = {
        id: 'test-section',
        title: 'Test Title',
        // Missing content field
        order: 1
      };

      const result = validateContentSection(invalidSection);
      expect(result.isValid).toBe(false);
      expect(result.errors?.some(error => error.includes('content'))).toBe(true);
    });

    it('should reject content section with invalid order', () => {
      const invalidSection = {
        ...validContentSection,
        order: -1 // Invalid negative order
      };

      const result = validateContentSection(invalidSection);
      expect(result.isValid).toBe(false);
      expect(result.errors?.some(error => error.includes('order'))).toBe(true);
    });
  });

  describe('validateRequiredFields', () => {
    it('should validate when all required fields are present and non-empty', () => {
      const content = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author'
      };

      const result = validateRequiredFields(content, ['title', 'content', 'author']);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
      expect(result.emptyFields).toHaveLength(0);
    });

    it('should identify missing fields', () => {
      const content = {
        title: 'Test Title',
        content: 'Test Content'
        // Missing author field
      };

      const result = validateRequiredFields(content, ['title', 'content', 'author']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('author');
    });

    it('should identify empty fields', () => {
      const content = {
        title: 'Test Title',
        content: '', // Empty field
        author: 'Test Author'
      };

      const result = validateRequiredFields(content, ['title', 'content', 'author']);
      expect(result.isValid).toBe(false);
      expect(result.emptyFields).toContain('content');
    });

    it('should identify whitespace-only fields as empty', () => {
      const content = {
        title: 'Test Title',
        content: '   ', // Whitespace only
        author: 'Test Author'
      };

      const result = validateRequiredFields(content, ['title', 'content', 'author']);
      expect(result.isValid).toBe(false);
      expect(result.emptyFields).toContain('content');
    });
  });

  describe('validateImageURL', () => {
    it('should accept valid URLs', async () => {
      const validURL = 'https://example.com/image.jpg';
      const result = await validateImageURL(validURL);
      expect(result).toBe(true);
    });

    it('should accept empty URLs (optional images)', async () => {
      const emptyURL = '';
      const result = await validateImageURL(emptyURL);
      expect(result).toBe(true);
    });

    it('should reject invalid URL formats', async () => {
      const invalidURL = 'not-a-url';
      const result = await validateImageURL(invalidURL);
      expect(result).toBe(false);
    });

    it('should reject malformed URLs', async () => {
      const malformedURL = 'http://';
      const result = await validateImageURL(malformedURL);
      expect(result).toBe(false);
    });
  });

  describe('performContentIntegrityCheck', () => {
    const validHomepageContent: HomepageContent = {
      heroTitle: 'Test Hero Title',
      heroSubtitle: 'Test Hero Subtitle',
      heroImageURL: 'https://example.com/hero.jpg',
      missionTitle: 'Our Mission',
      missionContent: 'This is a comprehensive mission statement that provides detailed information about our organization and goals.',
      aboutTitle: 'About Us',
      aboutContent: 'This is detailed information about our organization, our history, and our mission to serve the community.'
    };

    it('should pass comprehensive validation for valid homepage content', async () => {
      const result = await performContentIntegrityCheck(validHomepageContent, 'homepage');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validatedData).toBeDefined();
    });

    it('should generate warnings for short content', async () => {
      const shortContent = {
        ...validHomepageContent,
        missionContent: 'Short', // Too short
        aboutContent: 'Also short' // Too short
      };

      const result = await performContentIntegrityCheck(shortContent, 'homepage');
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('Mission'))).toBe(true);
      expect(result.warnings.some(w => w.includes('About'))).toBe(true);
    });

    it('should fail validation for invalid content structure', async () => {
      const invalidContent = {
        heroTitle: '', // Empty required field
        heroSubtitle: 'Valid subtitle'
        // Missing other required fields
      };

      const result = await performContentIntegrityCheck(invalidContent, 'homepage');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-object content', async () => {
      const result = await performContentIntegrityCheck('not an object', 'homepage');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content must be a valid object');
    });

    it('should reject null content', async () => {
      const result = await performContentIntegrityCheck(null, 'homepage');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content must be a valid object');
    });
  });

  describe('createSafeContent', () => {
    const fallbackContent: HomepageContent = {
      heroTitle: 'Fallback Hero Title',
      heroSubtitle: 'Fallback Hero Subtitle',
      heroImageURL: 'https://fallback.com/hero.jpg',
      missionTitle: 'Fallback Mission',
      missionContent: 'Fallback mission content',
      aboutTitle: 'Fallback About',
      aboutContent: 'Fallback about content'
    };

    it('should return original content when all fields are present', () => {
      const originalContent: HomepageContent = {
        heroTitle: 'Original Hero Title',
        heroSubtitle: 'Original Hero Subtitle',
        heroImageURL: 'https://original.com/hero.jpg',
        missionTitle: 'Original Mission',
        missionContent: 'Original mission content',
        aboutTitle: 'Original About',
        aboutContent: 'Original about content'
      };

      const result = createSafeContent(originalContent, fallbackContent);
      expect(result).toEqual(originalContent);
    });

    it('should use fallback values for missing fields', () => {
      const partialContent = {
        heroTitle: 'Original Hero Title',
        heroSubtitle: 'Original Hero Subtitle',
        // Missing other fields
      };

      const result = createSafeContent(partialContent, fallbackContent);
      expect(result.heroTitle).toBe('Original Hero Title');
      expect(result.heroSubtitle).toBe('Original Hero Subtitle');
      expect(result.missionTitle).toBe('Fallback Mission');
      expect(result.missionContent).toBe('Fallback mission content');
    });

    it('should use fallback values for empty string fields', () => {
      const contentWithEmptyFields = {
        ...fallbackContent,
        heroTitle: '', // Empty field should use fallback
        missionContent: 'Original mission content' // Non-empty should be kept
      };

      const result = createSafeContent(contentWithEmptyFields, fallbackContent);
      expect(result.heroTitle).toBe('Fallback Hero Title');
      expect(result.missionContent).toBe('Original mission content');
    });

    it('should return fallback content when input is null', () => {
      const result = createSafeContent(null, fallbackContent);
      expect(result).toEqual(fallbackContent);
    });

    it('should return fallback content when input is undefined', () => {
      const result = createSafeContent(undefined, fallbackContent);
      expect(result).toEqual(fallbackContent);
    });

    it('should preserve non-null, non-empty values including zero', () => {
      const contentWithZero = {
        ...fallbackContent,
        order: 0, // Zero should be preserved
        count: null, // Null should use fallback if exists
        active: false // False should be preserved
      };

      const fallbackWithNumbers = {
        ...fallbackContent,
        order: 5,
        count: 10,
        active: true
      };

      const result = createSafeContent(contentWithZero, fallbackWithNumbers);
      expect(result.order).toBe(0);
      expect(result.count).toBe(10);
      expect(result.active).toBe(false);
    });
  });
});