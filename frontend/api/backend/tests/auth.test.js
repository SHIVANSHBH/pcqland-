const { generateRefreshToken, generateCode } = require('../middleware/auth');

describe('Auth Utils', () => {
  test('generateRefreshToken returns 80 char hex string', () => {
    const token = generateRefreshToken();
    expect(token).toMatch(/^[a-f0-9]{80}$/);
  });

  test('generateCode returns 6 digit string by default', () => {
    const code = generateCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  test('generateCode respects custom length', () => {
    const code = generateCode(8);
    expect(code).toMatch(/^\d{8}$/);
  });
});
