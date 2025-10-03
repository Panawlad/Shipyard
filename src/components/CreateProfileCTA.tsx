import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CreateProfileCTA() {
  const session = await getServerSession(authOptions);
  let href = "/auth/signup";

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, profile: { select: { id: true } } },
    });
    href = user?.profile ? "/directory" : "/profile/new";
  }

  return (
    <Link href={href} className="btn-neon px-8 py-4 text-lg">
      Crear mi Perfil
    </Link>
  );
}
