import React from "react";

export default function DeleteConfirmModal({ name, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <h4 className="text-lg font-bold text-slate-800">삭제 확인</h4>
        <p className="mt-3 text-slate-700">
          "<span className="font-semibold text-rose-600">{name}</span>" 항목을
          정말로 삭제하시겠습니까?
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-400 px-5 py-2.5 font-semibold text-white hover:bg-slate-500 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-rose-700 transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
