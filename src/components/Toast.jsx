import React from "react";

export default function Toast({ type = "success", children }) {
  const base = "rounded-lg px-4 py-3 text-sm shadow";
  const tone =
    type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  return <div className={`${base} ${tone}`}>{children}</div>;
}
