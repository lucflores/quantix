import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const TOKEN_TTL = "8h";
const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

export async function register(req, res) {
  try {
    let { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password requeridos" });
    }
    email = String(email).trim().toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email ya registrado" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hash, role: role || "EMPLEADO" },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function login(req, res) {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password requeridos" });
    }
    email = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken(user);
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: "Error de autenticación" });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Contraseña actual incorrecta" });

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash, mustChangePassword: false }
    });

    return res.json({ ok: true, message: "Contraseña actualizada" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
