// Generate short unique registration code
export function generateRegistrationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0, O, 1, I
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `REG-${code}`; // Format: REG-A1B2C3
}

// Alternative: Generate numeric code
export function generateNumericCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `REG-${num}`; // Format: REG-123456
}

// Alternative: Generate short alphanumeric
export function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // Format: A1B2C3 (6 chars)
}
