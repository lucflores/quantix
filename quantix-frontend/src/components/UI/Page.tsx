import React from "react";
import Button from "./Button";
import clsx from "clsx";

interface Props {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export default function Page({ title, actions, children, className }: Props) {
  return (
    <div className={clsx("q-page", className)}>
      <div className="d-flex align-items-center justify-content-between mb-3 q-header">
        <h6 className="q-page__title">{title}</h6>
        <div className="q-page__actions">{actions}</div>
      </div>
      {children}
    </div>
  );
}
