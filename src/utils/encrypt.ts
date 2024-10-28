import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserResponce } from "../dto/user.dto";
import { JWT_SECRET } from "../utils/dotenv.config";

class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: UserResponce) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}

export default encrypt;
