import { randomBytes, scrypt } from "node:crypto";
import { format, promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;

    return format("%s.%s", buff.toString("hex"), salt);
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return hashedPassword === buff.toString("hex");
  }
}
