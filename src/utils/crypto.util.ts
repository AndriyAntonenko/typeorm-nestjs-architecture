import { pbkdf2, randomBytes } from 'crypto';

interface PasswordHash {
  hash: string;
  salt: string;
}

export class CryptoUtil {
  static async hashPassword(password: string): Promise<PasswordHash> {
    const salt = await CryptoUtil.generateSalt();
    const hash = await CryptoUtil.generatePasswordHash(password, salt);
    return { salt, hash };
  }

  static generatePasswordHash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 10000, 64, 'sha512', (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash.toString('base64'));
      });
    });
  }

  static generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(128, (err, buf) => {
        if (err) {
          return reject(err);
        }
        resolve(buf.toString('base64'));
      });
    });
  }
}
