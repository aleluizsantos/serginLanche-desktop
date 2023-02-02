import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "reactstrap";

import "./styles.css";
import { validationForms } from "./FormsSalePhone/validationForms";

import imgDelivery from "../../assets/img/delivery.png";
import imgStore from "../../assets/img/store.png";
import FormsSalePhone from "./FormsSalePhone/FormsSalePhone";

const SalePhone = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  // Salvar dados do formulário no state
  const handleChangeForms = (event) => {
    event.persist();
    let dataForm = {
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    };

    const errors = validationForms(dataForm.values);

    dataForm = {
      ...dataForm,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setFormState(dataForm);
  };

  // Checar se tem error no campos do Formulário
  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  // Ir para tela PDV para realiar o pedidos do cliente
  const handleGotoPDV = (typeDelivery) => {
    if (formState.isValid) {
      const { address, number, district, phone, city, name } = formState.values;
      const data = {
        commad: { id_commads: 1, table_id: 1, name_client: name },
        typeDelivery: typeDelivery,
        address: {
          address: address,
          number: number,
          neighborhood: district,
          phone: phone,
          city: city,
          uf: "SP",
        },
        typePayment: 2, // Cartão de crédito
      };
      history.push({ pathname: "pdv", state: data });
    }
  };

  return (
    <div className="container-sale-phone">
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Atendimento Telefone / Balcão</CardTitle>
        </CardHeader>
        <CardBody>
          <FormsSalePhone
            hasError={hasError}
            handleChangeForms={handleChangeForms}
            formState={formState}
          />
        </CardBody>

        <CardFooter className="footer-sale-phone">
          <Button
            onClick={() => handleGotoPDV(1)}
            disabled={!formState.isValid}
          >
            <img src={imgDelivery} alt="delivery" /> Delivery
          </Button>
          <Button
            onClick={() => handleGotoPDV(2)}
            disabled={!formState.isValid}
          >
            <img src={imgStore} alt="Store" /> Retirar na Loja
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SalePhone;
