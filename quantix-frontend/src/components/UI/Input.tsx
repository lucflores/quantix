import React from "react";
import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export default function Input({ id, label, error, hint, className, ...rest }: Props) {
  const inputId = id || rest.name;
  return (
    <div className="mb-3">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input id={inputId} className={clsx("form-control", error && "is-invalid", className)} {...rest} />
      {hint && !error && <div className="form-text">{hint}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
