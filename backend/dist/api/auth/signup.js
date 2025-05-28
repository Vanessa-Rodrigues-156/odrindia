"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = signupHandler;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function signupHandler(req, res) {
    const { name, email, password, userRole, contactNumber, city, country, institution, highestEducation, odrLabUsage, } = req.body;
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ error: "Name, email, and password are required." });
    }
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: "Email already in use." });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            userRole: userRole || "INNOVATOR",
            contactNumber: contactNumber || null,
            city: city || null,
            country: country || null,
            institution: institution || null,
            highestEducation: highestEducation || null,
            odrLabUsage: odrLabUsage || null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            userRole: true,
            contactNumber: true,
            city: true,
            country: true,
            institution: true,
            highestEducation: true,
            odrLabUsage: true,
            createdAt: true,
        },
    });
    res.status(201).json({ user });
}
