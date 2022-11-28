import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const getProvider = async (search) => {
  const { Authorization } = authHeader();

  return await api
    .get(`provider/${search}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => {
      return response.data;
    });
};

export const createProvider = async (dataForm) => {
  const { Authorization } = authHeader();
  return await api
    .post("/provider/create", dataForm, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const upgradeProvider = async (dataForm) => {
  const { Authorization } = authHeader();
  return await api
    .put(`/provider/${dataForm.id}`, dataForm, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const deleteProvider = async (idProvider) => {
  const { Authorization } = authHeader();

  return await api
    .delete(`/provider/${idProvider}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
