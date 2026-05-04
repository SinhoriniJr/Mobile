export function generateSecurePassword() {
  const allowedCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*";
  let generatedPassword = "";

  for (let index = 0; index < 8; index += 1) {
    generatedPassword +=
      allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)];
  }

  return generatedPassword;
}
