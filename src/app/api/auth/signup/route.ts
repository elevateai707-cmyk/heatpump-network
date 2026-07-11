/**
 * Registration API endpoint
 * Creates a new user with password hash and returns success
 */

import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate
    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password and create user
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        passwordHash,
        role: role || "HOMEOWNER",
      },
    });

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("[Auth/Register] Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
