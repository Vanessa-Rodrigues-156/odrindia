import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../../middleware/auth";

const JAAS_APP_ID = process.env.JAAS_APP_ID!;
const JAAS_SECRET = process.env.JAAS_SECRET!; // base64-encoded
const JAAS_SDK_ID = process.env.JAAS_SDK_ID!;

export default async function jaasTokenHandler(
  req: AuthRequest,
  res: Response
) {
  const { id } = req.params; // meetingId
  const user = req.user;

  // Check if user is allowed to join this meeting
  const meeting = await prisma.meetingLog.findUnique({ where: { id } });
  if (!meeting) return res.status(404).json({ error: "Meeting not found" });

  // JaaS JWT payload
  const payload = {
    aud: "jitsi",
    iss: JAAS_APP_ID,
    sub: "meet.jit.si",
    room: meeting.jitsiRoomName,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    context: {
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    },
  };

  const token = jwt.sign(payload, Buffer.from(JAAS_SECRET, "base64"), {
    algorithm: "HS256",
    header: { alg: "HS256", kid: JAAS_SDK_ID },
  });

  res.json({ token });
}
