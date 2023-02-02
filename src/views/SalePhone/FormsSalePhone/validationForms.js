import { FormText } from "reactstrap";
import validate from "validate.js";

// Schema de validação de dados
const schemFormSalePhone = {
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

export const validationForms = (values) => {
  const errors = validate(values, schemFormSalePhone);
  return errors;
};

/**
 * Retornar um Componet com os erros do campo passado
 */
export const ErrorForms = ({ touched, errors }) => {
  if (typeof errors !== "undefined" && touched) {
    return errors.map((item, idx) => (
      <FormText key={idx}>
        <span style={{ color: "red" }}>{item}</span>
      </FormText>
    ));
  }
};
