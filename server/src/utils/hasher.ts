import { scrypt } from "node:crypto";

const hasher = async (string: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    scrypt(string, salt, 64, (err, derivedKey) => {
      if (err) {
        console.error("Error hashing string:", err);
        reject(err);
        return;
      }
      const hashedString = derivedKey.toString("hex");
      // console.log("Hashed String:", hashedString);
      resolve(hashedString);
    });
  });
};
export { hasher };
