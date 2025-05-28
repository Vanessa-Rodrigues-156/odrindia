"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginHandler;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function loginHandler(req, res) {
    const { email, password: inputPassword } = req.body;
    if (!email || !inputPassword) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }
    const isValid = await bcryptjs_1.default.compare(inputPassword, user.password);
    if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password." });
    }
    const { password: userPassword, ...userWithoutPassword } = user;
    const token = jsonwebtoken_1.default.sign(userWithoutPassword, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: userWithoutPassword, token });
}
