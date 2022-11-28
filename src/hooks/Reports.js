import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const getSaleDay = async () => {
  const { Authorization } = authHeader();
  return await api
    .get("report/saleday", {
      headers: {
        Authorization: Authorization,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export const getSaleWeek = async (dateCurrent = new Date()) => {
  const { Authorization } = authHeader();

  return await api
    .get("report/saleweek", {
      headers: {
        Authorization: Authorization,
      },
      params: {
        dateCurrent: dateCurrent,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export const getSaleYear = async () => {
  const { Authorization } = authHeader();
  return await api
    .get("report/saleyear", {
      headers: {
        Authorization: Authorization,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export const getTop10 = async () => {
  const { Authorization } = authHeader();

  return await api
    .get("report/top10", {
      headers: { Authorization: Authorization },
    })
    .then((response) => {
      return response.data;
    });
};
