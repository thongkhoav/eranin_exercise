import crypto from "crypto";
export const generateUniqueToken = () => crypto.randomBytes(32).toString("hex");
