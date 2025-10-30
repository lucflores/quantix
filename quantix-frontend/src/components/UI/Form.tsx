import React from "react";
import { Card, CardBody, CardHeader } from "./Card";

export default function Form({ title, children, actions }: {title:string; children:React.ReactNode; actions?:React.ReactNode}) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <div className="mb-3">{children}</div>
        {actions && <div className="d-flex gap-2 justify-content-end">{actions}</div>}
      </CardBody>
    </Card>
  );
}
