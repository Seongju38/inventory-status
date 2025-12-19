const TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": TOKEN,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(msg.message || "Request failed");
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export function fetchItems() {
  return request("/api/items");
}

export function createItem(payload) {
  return request("/api/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateItem(id, payload) {
  return request(`/api/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteItem(id) {
  return request(`/api/items/${id}`, { method: "DELETE" });
}
