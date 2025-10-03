import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajusta a ruta relativa si no usas alias
import bcrypt from "bcrypt";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = schema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ese correo ya está registrado." },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: hash, name: name || null },
      select: { id: true, email: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(err) || "Registro fallido" },
      { status: 400 }
    );
  }
}
