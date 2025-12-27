import Joi from 'joi';
import { trackValidationError } from '@/lib/observability';

// Query validation schema
export const councilQuerySchema = Joi.object({
  query: Joi.string()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Query cannot be empty',
      'string.max': 'Query must be less than 10,000 characters',
      'any.required': 'Query is required',
    }),
  domain: Joi.string()
    .valid('general', 'healthcare', 'finance')
    .optional()
    .messages({
      'any.only': 'Domain must be one of: general, healthcare, finance',
    }),
  conversationId: Joi.string().uuid().optional(),
});

// Feedback validation schema
export const feedbackSchema = Joi.object({
  queryId: Joi.string().required().messages({
    'any.required': 'Query ID is required',
  }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required',
    }),
  category: Joi.string()
    .valid('helpful', 'inaccurate', 'unclear', 'other')
    .optional(),
  comment: Joi.string().max(1000).optional().messages({
    'string.max': 'Comment must be less than 1,000 characters',
  }),
});

// File upload validation schema
export const fileUploadSchema = Joi.object({
  filename: Joi.string()
    .max(255)
    .required()
    .pattern(/\.(pdf|docx|txt)$/i)
    .messages({
      'string.max': 'Filename must be less than 255 characters',
      'string.pattern.base': 'Only PDF, DOCX, and TXT files are allowed',
      'any.required': 'Filename is required',
    }),
  filesize: Joi.number()
    .max(10 * 1024 * 1024) // 10MB
    .required()
    .messages({
      'number.max': 'File size must be less than 10MB',
      'any.required': 'File size is required',
    }),
  mimetype: Joi.string()
    .valid('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain')
    .required()
    .messages({
      'any.only': 'Invalid file type',
    }),
});

// Validation function
export const validateCouncilQuery = (data: any) => {
  const { error, value } = councilQuerySchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map(d => d.message);
    trackValidationError('Query validation failed', {
      errors: details,
      input: data,
    });
    return {
      valid: false,
      errors: details,
    };
  }

  // Sanitize query string (remove potentially harmful content)
  const sanitized = {
    ...value,
    query: sanitizeString(value.query),
  };

  return {
    valid: true,
    data: sanitized,
  };
};

// Sanitize string to prevent XSS and injection attacks
export const sanitizeString = (str: string): string => {
  return str
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters (except newlines and tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim();
};

// Validate file upload
export const validateFileUpload = (filename: string, filesize: number, mimetype: string) => {
  const { error, value } = fileUploadSchema.validate({
    filename,
    filesize,
    mimetype,
  });

  if (error) {
    const details = error.details.map(d => d.message);
    trackValidationError('File validation failed', {
      errors: details,
      filename,
      filesize,
    });
    return {
      valid: false,
      errors: details,
    };
  }

  return {
    valid: true,
    data: value,
  };
};

// Validate feedback
export const validateFeedback = (data: any) => {
  const { error, value } = feedbackSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map(d => d.message);
    trackValidationError('Feedback validation failed', {
      errors: details,
    });
    return {
      valid: false,
      errors: details,
    };
  }

  return {
    valid: true,
    data: value,
  };
};

// Check for potentially malicious patterns
export const detectMaliciousContent = (str: string): boolean => {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /eval\s*\(/i,
    /fromCharCode/i,
    /&#/,
    /%3C/i, // URL encoded <
    /%3E/i, // URL encoded >
  ];

  return maliciousPatterns.some(pattern => pattern.test(str));
};
