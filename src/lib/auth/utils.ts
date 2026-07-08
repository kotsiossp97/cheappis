export const validatePassword = (
  password: string,
  detailed: boolean = false,
) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Required check
  if (!password || password.length === 0) {
    return detailed ? "password.required" : "password.tooWeak";
  }

  // Collect issues instead of returning early
  const issues: string[] = [];

  if (password.length < minLength) issues.push("password.tooShort");
  if (!hasUpperCase) issues.push("password.missingUppercase");
  if (!hasLowerCase) issues.push("password.missingLowercase");
  if (!hasNumber) issues.push("password.missingNumber");
  if (!hasSpecialChar) issues.push("password.missingSpecial");

  // If no issues → valid
  if (issues.length === 0) {
    return null;
  }

  // If not detailed → return generic weak password code
  if (!detailed) {
    return "password.tooWeak";
  }

  // Detailed → return first specific issue
  return issues[0];
};
