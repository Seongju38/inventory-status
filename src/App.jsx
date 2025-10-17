import React, { useState } from "react";

function App() {
  // 로컬 상태만으로 UI 동작
  const [inventory, setInventory] = useState([
    // 초기 예시 데이터 (원하면 빈 배열 []로 시작)
    { id: "1", name: "마스크", quantity: 20, description: "KF94" },
    { id: "2", name: "손소독제", quantity: 8, description: "500ml" },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" }); // 'success' | 'error'
  const [adjustQuantityValue, setAdjustQuantityValue] = useState("");

  // 삭제 확인 모달
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");

  // 알림 토스트
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

  // 입력 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // 재고 추가 (로컬 상태)
  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity === "") {
      showMessage("상품명과 수량은 필수 입력 항목입니다.", "error");
      return;
    }
    const parsed = parseInt(newItem.quantity, 10);
    if (isNaN(parsed) || parsed < 0) {
      showMessage("수량은 0 이상의 숫자여야 합니다.", "error");
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(), // 로컬용 임시 ID
      name: newItem.name,
      quantity: parsed,
      description: newItem.description,
      createdAt: new Date(),
    };

    setInventory((prev) =>
      [...prev, newEntry].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNewItem({ name: "", quantity: "", description: "" });
    showMessage("재고 항목이 추가되었습니다!", "success");

    // [백엔드 연결 지점]
    // Firestore를 다시 붙일 때: addDoc(collection(db, `.../inventory`), newEntry)
  };

  // 수정 모달 열기
  const handleEditClick = (item) => {
    setEditingItem({ ...item });
    setAdjustQuantityValue("");
  };

  // 수량 가감
  const handleAdjustQuantity = (type) => {
    const adjustVal = parseInt(adjustQuantityValue, 10);
    if (isNaN(adjustVal) || adjustVal <= 0) {
      showMessage("수량 조절 값은 0보다 큰 숫자여야 합니다.", "error");
      return;
    }

    let newQuantity = editingItem.quantity;
    if (type === "add") {
      newQuantity = editingItem.quantity + adjustVal;
    } else if (type === "subtract") {
      newQuantity = Math.max(0, editingItem.quantity - adjustVal);
      if (editingItem.quantity - adjustVal < 0) {
        showMessage("재고는 음수가 될 수 없습니다. 0으로 설정합니다.", "error");
      }
    }

    setEditingItem((prev) => ({ ...prev, quantity: newQuantity }));
    setAdjustQuantityValue("");
  };

  // 수정 저장
  const handleUpdateItem = () => {
    if (!editingItem.name || editingItem.quantity === "") {
      showMessage("상품명과 수량은 필수 입력 항목입니다.", "error");
      return;
    }
    const parsed = parseInt(editingItem.quantity, 10);
    if (isNaN(parsed) || parsed < 0) {
      showMessage("수량은 0 이상의 숫자여야 합니다.", "error");
      return;
    }

    setInventory((prev) =>
      prev
        .map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                name: editingItem.name,
                quantity: parsed,
                description: editingItem.description,
              }
            : it
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditingItem(null);
    showMessage("재고 항목이 업데이트되었습니다!", "success");

    // [백엔드 연결 지점]
    // Firestore: updateDoc(doc(db, `.../inventory`, editingItem.id), {...})
  };

  // 삭제 모달 띄우기
  const handleDeleteClick = (id, name) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setShowDeleteConfirmModal(true);
  };

  // 삭제 실행
  const confirmDelete = () => {
    setInventory((prev) => prev.filter((it) => it.id !== itemToDeleteId));
    setShowDeleteConfirmModal(false);
    setItemToDeleteId(null);
    setItemToDeleteName("");
    showMessage("재고 항목이 삭제되었습니다!", "success");

    // [백엔드 연결 지점]
    // Firestore: deleteDoc(doc(db, `.../inventory`, itemToDeleteId))
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setItemToDeleteId(null);
    setItemToDeleteName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <h1 className="text-3xl font-bold text-center">재고 관리 시스템</h1>
          {/* 백엔드 연결 시 사용자 ID 영역을 다시 표시 */}
        </header>

        {message.text && (
          <div
            className={`p-3 text-center text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <main className="p-6">
          {/* 추가 섹션 */}
          <section className="mb-8 bg-gray-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              새 재고 추가
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="상품명"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                placeholder="수량"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="설명 (선택 사항)"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              onClick={handleAddItem}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              재고 추가
            </button>
          </section>

          {/* 목록 섹션 */}
          <section className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              현재 재고 현황
            </h2>
            {inventory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                재고 항목이 없습니다. 새 항목을 추가해주세요.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider rounded-tl-lg">
                        상품명
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        수량
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        설명
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider rounded-tr-lg">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } border-b border-gray-200 last:border-b-0`}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {item.description || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-xs font-semibold mr-2 transform hover:scale-105 transition duration-200"
                          >
                            수정
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(item.id, item.name)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs font-semibold transform hover:scale-105 transition duration-200"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 수정 모달 */}
          {editingItem && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  재고 항목 수정
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="editName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    상품명:
                  </label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="editQuantity"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    현재 수량:
                  </label>
                  <input
                    type="number"
                    id="editQuantity"
                    name="quantity"
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value || "0", 10),
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  />
                </div>

                {/* 수량 조절 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <label
                    htmlFor="adjustQuantity"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    수량 조절:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="adjustQuantity"
                      value={adjustQuantityValue}
                      onChange={(e) => setAdjustQuantityValue(e.target.value)}
                      placeholder="조절 수량"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    />
                    <button
                      onClick={() => handleAdjustQuantity("add")}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transform hover:scale-105 transition duration-200"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => handleAdjustQuantity("subtract")}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transform hover:scale-105 transition duration-200"
                    >
                      빼기
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    입력된 수량만큼 현재 수량에 더하거나 뺄 수 있습니다.
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="editDescription"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    설명:
                  </label>
                  <input
                    type="text"
                    id="editDescription"
                    name="description"
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdateItem}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    업데이트
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 삭제 확인 모달 */}
          {showDeleteConfirmModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  삭제 확인
                </h2>
                <p className="text-gray-700 mb-6">
                  "
                  <span className="font-bold text-red-600">
                    {itemToDeleteName}
                  </span>
                  " 항목을 정말로 삭제하시겠습니까?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
