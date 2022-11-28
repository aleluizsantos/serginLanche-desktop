const api = require("../api");
const {
  getAddressStore,
  getToken,
  saveAddressStore,
} = require("../../storage");

const checkAddressStore = async () => {
  const token = await getToken();
  const addressStore = await getAddressStore("address-store");
  if (!addressStore) {
    console.log("não tem endereço");
    await api
      .get("/addressStore", {
        headers: { Authorization: token },
      })
      .then((result) => saveAddressStore("address-store", result.data));
  }
};

module.exports = checkAddressStore;
