import { Request, Response, NextFunction } from "express";
import Blowfish from "blowfish-node";
import logger from "./logger";

const blowfishKey = process.env.BLOWFISH_KEY || "defaultBlowfishKey";
const blowfish = new Blowfish(
  blowfishKey,
  Blowfish.MODE.ECB,
  // Padding scheme, this thing helps to make the data length a multiple of 8.. I think
  Blowfish.PADDING.PKCS5
);
blowfish.setIv("abcdefgh");

// Middleware to decrypt request body
export const decryptReq = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.encrypted) {
    try {
      const decodedData = blowfish.decode(
        req.body.encrypted,
        Blowfish.TYPE.JSON_OBJECT
      );
      req.body = decodedData; // this replace the request body with the decrypted data
    } catch (err) {
      return res.status(400).json({ error: "Failed to decrypt request body" });
    }
  }
  next();
};

// Middleware to encrypt response body
export const encryptRes = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  // Override res.send to encrypt the response body before sending
  res.send = (body: any) => {
    logger.info(JSON.parse(body));
    if (body) {
      try {
        const encodedData = blowfish.encodeToBase64(JSON.stringify(body));
        // const encodedData = blowfish.encode(body);
        res.setHeader("Content-Encoding", "base64");
        return originalSend.call(res, encodedData);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Failed to encrypt response body" });
      }
    } else {
      return originalSend.call(res, body);
    }
  };

  next();
};
