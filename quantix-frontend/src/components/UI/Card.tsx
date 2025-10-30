import React from "react";
import clsx from "clsx";

export function Card({ className, children }: React.PropsWithChildren<{className?: string}>) {
  return <div className={clsx("q-card", className)}>{children}</div>;
}
export function CardHeader({ className, children }: React.PropsWithChildren<{className?: string}>) {
  return <div className={clsx("q-card-header", className)}>{children}</div>;
}
export function CardBody({ className, children }: React.PropsWithChildren<{className?: string}>) {
  return <div className={clsx("q-card-body", className)}>{children}</div>;
}
