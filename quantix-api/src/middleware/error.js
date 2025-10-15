export function errorHandler(err, _req, res, _next) {
  // Muestra errores internos del AggregateError
  if (err && err.name === "AggregateError" && Array.isArray(err.errors)) {
    console.error("AggregateError inner errors:");
    for (const e of err.errors) {
      console.error("-", e?.name || typeof e, e?.message || e);
      if (e?.stack) console.error(e.stack);
    }
  } else {
    console.error(err);
  }

  const status = err.status || 500;
  const payload =
    process.env.NODE_ENV === "production"
      ? { error: "Internal Server Error" }
      : { error: err?.message || String(err), name: err?.name, stack: err?.stack };
  res.status(status).json(payload);
}
