import React, { useState } from "react";
import AddItemForm from "./components/AddItemForm";
import InventoryTable from "./components/InventoryTable";
import EditItemModal from "./components/EditItemModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";

function App() {
  // 로컬 상태
  const [inventory, setInventory] = useState([
    { id: "1", name: "마스크", quantity: 20, description: "KF94" },
    { id: "2", name: "손소독제", quantity: 8, description: "500ml" },
  ]);

  const [message, setMessage] = useState({ text: "", type: "" }); // 'success' | 'error'
  const [editingItem, setEditingItem] = useState(null);

  // 삭제 모달
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

  // 추가
  const addItem = ({ name, quantity, description }) => {
    if (!name || quantity === "")
      return showMessage("상품명과 수량은 필수입니다.", "error");
    const parsed = parseInt(quantity, 10);
    if (isNaN(parsed) || parsed < 0)
      return showMessage("수량은 0 이상의 숫자여야 합니다.", "error");

    const newEntry = {
      id: crypto.randomUUID(),
      name,
      quantity: parsed,
      description,
      createdAt: new Date(),
    };
    setInventory((prev) =>
      [...prev, newEntry].sort((a, b) => a.name.localeCompare(b.name))
    );
    showMessage("재고 항목이 추가되었습니다!", "success");
  };

  // 수정 저장
  const saveEditedItem = (next) => {
    if (!next.name || next.quantity === "")
      return showMessage("상품명/수량을 확인해주세요.", "error");
    const parsed = parseInt(next.quantity, 10);
    if (isNaN(parsed) || parsed < 0)
      return showMessage("수량은 0 이상의 숫자여야 합니다.", "error");

    setInventory((prev) =>
      prev
        .map((it) =>
          it.id === next.id
            ? {
                ...it,
                name: next.name,
                quantity: parsed,
                description: next.description,
              }
            : it
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditingItem(null);
    showMessage("재고 항목이 업데이트되었습니다!", "success");
  };

  // 삭제
  const askDelete = (id, name) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    setInventory((prev) => prev.filter((it) => it.id !== itemToDeleteId));
    setShowDeleteConfirmModal(false);
    setItemToDeleteId(null);
    setItemToDeleteName("");
    showMessage("재고 항목이 삭제되었습니다!", "success");
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setItemToDeleteId(null);
    setItemToDeleteName("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-sky-50 to-white">
      <header className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
        <div className="mx-auto max-w-screen-2xl px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            재고 관리 시스템
          </h1>
          <p className="mt-1 text-white/85">
            간단하고 빠르게 재고를 관리하세요
          </p>
        </div>
      </header>

      {message.text && (
        <div className="mx-auto mt-4 max-w-screen-2xl px-6">
          <Toast type={message.type}>{message.text}</Toast>
        </div>
      )}

      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800">
                  새 재고 추가
                </h2>
              </div>
              <div className="p-6">
                <AddItemForm onAdd={addItem} />
              </div>
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800">
                  현재 재고 현황
                </h2>
              </div>
              <div className="p-6">
                <InventoryTable
                  items={inventory}
                  onEdit={(item) => setEditingItem(item)}
                  onDelete={askDelete}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveEditedItem}
          onChangeQuantity={(fn) =>
            setEditingItem((prev) =>
              prev ? { ...prev, quantity: fn(prev.quantity) } : prev
            )
          }
        />
      )}

      {showDeleteConfirmModal && (
        <DeleteConfirmModal
          name={itemToDeleteName}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default App;
