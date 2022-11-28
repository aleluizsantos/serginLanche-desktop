export function authHeader() {
  let token = localStorage.getItem("_accessAuthenticatedTokenpicanha&cia");
  if (!!token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
