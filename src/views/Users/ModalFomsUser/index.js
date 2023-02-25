import React, { useState, useEffect } from "react";
import { CustomInput, FormGroup, Input, Label, Row, Col } from "reactstrap";
import {
  ModalView,
  SelectSingle,
  ErrorForms,
  validationForms,
} from "../../../components";

import { action } from "../type";
import { mask } from "../../../hooks";

import {
  listTypeUser,
  schemaFormUserSystem,
  typeFormUserSystem,
} from "./types";

export default function FormsUser({ open, toggle, user, toSaveUser }) {
  const [formState, setFormState] = useState(typeFormUserSystem);

  useEffect(() => {
    user.isEdit ? validateToForm(user.values) : setFormState(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Alteração select, salvar no formState a alteração do campo typeUser
  const handleChangeSelectedTypeUser = (type) => {
    let typeUser = {
      ...formState,
      values: {
        ...formState.values,
        [type.name]: type.value,
      },
      touched: {
        ...formState.touched,
        [type.name]: true,
      },
    };

    // Validação do formulário
    const errors = validationForms(typeUser.values, schemaFormUserSystem);

    typeUser = {
      ...typeUser,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setFormState(typeUser);
  };

  // Atualizar o formState com os dados do formulário
  const handleChangeFormUserSystem = (event) => {
    event.persist();

    let dataForm = {
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    };
    // Validação do formulário
    const errors = validationForms(dataForm.values, schemaFormUserSystem);

    dataForm = {
      ...dataForm,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setFormState(dataForm);
  };

  // Fechar o modal e limpar o formState
  const handleClose = () => {
    setFormState(typeFormUserSystem);
    toggle(!open);
  };

  const validateToForm = (values) => {
    try {
      let touched = {};
      const errors = validationForms(values, schemaFormUserSystem);

      // Pegar as key de cada erro
      const errorKeyName =
        typeof errors === "undefined" ? [] : Object.keys(errors);

      // Transforma o array em um objeto com as key, definindo como preenchido
      for (let key of errorKeyName) {
        touched = { ...touched, [key]: true };
      }
      setFormState({
        ...formState,
        isEdit: true,
        values: { ...values, confirmedPassword: values.password },
        isValid: errors ? true : false,
        errors: errors ? errors : {},
        touched: touched ? touched : {},
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Aplicar mascara no campo
  const apllyMask = (field, value) => {
    const valueWithMask = mask(value, "(##) #####-####");
    setFormState({
      ...formState,
      values: { ...formState.values, [field]: valueWithMask },
    });
  };

  const handleSaveuser = () => {
    // Verificar se o formulário esta valido
    if (formState.isValid) {
      toSaveUser(
        formState.values,
        formState.isEdit ? action.EDIT_USER : action.NEW_USER
      );
      handleClose();
    }
  };

  const hasError = (field) => (formState.errors[field] ? true : false);

  return (
    <ModalView
      size="lg"
      title={`${formState?.isEdit ? "Editar:" : ""} Usuário do Sistema`}
      modal={open}
      toggle={handleClose}
      confirmed={handleSaveuser}
    >
      <div className="container-modal-register-user">
        <FormGroup>
          <Label>Nome usuário</Label>
          <Input
            autoFocus
            name="name"
            placeholder="Nome do usuário"
            invalid={hasError("name")}
            type="text"
            value={formState.values.name || ""}
            onChange={handleChangeFormUserSystem}
          />
          <ErrorForms
            touched={formState.touched.name}
            errors={formState.errors.name}
          />
        </FormGroup>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>E-mail</Label>
              <Input
                name="email"
                placeholder="email@"
                type="email"
                invalid={hasError("email")}
                value={formState.values.email || ""}
                onChange={handleChangeFormUserSystem}
              />
              <ErrorForms
                touched={formState.touched.email}
                errors={formState.errors.email}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Telefone</Label>
              <Input
                name="phone"
                placeholder="(00) 00000-0000"
                type="tel"
                invalid={hasError("phone")}
                onBlur={() => apllyMask("phone", formState.values.phone)}
                value={formState.values.phone || ""}
                onChange={handleChangeFormUserSystem}
              />
              <ErrorForms
                touched={formState.touched.phone}
                errors={formState.errors.phone}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Tipo usuário</Label>
              <SelectSingle
                name="typeUser"
                defaultValue={listTypeUser.findIndex(
                  (item) => item.value === formState.values.typeUser
                )}
                options={listTypeUser}
                onChange={(value) => handleChangeSelectedTypeUser(value)}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Bloquear acesso do usuário</Label>
              <CustomInput
                id="blocked"
                name="blocked"
                type="switch"
                label="Bloquerar"
                checked={formState.values.blocked || false}
                onChange={handleChangeFormUserSystem}
              />
            </FormGroup>
          </Col>
        </Row>

        {!formState.isEdit && (
          <Row>
            <Col md="6">
              <Label>Senha</Label>
              <Input
                name="password"
                type="password"
                invalid={hasError("password")}
                value={formState.values.password || ""}
                onChange={handleChangeFormUserSystem}
              />
              <ErrorForms
                touched={formState.touched.password}
                errors={formState.errors.password}
              />
            </Col>
            <Col md="6">
              <Label>Confirmar Senha</Label>
              <Input
                name="confirmedPassword"
                type="password"
                invalid={hasError("confirmedPassword")}
                value={formState.values.confirmedPassword || ""}
                onChange={handleChangeFormUserSystem}
              />
              <ErrorForms
                touched={formState.touched.confirmedPassword}
                errors={formState.errors.confirmedPassword}
              />
            </Col>
          </Row>
        )}
      </div>
    </ModalView>
  );
}
