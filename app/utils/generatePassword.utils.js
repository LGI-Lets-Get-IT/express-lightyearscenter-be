const bcrypt = require("bcrypt");
const generator = require("generate-password");

const generateRandomPassword = async () => {
  const generatedPassword = generator.generate({
    length: 10,
    symbols: false,
    uppercase: true,
    lowercase: true,
  });

  const hashedPassword = await bcrypt.hash(generatedPassword);

  return hashedPassword;
};

module.exports = generateRandomPassword;
