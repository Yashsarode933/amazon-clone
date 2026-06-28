import {
  registerSchema,
  loginSchema,
  addToCartSchema,
  createAddressSchema,
  createReviewSchema
} from '../utils/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: '123',
        name: 'Test User'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result.success).toBe(true);
    });
  });

  describe('addToCartSchema', () => {
    it('should validate valid cart data', () => {
      const result = addToCartSchema.safeParse({
        productId: 'prod-123',
        quantity: 2
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid quantity', () => {
      const result = addToCartSchema.safeParse({
        productId: 'prod-123',
        quantity: -1
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createAddressSchema', () => {
    it('should validate valid address data', () => {
      const result = createAddressSchema.safeParse({
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const result = createAddressSchema.safeParse({
        fullName: 'John Doe',
        city: 'New York'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createReviewSchema', () => {
    it('should validate valid review data', () => {
      const result = createReviewSchema.safeParse({
        productId: 'prod-123',
        rating: 5,
        comment: 'Great product!'
      });
      expect(result.success).toBe(true);
    });

    it('should reject rating out of range', () => {
      const result = createReviewSchema.safeParse({
        productId: 'prod-123',
        rating: 6,
        comment: 'Great product!'
      });
      expect(result.success).toBe(false);
    });
  });
});
