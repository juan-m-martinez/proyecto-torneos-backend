import bcrypt from "bcrypt"; /* biblioteca bcrypt */

export const createHash = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const isValidPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}; // Compara la contraseña con su hash