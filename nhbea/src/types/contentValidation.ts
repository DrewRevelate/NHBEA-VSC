export interface ContentValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  data?: any;
}

export interface ContentIntegrityResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validatedData?: any;
}

export interface RequiredFieldsValidation {
  isValid: boolean;
  missingFields: string[];
  emptyFields: string[];
}

export type ContentType = 'homepage' | 'section' | 'sponsor';

export interface ContentValidationOptions {
  strict?: boolean;
  validateImages?: boolean;
  minContentLength?: number;
}