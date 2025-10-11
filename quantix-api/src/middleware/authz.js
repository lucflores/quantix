export const can = (action) => (req, res, next) => {
  if (process.env.AUTHZ !== "on") return next(); // apagado = pasa todo
  const role = req.user?.role;
  const policy = {
    ADMIN:    ["product:read","product:create","product:update","product:status","movement:in","movement:out"],
    EMPLEADO: ["product:read","movement:in"] // ← Se tiene que ajustar al final
  };
  if (policy[role]?.includes(action)) return next();
  return res.status(403).json({ error: "Sin permisos" });
};
