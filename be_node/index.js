const crypto = require("crypto");
const generateUniqueToken = () => crypto.randomBytes(32).toString("hex");
console.log(generateUniqueToken());
console.log(new Date().toLocaleString());
