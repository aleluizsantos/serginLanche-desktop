import { url } from "../services/host";

const mask = (value, pattern) => {
  try {
    let i = 0;
    if (typeof value === "undefined") return;
    const valueOnlyNumber = value.toString().replace(/[^0-9]/g, "");
    return pattern.replace(/#/g, () => valueOnlyNumber[i++] || "");
  } catch (error) {
    return;
  }
};

const errorImageUrl = (image) => {
  image.onerror = "";
  image.src = `${url}/uploads/default.jpg`;
  return true;
};

export { mask, errorImageUrl };
