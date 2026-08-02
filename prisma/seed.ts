import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running the seed script."
    );
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  // 1. Seed legacy Admin model
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`Legacy Admin ready: ${admin.email} (${admin.role})`);

  // 2. Seed / Sync Better Auth User with exact ADMIN_PASSWORD
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Remove old user record so signUpEmail re-hashes and sets the updated ADMIN_PASSWORD
      await prisma.user.delete({ where: { email } });
      console.log(`Resetting admin credentials for ${email} with updated ADMIN_PASSWORD...`);
    }

    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Clickpoint Admin",
      },
    });
    console.log(`Better Auth Admin created & synced successfully: ${email}`);
  } catch (err) {
    console.log("Better Auth Seed notice:", err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
