import api from "../services/api";
import { authHeader } from "../services/authHeader";

// Buscar o endereço da loja
export const getAddressStore = async () => {
  // Checar se o endereço da loja está armazenado no localstorage, caso
  // não esteja raliza um busca na api.
  let addressStore = JSON.parse(localStorage.getItem("_system_address_store"));
  // Verificando se não existe endereço salvo
  if (!addressStore) {
    await api.get("addressStore").then((resp) => {
      const address = resp.data[0];
      localStorage.setItem("_system_address_store", JSON.stringify(address));
      addressStore = address;
    });
  }
  return addressStore;
};

export const updateAddressStore = async (address) => {
  const { Authorization } = authHeader();
  // Salvar o endereço novo no STORAGE
  window.indexBridge.saveAddressStore(address);
  localStorage.setItem("_system_address_store", JSON.stringify(address));
  return await api
    .put(`/addressStore/edit/${address.id}`, address, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
