import React from "react";
import clsx from "clsx";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  width?: string | number;
}
interface Props<T> {
  data: T[];
  columns: Column<T>[];
  hover?: boolean;
  bordered?: boolean;
  className?: string;
}
export default function Table<T>({ data, columns, hover=true, bordered=true, className }: Props<T>) {
  return (
    <div className="table-responsive">
      <table className={clsx("table", hover && "table-hover", bordered && "table-bordered", className)}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={String(c.key)} style={c.width ? { width: c.width } : undefined} className={c.className}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={String(c.key)} className={c.className}>
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
