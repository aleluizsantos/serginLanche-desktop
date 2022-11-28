import api from "../services/api";
import { authHeader } from "../services/authHeader";

// Exibir lista de entrada do 10 ultimos lançamentos
export const getEntryProducts = async (pageCurrent = 1) => {
  const { Authorization } = authHeader();

  return await api
    .get("/entryStock", {
      headers: { Authorization: Authorization },
      params: { page: pageCurrent === 0 ? 1 : pageCurrent },
    })
    .then((response) => {
      return response.data;
    });
};

export const addEntryProduct = async (dataListEntry) => {
  const { Authorization } = authHeader();

  const data = dataListEntry.map((item) => {
    const obj = {
      data_entry: item.dataEntry,
      amount: item.amount,
      price: item.price,
      provider_id: item.provider_id,
      product_id: item.product_id,
    };
    return obj;
  });

  return await api
    .post("/entryStock/create", data, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const deletEntryProduct = async (itemselected) => {
  const { Authorization } = authHeader();
  const { id, product_id, amount } = itemselected;

  return await api
    .delete(`/entryStock/${id}`, {
      headers: { Authorization: Authorization },
      params: {
        product_id: product_id,
        amount: amount,
      },
    })
    .then((response) => response.data);
};
