"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const users_1 = __importDefault(require("./users"));
const analytics_1 = __importDefault(require("./analytics"));
const approve_idea_1 = __importDefault(require("./approve-idea"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
// Middleware to check for ADMIN role
function requireAdmin(req, res, next) {
    if (req.user?.userRole !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}
// List all ideas pending approval
router.get("/ideas/pending", requireAdmin, async (req, res) => {
    const ideas = await prisma_1.default.idea.findMany({
        where: { approved: false },
        include: { owner: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(ideas);
});
// Approve an idea
router.post("/approve-idea", requireAdmin, async (req, res) => {
    const { ideaId } = req.body;
    if (!ideaId)
        return res.status(400).json({ error: "ideaId required" });
    await prisma_1.default.idea.update({ where: { id: ideaId }, data: { approved: true } });
    res.json({ success: true });
});
// Reject (delete) an idea
router.post("/reject-idea", requireAdmin, async (req, res) => {
    const { ideaId } = req.body;
    if (!ideaId)
        return res.status(400).json({ error: "ideaId required" });
    await prisma_1.default.idea.delete({ where: { id: ideaId } });
    res.json({ success: true });
});
router.use("/users", users_1.default);
router.use("/analytics", analytics_1.default);
router.use("/approve-idea", approve_idea_1.default);
exports.default = router;
