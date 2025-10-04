import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z, ZodError } from "zod";

const schema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio.")
    .email("Correo inválido."),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria.")
    .min(8, "Su contraseña debe ser mayor a 8 caracteres."),
  name: z.string().trim().optional(),
});

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
  } catch (err) {
    if (err instanceof ZodError) {
      // Devuelve solo el primer mensaje corto
      const msg = err.issues[0]?.message ?? "Datos inválidos.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Registro fallido." }, { status: 400 });
  }
}
