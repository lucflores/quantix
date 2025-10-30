import React from "react";
import clsx from "clsx";

interface Option { label: string; value: string | number; }
interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}
export default function Select({ id, label, error, options, className, ...rest }: Props) {
  const selectId = id || rest.name;
  return (
    <div className="mb-3">
      {label && <label htmlFor={selectId} className="form-label">{label}</label>}
      <select id={selectId} className={clsx("form-select", error && "is-invalid", className)} {...rest}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
