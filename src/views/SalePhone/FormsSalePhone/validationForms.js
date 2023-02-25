// Schema de validação de dados
export const schemFormSalePhone = {
  phone: {
    presence: { allowEmpty: false, message: "^Telefone obrigatório" },
    length: {
      minimum: 11,
      message: `^O telefone de ter 11 digitos xx-xxxx-xxxx`,
    },
  },
  name: {
    presence: { allowEmpty: false, message: "^Nome obrigatório" },
  },
  address: {
    presence: { allowEmpty: false, message: "^Endereço obrigatório" },
  },
  number: {
    presence: { allowEmpty: false, message: "^Número da entrega obrigatório" },
  },
  district: {
    presence: { allowEmpty: false, message: "^Bairro obrigatório" },
  },
  city: {
    presence: { allowEmpty: false, message: "^cidade obrigatório" },
  },
  // note: {},
};
