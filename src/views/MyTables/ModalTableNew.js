import React, { useState } from "react";

import { FormGroup, Input, FormText } from "reactstrap";

import ModalView from "../../components/ModalView";

import "./styles.css";

import validate from "validate.js";

const typeForm = {
  isValid: false,
  touched: {},
  values: { amountofplace: 0, repeat: 1 },
  errors: {},
};

const schemaForm = {
  amountofplace: {
    presence: { allowEmpty: false, message: "^Quantiade é obrigatório" },
    numericality: { onlyInteger: true, greaterThan: 0 },
  },
  repeat: {
    presence: { allowEmpty: false, message: "^Valor é obrigatório" },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: "^Não é um número válido",
    },
  },
};

const ModalTableNew = ({ open, toogle, saveTable }) => {
  const [form, setForm] = useState(typeForm);

  const handleChangeForm = (event) => {
    event.persist();

    let dataform = {
      ...form,
      values: {
        ...form.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...form.touched,
        [event.target.name]: true,
      },
    };

    const errors = validate(dataform.values, schemaForm);

    dataform = {
      ...dataform,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setForm(dataform);
  };

  const hasError = (field) =>
    form.touched[field] && form.errors[field] ? true : false;

  return (
    <ModalView
      size="md"
      title={"🔖Adicionar nova mesa"}
      modal={open}
      toggle={toogle}
      confirmed={() => saveTable(form)}
    >
      <div className="container-modal-new-table">
        <FormGroup>
          <label>Quantos lugares tem a mesa?</label>
          <Input
            placeholder="Quantidade de lugar"
            type="number"
            name="amountofplace"
            invalid={hasError("amountofplace")}
            value={form.values.amountofplace || ""}
            onChange={handleChangeForm}
          />
          {form.touched.amountofplace &&
            Array.isArray(form.errors.amountofplace) &&
            form.errors.amountofplace.map((error, idx) => {
              return (
                <FormText key={idx}>
                  <span className="error">{error}</span>
                </FormText>
              );
            })}
        </FormGroup>

        <FormGroup>
          <label>Quantas mesas deseja criar deste tipo?</label>
          <Input
            type="number"
            name="repeat"
            invalid={hasError("repeat")}
            value={form.values.repeat || ""}
            onChange={handleChangeForm}
          />
          {form.touched.repeat &&
            Array.isArray(form.errors.repeat) &&
            form.errors.repeat.map((error, idx) => {
              return (
                <FormText key={idx}>
                  <span className="error">{error}</span>
                </FormText>
              );
            })}
        </FormGroup>
      </div>
    </ModalView>
  );
};

export default ModalTableNew;
