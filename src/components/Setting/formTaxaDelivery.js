import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import validate from "validate.js";
import { Button, Input } from "reactstrap";

import "./styles.css";
import { SET_MESSAGE } from "../../store/Actions/types";
import { getTaxa, updateTaxa } from "../../hooks";

const typeForm = {
  isvalid: false,
  values: {},
  touched: {},
  errors: {},
};

const schemaTaxa = {
  vMinTaxa: {
    presence: { allowEmpty: false, message: "Valor mínimo obrigatório" },
    numericality: true,
  },
  taxa: {
    presence: { allowEmpty: false, message: "Taxa obrigatório" },
    numericality: true,
  },
};

const FormTaxaDelivery = () => {
  const dispatch = useDispatch();
  const [formTaxa, setFormTaxa] = useState(typeForm);

  useEffect(() => {
    let finished = false;
    (async () => {
      !finished &&
        getTaxa().then((response) =>
          setFormTaxa({ ...typeForm, values: response })
        );
    })();
    return () => {
      finished = true;
    };
  }, []);

  // Atualização no Formulário Taxa
  const handleChangeTaxa = (event) => {
    event.persist();

    let dataForm = {
      ...formTaxa,
      values: {
        ...formTaxa.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formTaxa.touched,
        [event.target.name]: true,
      },
    };

    const errors = validate(dataForm.values, schemaTaxa);

    dataForm = {
      ...dataForm,
      isvalid: errors ? false : true,
      errors: errors || {},
    };

    setFormTaxa(dataForm);
  };
  // Salvar os dados da alteração da Taxa
  const handleSubmitTaxa = async () => {
    await updateTaxa(formTaxa.values).then(() => {
      dispatch({
        type: SET_MESSAGE,
        payload: "Valor atualizado",
      });
      setFormTaxa({ ...formTaxa, isvalid: false });
    });
  };

  return (
    <div className="groupSetting">
      <div className="caption">
        <p>Taxa de Entrega</p>
        <small>Valor mínimo do pedido, para taxa de entrega GRATIS.</small>
        <Input
          name="vMinTaxa"
          type="text"
          value={formTaxa.values.vMinTaxa || ""}
          onChange={(event) => handleChangeTaxa(event)}
        />
        <small>Taxa entrega</small>
        <Input
          name="taxa"
          type="text"
          value={formTaxa.values.taxa || ""}
          onChange={(event) => handleChangeTaxa(event)}
        />
        <Button
          disabled={!formTaxa.isvalid}
          className="small"
          color="info"
          onClick={handleSubmitTaxa}
        >
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

export default FormTaxaDelivery;
