import React from "react";

import "./styles.css";

import { FormGroup, Input, Row, Col, Label } from "reactstrap";
import { ErrorForms } from "./validationForms";

const FormsSalePhone = ({ hasError, handleChangeForms, formState }) => {
  return (
    <div>
      <Row>
        <Col md="3">
          <FormGroup>
            <Label for="phone">Telefone</Label>
            <Input
              autoFocus
              placeholder="(XX) XXXXX-XXXX"
              type="text"
              name="phone"
              invalid={hasError("phone")}
              value={formState.values.phone || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.phone}
              errors={formState.errors.phone}
            />
          </FormGroup>
        </Col>
        <Col md="9">
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              name="name"
              invalid={hasError("name")}
              value={formState.values.name || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.name}
              errors={formState.errors.name}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row className="content-title-delivery">
        <span>Dados da Entrega</span>
      </Row>

      <Row>
        <Col md="9">
          <FormGroup>
            <Label>Endereço</Label>
            <Input
              type="text"
              name="address"
              invalid={hasError("address")}
              value={formState.values.address || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.address}
              errors={formState.errors.address}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>Número</Label>
            <Input
              type="text"
              name="number"
              invalid={hasError("number")}
              value={formState.values.number || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.number}
              errors={formState.errors.number}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="9">
          <FormGroup>
            <Label>Bairro</Label>
            <Input
              type="text"
              name="district"
              invalid={hasError("district")}
              value={formState.values.district || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.district}
              errors={formState.errors.district}
            />
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>Cidade</Label>
            <Input
              type="text"
              name="city"
              invalid={hasError("city")}
              value={formState.values.city || ""}
              onChange={(e) => handleChangeForms(e)}
            />
            <ErrorForms
              touched={formState.touched.city}
              errors={formState.errors.city}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <FormGroup>
            <Label>Observação</Label>
            <Input
              type="text"
              name="note"
              value={formState.values.note || ""}
              onChange={(e) => handleChangeForms(e)}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default FormsSalePhone;
