import React from "react";

export default function InventoryTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <p className="text-slate-600 text-center py-8">
        재고 항목이 없습니다. 새 항목을 추가해주세요.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
              상품명
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
              수량
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
              설명
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className={`${idx % 2 ? "bg-slate-50/60" : "bg-white"} border-b`}
            >
              <td className="py-3 px-4 text-slate-800">{item.name}</td>
              <td className="py-3 px-4 text-slate-800">{item.quantity}</td>
              <td className="py-3 px-4 text-slate-800">
                {item.description || "-"}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-amber-600 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
                    className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
