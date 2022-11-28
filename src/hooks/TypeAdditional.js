import api from "../services/api";
import { authHeader } from "../services/authHeader";

// TIPOS DE ADICIONAIS
export const getTypeAdditional = async () => {
  const { Authorization } = authHeader();

  return await api
    .get("typeAdditional", {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
export const deleteTypeAdditional = async (idTypeAdditional) => {
  const { Authorization } = authHeader();
  return await api
    .delete(`typeAdditional/delete/${idTypeAdditional}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
export const createTypeAdditional = async (typeAdditional) => {
  const { Authorization } = authHeader();
  return await api
    .post("/typeAdditional/create", typeAdditional, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
export const updateTypeAdditional = async (typeAdditional) => {
  const { Authorization } = authHeader();
  return await api
    .put(`/typeAdditional/edit/${typeAdditional.id}`, typeAdditional, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

// ADDICIONAIS
export const getAdditional = async (idTypeAdditional) => {
  return await api
    .get("additional", {
      headers: { additional: idTypeAdditional },
    })
    .then((response) => response.data);
};
export const createAdditional = async (additional) => {
  const { Authorization } = authHeader();
  return await api
    .post("additional/create", additional, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
export const updateAdditional = async (additional) => {
  const { Authorization } = authHeader();
  return await api
    .put(`/additional/upgrade/${additional.values.id}`, additional.values, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
export const deleteAdditional = async (idAdditional) => {
  const { Authorization } = authHeader();
  return await api
    .delete(`additional/delete/${idAdditional}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
