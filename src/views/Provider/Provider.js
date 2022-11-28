import React, { useState, useEffect } from "react";
import validate from "validate.js";
import { useDispatch } from "react-redux";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Label,
  Col,
  Table,
  FormText,
} from "reactstrap";

import imgProvider from "../../assets/img/provider.png";
import imgAdd from "../../assets/img/icoAdd_64.png";
import {
  getProvider,
  createProvider,
  upgradeProvider,
  deleteProvider,
} from "../../hooks/provider";
import { formatDateTime } from "../../hooks/format";
import { ModalView } from "../../components";
import { SET_MESSAGE } from "../../store/Actions/types";
import icoTrash from "../../assets/img/icoTrash-64.png";

const Provider = () => {
  const dispatch = useDispatch();
  const [dataProvider, setDataProvider] = useState([]);
  const [modalAddProvider, setModalAddProvider] = useState(false);
  const [modalDelete, setmodalDelete] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    isEdit: false,
    values: {},
    touched: {},
    errors: {},
  });

  const typeAction = {
    DELETE: "delete",
    EDIT: "edit",
  };

  // Validação dos campos
  const schema = {
    nameProvider: {
      presence: { allowEmpty: false, message: "^Fonecedor é obrigatório" },
    },
    nameContact: {
      presence: { allowEmpty: false, message: "^Contato é obrigatório" },
    },
    address: {
      presence: { allowEmpty: false, message: "^Endereço é obrigatório" },
    },
    cep: {
      presence: { allowEmpty: false, message: "^CEP é obrigatório" },
    },
    city: {
      presence: { allowEmpty: false, message: "^Cidade é obrigatório" },
    },
    neighborhood: {
      presence: { allowEmpty: false, message: "^Bairro é obrigatório" },
    },
    number: {
      presence: { allowEmpty: false, message: "^Número é obrigatório" },
      length: {
        maximum: 6,
      },
    },
    phone: {
      presence: { allowEmpty: false, message: "^Telefone é obrigatório" },
      length: {
        maximum: 14,
      },
    },
    uf: {
      presence: { allowEmpty: false, message: "^UF é obrigatório" },
      length: { is: 2, message: "^deve ter '2' caracteres" },
    },
  };

  useEffect(() => {
    (() => {
      searchProvider("").then((response) => setDataProvider(response));
    })();
  }, []);

  // Buscar lista de Fornecedores conforme parameto passado
  const searchProvider = async (inputValue) => {
    const provider = await getProvider(inputValue);
    return provider;
  };
  // Atualização dos campos do formulários
  const handleChange = (event) => {
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

    const errors = validate(dataForm.values, schema);

    dataForm = {
      ...dataForm,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setFormState(dataForm);
  };
  // Analise de erro nos campos do formulário
  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  // SubmitForm
  const submitProvider = async () => {
    // Verificar a validação dos dados
    const errors = validate(formState.values, schema);

    let dataForm = {
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    };

    if (formState.isEdit) {
      handleUpgradeProvider();
    } else {
      !dataForm.isValid && setFormState(dataForm);
      if (dataForm.isValid) {
        try {
          createProvider(formState.values).then(() => {
            setModalAddProvider(false);
            searchProvider("").then((response) => setDataProvider(response));
            dispatch({
              type: SET_MESSAGE,
              payload: `Fornecedor '${formState.values.nameProvider}' foi adicionado com sucesso.`,
            });
            setFormState({
              isValid: false,
              isEdit: false,
              values: {},
              touched: {},
              errors: {},
            });
          });
        } catch (error) {
          setModalAddProvider(false);
          dispatch({
            type: SET_MESSAGE,
            payload: "Falha ao inserir o Fornecedor",
          });
        }
      }
    }
  };

  const handleSelectProvider = async (item, action) => {
    setFormState({
      ...formState,
      values: {
        id: item.id,
        nameProvider: item.nameProvider,
        nameContact: item.nameContact,
        address: item.address,
        phone: item.phone,
        cep: item.cep,
        number: item.number,
        neighborhood: item.neighborhood,
        city: item.city,
        uf: item.uf,
      },
      isEdit: action === typeAction.EDIT ? true : false,
    });

    switch (action) {
      case typeAction.DELETE:
        setmodalDelete(true);
        break;
      case typeAction.EDIT:
        setModalAddProvider(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModalAddEdit = () => {
    setModalAddProvider(false);
    setFormState({
      isValid: false,
      isEdit: false,
      values: {},
      touched: {},
      errors: {},
    });
  };

  const handleDelete = () => {
    deleteProvider(formState.values.id).then((response) => {
      dispatch({
        type: SET_MESSAGE,
        payload: response.message || response.error,
      });
      setmodalDelete(false);
      const newList = dataProvider.filter(
        (item) => item.id !== Number(formState.values.id)
      );
      setDataProvider(newList);
    });
  };

  // Atualizar o Fornecedor
  const handleUpgradeProvider = () => {
    upgradeProvider(formState.values).then((response) => {
      for (var i in dataProvider) {
        if (dataProvider[i].id === Number(response.id)) {
          dataProvider[i] = response;
          break; //finalizar o loop
        }
      }
      setModalAddProvider(false);
      setFormState({
        isValid: false,
        isEdit: false,
        values: {},
        touched: {},
        errors: {},
      });
    });
  };

  return (
    <div className="content">
      {/* Modal Remover Fornecedor */}
      <ModalView
        title={
          <>
            <img src={icoTrash} alt="trash" style={{ height: 40 }} />{" "}
            <Label> Remover fornecedor </Label>
          </>
        }
        modal={modalDelete}
        toggle={() => setmodalDelete(!modalDelete)}
        confirmed={() => handleDelete()}
      >
        <div className="text-center">
          <p>
            <strong>Deseje realmente excluir o fornecedor?</strong>
          </p>
          <p>{formState.values.nameProvider}.</p>
          <p>
            {formState.values.city}/{formState.values.uf}.
          </p>
        </div>
      </ModalView>
      {/* Modal Adicionar e Editar Fornecedor */}
      <ModalView
        size="lg"
        title={
          <>
            <img src={imgAdd} alt="add" />{" "}
            {formState.isEdit ? (
              <Label> Editar Fornecedor</Label>
            ) : (
              <Label> Adicionar novo Fornecedor</Label>
            )}
          </>
        }
        modal={modalAddProvider}
        toggle={() => handleCloseModalAddEdit()}
        confirmed={() => submitProvider()}
      >
        <Form onSubmit={submitProvider}>
          <FormGroup row>
            <Label for="nameProvider" sm={2}>
              Fornecedor
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="nameProvider"
                id="nameProvider"
                placeholder="Nome do fornecedor"
                value={formState.values.nameProvider || ""}
                onChange={handleChange}
                invalid={hasError("nameProvider")}
              />
              <FormText>{formState.errors.nameProvider}</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="contact" sm={2}>
              Nome contato
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="nameContact"
                id="contact"
                placeholder="Nome do contato"
                value={formState.values.nameContact || ""}
                onChange={handleChange}
                invalid={hasError("nameContact")}
              />
              <FormText>{formState.errors.nameContact}</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="phone" sm={2}>
              Telefone
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="phone"
                id="phone"
                placeholder="(00) 0000-0000"
                value={formState.values.phone || ""}
                onChange={handleChange}
                invalid={hasError("phone")}
              />
              <FormText>{formState.errors.phone}</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="CEP" sm={2}>
              CEP
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="cep"
                id="CEP"
                placeholder="00000-000"
                value={formState.values.cep || ""}
                onChange={handleChange}
                invalid={hasError("cep")}
              />
              <FormText>{formState.errors.cep}</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="address" sm={2}>
              Endereço
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="address"
                id="address"
                placeholder="Endereço"
                value={formState.values.address || ""}
                onChange={handleChange}
                invalid={hasError("address")}
              />
              <FormText>{formState.errors.address}</FormText>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="number" sm={2}>
              Número
            </Label>
            <Col sm={4}>
              <Input
                type="text"
                name="number"
                id="number"
                placeholder="Número"
                value={formState.values.number || ""}
                onChange={handleChange}
                invalid={hasError("number")}
              />
              <FormText>{formState.errors.number}</FormText>
            </Col>
            <Label for="neighborhood" sm={1}>
              Bairro
            </Label>
            <Col sm={5}>
              <Input
                type="text"
                name="neighborhood"
                id="neighborhood"
                placeholder="Bairro"
                value={formState.values.neighborhood || ""}
                onChange={handleChange}
                invalid={hasError("neighborhood")}
              />
              <FormText>{formState.errors.neighborhood}</FormText>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="city" sm={2}>
              Cidade
            </Label>
            <Col sm={4}>
              <Input
                type="text"
                name="city"
                id="city"
                placeholder="Cidade"
                value={formState.values.city || ""}
                onChange={handleChange}
                invalid={hasError("city")}
              />
              <FormText>{formState.errors.city}</FormText>
            </Col>
            <Label for="uf" sm={1}>
              UF
            </Label>
            <Col sm={5}>
              <Input
                type="text"
                name="uf"
                id="uf"
                placeholder="UF"
                value={formState.values.uf || ""}
                onChange={handleChange}
                invalid={hasError("uf")}
              />
              <FormText style={{ color: "#e31914" }}>
                {formState.errors.uf}
              </FormText>
            </Col>
          </FormGroup>
        </Form>
      </ModalView>

      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <div className="imageVisibleMobile">
              <img src={imgProvider} alt="mobile" />
              Fornecedores
            </div>
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Button onClick={() => setModalAddProvider(!modalAddProvider)}>
            Novo Fornecedor
          </Button>

          <Table responsive>
            <thead className="text-primary">
              <tr>
                <th>Fornecedor</th>
                <th>Nome contato</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Número</th>
                <th>Bairro</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>Dt Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dataProvider.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.nameProvider}</td>
                  <td>{item.nameContact}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td>{item.number}</td>
                  <td>{item.neighborhood}</td>
                  <td>{item.city}</td>
                  <td>{item.uf}</td>
                  <td>{formatDateTime(item.created_at)}</td>
                  <td>
                    <div className="groupButton">
                      <Button
                        className="btn-round btn-icon"
                        color="danger"
                        outline
                        size="sm"
                        onClick={() => handleSelectProvider(item, "delete")}
                      >
                        <i className="fa fa-trash" />
                      </Button>
                      <Button
                        className="btn-round btn-icon"
                        color="success"
                        outline
                        size="sm"
                        onClick={() => handleSelectProvider(item, "edit")}
                      >
                        <i className="fa fa-edit" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Provider;
