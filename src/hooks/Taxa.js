import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const getTaxa = async () => {
  const { Authorization } = authHeader();

  return await api
    .get("/taxa", {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const updateTaxa = async (formTaxa) => {
  const { Authorization } = authHeader();

  return await api
    .put(`/taxa/${formTaxa.id}`, formTaxa, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
