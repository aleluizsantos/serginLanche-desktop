import decode from "jwt-decode";
import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const login = async (email, password) => {
  return await api
    .post("/auth/authenticate", { email, password })
    .then(async (response) => {
      const { user, token, openClose, totalUsers } = response.data;
      // Salvar o token no storage do electron
      window.indexBridge.saveToken(token);

      if (user.typeUser === "user")
        throw new Error("Usuário não tem permissão");

      localStorage.setItem("_accessAuthenticatedTokenpicanha&cia", token);
      localStorage.setItem("_activeUserpicanha&cia", JSON.stringify(user));
      localStorage.setItem("_openClosepicanha&cia", openClose);
      localStorage.setItem("_totalUserspicanha&cia", totalUsers);

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("_accessAuthenticatedTokenpicanha&cia");
  localStorage.removeItem("_activeUserpicanha&cia");
  localStorage.removeItem("_openClosepicanha&cia");
  localStorage.removeItem("_totalUserspicanha&cia");
};

export const register = () => {
  return;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("_accessAuthenticatedTokenpicanha&cia");

  if (token !== null) {
    // desestruturando pegando apenas a data de expiração do token
    const { exp } = decode(token);

    // Verificar se o token esta válido
    if (exp >= new Date().getTime() / 1000) return true;
  }
  return false;
};

export const upgradePassUser = async (dataUser) => {
  const { Authorization } = authHeader();
  const { userId, oldPassword, newPassword } = dataUser;
  const data = {
    oldPassword: oldPassword,
    newPassword: newPassword,
  };
  return await api
    .put(`auth/password/${userId}`, data, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const upgradeUser = async (user) => {
  const { Authorization } = authHeader();
  const { id, name, email, phone } = user;
  const data = {
    name,
    email,
    phone,
  };

  return await api
    .put(`auth/users/${id}`, data, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const getUserClient = async () => {
  const { Authorization } = authHeader();
  return await api
    .get("/auth/users", {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

export const blockedUser = async (user) => {
  const { Authorization } = authHeader();
  const { id } = user;
  return await api
    .get(`/auth/blocked/${id}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => {
      const dataUser = {
        ...user,
        blocked: response.data,
      };
      return dataUser;
    });
};
