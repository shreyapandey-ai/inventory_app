import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}


// REGISTER
export async function register(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 8);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
}

// LOGIN
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) throw new Error("Invalid password");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
}
