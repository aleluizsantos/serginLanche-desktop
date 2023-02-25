import validate from "validate.js";
import { FormText } from "reactstrap";

/**
 * Retornar um Componet com os erros do campo passado
 * @param {object} Parametro Passado dois objeto touched e erros
 * @returns {JSX} componete com os erros
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

/**
 * Valida o formulário de forma com a schema passada
 * @param {object} values Valores do formulário
 * @param {object} schemaForm Schema de validaçaõ do formulário
 * @returns {Array<object>}
 */
export const validationForms = (values, schemaForm) => {
  const errors = validate(values, schemaForm);
  return errors;
};
