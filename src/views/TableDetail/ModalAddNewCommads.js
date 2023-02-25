import React, { useState } from "react";
import validate from "validate.js";
import { useDispatch } from "react-redux";
import { FormGroup, Input, FormText } from "reactstrap";

import ModalView from "../../components/ModalView";
import { SET_MESSAGE } from "../../store/Actions/types";
import { createCommads } from "../../hooks/useTable";

const typeForm = {
  isValid: false,
  touched: {},
  values: { nameclient: "", tokenOperation: "", idTable: "" },
  errors: {},
};

const schemaForm = {
  nameclient: {
    presence: { allowEmpty: false, message: "^Qual é o nome do cliente" },
  },
};

export const ModalAddNewCommads = ({
  open,
  toogle,
  idTable,
  tokenOperation,
  addNewCommad,
}) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    ...typeForm,
    values: {
      ...typeForm.values,
      tokenOperation: tokenOperation,
      idTable: idTable,
    },
  });

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

  const createNewCommads = async () => {
    if (form.isValid) {
      createCommads(form.values).then((resp) => {
        addNewCommad(resp);
        // Limpa o Formulário mais mantém o token
        setForm({
          isValid: false,
          touched: {},
          values: {
            ...form.values,
            nameclient: "",
            tokenOperation: resp.tokenOperation,
          },
          errors: {},
        });
        toogle(false);
      });
    } else {
      dispatch({
        type: SET_MESSAGE,
        payload: "Informe o nome do cliente",
      });
    }
  };

  return (
    <ModalView
      size="md"
      title="🔖 Nova comanda"
      modal={open}
      toggle={() => toogle(!open)}
      confirmed={createNewCommads}
    >
      <div className="container-modal-new-table">
        <FormGroup>
          <label>Nome do Cliente</label>
          <Input
            autoFocus
            placeholder="Qual é o nome do cliente"
            type="text"
            name="nameclient"
            invalid={hasError("amountofplace")}
            value={form.values.nameclient || ""}
            onKeyUp={(e) => e.code === "Enter" && createNewCommads()}
            onChange={handleChangeForm}
          />
          {form.touched.nameclient &&
            Array.isArray(form.errors.nameclient) &&
            form.errors.nameclient.map((error, idx) => (
              <FormText key={idx}>
                <span className="error">{error}</span>
              </FormText>
            ))}
        </FormGroup>
      </div>
    </ModalView>
  );
};
