import React, { useState } from "react";

export default function AddItemForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", quantity: "", description: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: "", quantity: "", description: "" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="상품명"
          className="p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={onChange}
          placeholder="수량"
          className="p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="설명 (선택 사항)"
          className="p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow hover:bg-indigo-700 active:scale-[0.99] transition"
      >
        재고 추가
      </button>
    </form>
  );
}
