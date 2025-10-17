import React, { useState, useEffect } from "react";

export default function EditItemModal({ item, onClose, onSave }) {
  const [draft, setDraft] = useState(item);
  const [adjust, setAdjust] = useState("");

  useEffect(() => setDraft(item), [item]);

  const change = (patch) => setDraft((p) => ({ ...p, ...patch }));

  const adjustQuantity = (type) => {
    const val = parseInt(adjust, 10);
    if (isNaN(val) || val <= 0) return;
    let q = draft.quantity;
    q = type === "add" ? q + val : Math.max(0, q - val);
    change({ quantity: q });
    setAdjust("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b p-6">
          <h3 className="text-lg font-bold text-slate-800">재고 항목 수정</h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            상품명
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => change({ name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <label className="mt-4 block text-sm font-medium text-slate-700 mb-1">
            현재 수량
          </label>
          <input
            type="number"
            value={draft.quantity}
            onChange={(e) =>
              change({ quantity: parseInt(e.target.value || "0", 10) })
            }
            className="w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="mt-4 rounded-lg border bg-slate-50 p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              수량 조절
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={adjust}
                onChange={(e) => setAdjust(e.target.value)}
                placeholder="조절 수량"
                className="w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => adjustQuantity("add")}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 transition"
              >
                추가
              </button>
              <button
                onClick={() => adjustQuantity("subtract")}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white shadow hover:bg-rose-700 transition"
              >
                빼기
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              입력값만큼 현재 수량에 더하거나 뺍니다.
            </p>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700 mb-1">
            설명
          </label>
          <input
            type="text"
            value={draft.description}
            onChange={(e) => change({ description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-400 px-5 py-2.5 font-semibold text-white hover:bg-slate-500 transition"
            >
              취소
            </button>
            <button
              onClick={() => onSave(draft)}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
