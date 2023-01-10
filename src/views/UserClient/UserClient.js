import React, { useEffect, useState } from "react";
import validate from "validate.js";
import { useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Input,
  Label,
  FormGroup,
  FormText,
} from "reactstrap";

import {
  getUserClient,
  formatDateTime,
  blockedUser,
  sendPushNotification,
} from "../../hooks";
import { CLIENT_REGISTERED } from "../../store/Actions/types";
import { SearchBar, ModalView } from "../../components";
import icoUsers from "../../assets/img/icoUsers.png";
import icoWhatsapp from "../../assets/img/iconWhatsapp.png";
import icoPushNoti from "../../assets/img/imgPushNotf.png";

// import iconSystem from "../../variables/icons";
let propsForms = {
  isValid: false,
  values: {},
  touched: {},
  errors: {},
};
//Schema de validadação de dados Formulário
const schemaFormPush = {
  title: {
    presence: { allowEmpty: false, message: "^Título obrigatório" },
  },
  message: {
    presence: { allowEmpty: false, message: "^Messagem obrigatório" },
  },
};

const UserClient = () => {
  const dispatch = useDispatch();
  const [dataUserClient, setDataUserClient] = useState([]);
  const [filterUserClient, setFilterUserClient] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isModalPushNot, setIsModalPushNot] = useState(false);
  const [formState, setFormState] = useState(propsForms);

  useEffect(() => {
    setIsloading(true);
    getUserClient().then((response) => {
      setIsloading(false);
      setDataUserClient(response);
      dispatch({
        type: CLIENT_REGISTERED,
        payload: response.length,
      });
    });
  }, [dispatch]);

  useEffect(() => {
    const filterUserClient = dataUserClient.filter((element) => {
      const name = element.name.toLowerCase();
      const seach = valueSearch.toLowerCase();
      // checar se existe no name parte do texto digitado no seach
      return name.includes(seach);
    });
    setFilterUserClient(filterUserClient);
  }, [dataUserClient, valueSearch]);

  // Bloquear e desbloquear usuário
  const handleBlockedUser = (user) => {
    setIsloading(true);
    blockedUser(user).then((response) => {
      const updateUserClient = dataUserClient.map((item) => {
        return item.id === response.id ? response : item;
      });
      setDataUserClient(updateUserClient);
      setIsloading(false);
    });
  };
  // Abrir whatsapp para iniciar uma conversa
  const showWhatsapp = (user) => {
    const phone = user.phone.replace(/([^\d])+/gim, "");
    const message = `🍔 Olá ${user.name} somos do Sergin Lanche!!!`;
    // window.location.href = `whatsapp://send/?phone=55${phone}&text=${message}&app_absent=0`;
    window.location.href = `https://api.whatsapp.com/send?phone=55${phone}&text=${message}`;
  };
  // Check o cliente um a um
  const onCheckboxBtnClick = (selected) => {
    const index = selectedUsers.indexOf(selected);
    if (index < 0) {
      selectedUsers.push(selected);
    } else {
      selectedUsers.splice(index, 1);
    }
    setSelectedUsers([...selectedUsers]);
  };
  // Selecionar TODOS checbox da lista
  const onCheckboxAllBtnClick = () => {
    if (
      selectedUsers.length ===
      (valueSearch === "" ? dataUserClient : filterUserClient).length
    ) {
      setSelectedUsers([]);
    } else {
      const allUser = (
        valueSearch === "" ? dataUserClient : filterUserClient
      ).map((item) => item.tokenPushNotification);
      setSelectedUsers(allUser);
    }
  };
  // Set: o valor pesquisado
  const handleChangerSearch = (value) => {
    setValueSearch(value);
    setSelectedUsers([]);
  };
  // Set: valores do forumário do push notificaton
  const handleChange = (event) => {
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

    const errors = validate(dataForm.values, schemaFormPush);

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
  // Exibir a modal de push notification
  const handleShowModalPush = () => {
    setIsModalPushNot(true);
  };
  // Enviar a mensagem
  const handleSubmitPushNotification = () => {
    // Checar validação do Form
    if (formState.isValid) {
      const dataUser = {
        tokenPush: selectedUsers,
        title: formState.values.title,
        message: formState.values.message,
      };
      sendPushNotification(dataUser);
      setIsModalPushNot(false);
      setSelectedUsers([]);
      setFormState(propsForms);
    } else {
      let touched = {};
      const errors = validate(formState.values, schemaFormPush);
      Object.keys(errors).map((item) => {
        return (touched = { ...touched, [item]: true });
      });

      const dataForm = {
        ...formState,
        touched: touched,
        isValid: errors ? false : true,
        errors: errors || {},
      };
      setFormState(dataForm);
    }
  };

  return (
    <div className="content">
      {isLoading && (
        <div className="spinner">
          <Spinner color="light" />
        </div>
      )}
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">
                <img src={icoUsers} alt="icone usser" />
                Meus clientes
              </CardTitle>
              <Button
                disabled={selectedUsers.length === 0}
                onClick={handleShowModalPush}
              >
                <i className="nc-icon nc-send" /> Enviar Notificações
              </Button>
              <SearchBar onChange={(value) => handleChangerSearch(value)} />
            </CardHeader>
            <CardBody>
              <Table responsive style={{ border: "solid 1px #a9a9a9" }}>
                <thead className="text-primary">
                  <tr>
                    <th>
                      <input
                        checked={
                          selectedUsers.length ===
                          (valueSearch === ""
                            ? dataUserClient
                            : filterUserClient
                          ).length
                        }
                        type="checkbox"
                        onChange={onCheckboxAllBtnClick}
                      />
                    </th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Endereço</th>
                    <th>Inscrito em</th>
                  </tr>
                </thead>
                <tbody>
                  {(valueSearch === "" ? dataUserClient : filterUserClient).map(
                    (item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(
                              item.tokenPushNotification
                            )}
                            onChange={() =>
                              onCheckboxBtnClick(item.tokenPushNotification)
                            }
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          <Button
                            onClick={() => showWhatsapp(item)}
                            color="link"
                          >
                            <img
                              style={{ height: 25, cursor: "pointer" }}
                              src={icoWhatsapp}
                              alt="icone whatsapp"
                            />
                          </Button>
                          {item.phone}
                        </td>
                        <td align="center">
                          {item.blocked ? (
                            <Badge
                              style={{ cursor: "pointer" }}
                              onClick={() => handleBlockedUser(item)}
                              color="danger"
                            >
                              Bloqueado
                            </Badge>
                          ) : (
                            <Badge
                              style={{ cursor: "pointer" }}
                              onClick={() => handleBlockedUser(item)}
                              color="success"
                            >
                              Ativo
                            </Badge>
                          )}
                        </td>
                        <td>{`${item.address}, ${item.number}, ${item.neighborhood}, ${item.city}`}</td>
                        <td>{formatDateTime(item.created_at)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* Modal enviar Push Notification */}
      <ModalView
        title={
          <>
            <img src={icoPushNoti} alt="status" style={{ height: 40 }} />{" "}
            <Label> Enviar Notificações </Label>
          </>
        }
        modal={isModalPushNot}
        toggle={() => {
          setIsModalPushNot(!isModalPushNot);
          setFormState(propsForms);
        }}
        confirmed={handleSubmitPushNotification}
      >
        <div className="text-justify">
          <Row>
            <Col>
              <FormGroup>
                <Label>Título messagem</Label>
                <Input
                  type="text"
                  name="title"
                  invalid={hasError("title")}
                  placeholder="Título do push"
                  value={formState.values.title || ""}
                  onChange={(event) => handleChange(event)}
                />
                {formState.touched.title &&
                  Array.isArray(formState.errors.title) &&
                  formState.errors.title.map((error, idx) => {
                    return (
                      <FormText key={idx}>
                        <span className="error">{error}</span>
                      </FormText>
                    );
                  })}
              </FormGroup>
              <FormGroup>
                <Label>Messagem</Label>
                <Input
                  type="textarea"
                  name="message"
                  invalid={hasError("message")}
                  placeholder="Título do push"
                  value={formState.values.message || ""}
                  onChange={(event) => handleChange(event)}
                />
                {formState.touched.message &&
                  Array.isArray(formState.errors.message) &&
                  formState.errors.message.map((error, idx) => {
                    return (
                      <FormText key={idx}>
                        <span className="error">{error}</span>
                      </FormText>
                    );
                  })}
              </FormGroup>
              <Label>{`A notificação será enviar para '${
                selectedUsers.length
              }' usuário${selectedUsers.length > 1 ? "s" : ""}`}</Label>
            </Col>
          </Row>
        </div>
      </ModalView>

      {/* {iconSystem.map((icon, idx) => (
        <div key={idx}>
          <i className={`nc-icon ${icon.name}`} />
          <span>{icon.name}</span>
        </div>
      ))} */}
    </div>
  );
};
export default UserClient;
