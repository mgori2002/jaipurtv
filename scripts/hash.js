import { hashSync } from "bcryptjs";

const password = "Aa@12345";
const hash = hashSync(password, 10);
console.log(hash);
