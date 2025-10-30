import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}
export default function Button({ variant="primary", size="md", loading, iconLeft, iconRight, className, children, ...rest }: Props) {
  return (
    <button
      className={clsx("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {iconLeft && <span className="me-2">{iconLeft}</span>}
      {loading ? "Cargando..." : children}
      {iconRight && <span className="ms-2">{iconRight}</span>}
    </button>
  );
}
