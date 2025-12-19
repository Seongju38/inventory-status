import React, { useEffect, useState } from "react";
import AddItemForm from "./components/AddItemForm";
import InventoryTable from "./components/InventoryTable";
import EditItemModal from "./components/EditItemModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";
import { fetchItems, createItem, updateItem, deleteItem } from "./api/items";

function App() {
  // 로컬 상태
  const [inventory, setInventory] = useState([]);

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

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchItems();
        // 백엔드(DB) Item 모델이 description 대신 note로 되어있음
        const mapped = items.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          description: it.note ?? "", // note를 description에 연결
          createdAt: it.createdAt,
        }));
        setInventory(mapped);
      } catch (e) {
        showMessage(e.message || "재고를 불러오지 못했습니다.", "error");
      }
    })();
  }, []);

  // 추가
  const addItem = async ({ name, quantity, description }) => {
    if (!name || quantity === "")
      return showMessage("상품명과 수량은 필수입니다.", "error");
    const parsed = parseInt(quantity, 10);
    if (isNaN(parsed) || parsed < 0)
      return showMessage("수량은 0 이상의 숫자여야 합니다.", "error");

    try {
      const saved = await createItem({
        name,
        quantity: parsed,
        note: description ?? "",
      });

      const mapped = {
        id: saved.id,
        name: saved.name,
        quantity: saved.quantity,
        description: saved.note ?? "",
        createdAt: saved.createdAt,
      };

      setInventory((prev) =>
        [...prev, mapped].sort((a, b) => a.name.localeCompare(b.name))
      );
      showMessage("재고 항목이 추가되었습니다!", "success");
    } catch (e) {
      showMessage(e.message || "추가에 실패했습니다.", "error");
    }
  };

  // 수정 저장
  const saveEditedItem = async (next) => {
    if (!next.name || next.quantity === "")
      return showMessage("상품명/수량을 확인해주세요.", "error");
    const parsed = parseInt(next.quantity, 10);
    if (isNaN(parsed) || parsed < 0)
      return showMessage("수량은 0 이상의 숫자여야 합니다.", "error");

    try {
      const saved = await updateItem(next.id, {
        name: next.name,
        quantity: parsed,
        note: next.description ?? "",
      });

      setInventory((prev) =>
        prev
          .map((it) =>
            it.id === next.id
              ? {
                  ...it,
                  name: saved.name,
                  quantity: saved.quantity,
                  description: saved.note ?? "",
                }
              : it
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingItem(null);
      showMessage("재고 항목이 업데이트되었습니다!", "success");
    } catch (e) {
      showMessage(e.message || "수정에 실패했습니다.", "error");
    }
  };

  // 삭제
  const askDelete = (id, name) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItem(itemToDeleteId);
      setInventory((prev) => prev.filter((it) => it.id !== itemToDeleteId));
      setShowDeleteConfirmModal(false);
      setItemToDeleteId(null);
      setItemToDeleteName("");
      showMessage("재고 항목이 삭제되었습니다!", "success");
    } catch (e) {
      showMessage(e.message || "삭제에 실패했습니다.", "error");
    }
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
