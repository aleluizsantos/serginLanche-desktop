import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import validate from "validate.js";

// reactstrap components
import {
  Table,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Spinner,
  FormText,
  Label,
} from "reactstrap";

import "./styles.css";
import { SET_MESSAGE } from "../../store/Actions/types";
import { Additional } from "../../components";
import { ModalView } from "../../components";
import { url } from "../../services/host";
import imgMobile from "../../assets/img/mobile.png";
import imgNoMobile from "../../assets/img/noMobile.png";
import imgPlus from "../../assets/img/icoPlus.png";
import imgCamera from "../../assets/img/camera.png";
import imgRemover from "../../assets/img/remover.png";

import {
  getCategorys,
  getAdditional,
  getMeasureUnit,
  createProduct,
  updateProduct,
} from "../../hooks";

import { BsTrash, BsCartCheckFill } from "react-icons/bs";

// Schema de validação de dados
const schemaProduct = {
  name: {
    presence: { allowEmpty: false, message: "^Nome do produto é obrigatório" },
  },
  category_id: {
    presence: {
      allowEmpty: false,
      message: "^Você deve informar o tipo de categoria",
    },
    numericality: { greaterThan: 0, message: "^Escolha um das opções" },
  },
  measureUnid_id: {
    presence: {
      allowEmpty: false,
      message: "^Você deve informar o tipo de unidade",
    },
    numericality: { greaterThan: 0, message: "^Escolha um das opções" },
  },
  price: {
    presence: {
      allowEmpty: false,
      message: "^Valor obrigatório",
    },
    numericality: {
      strict: true,
      message: "^Informe o valor correto, utilize 0.00 invés de 0,00",
    },
  },
  pricePromotion: {
    numericality: {
      strict: true,
      message: "^Informe o valor correto, utilize 0.00 invés de 0,00",
    },
  },
};

const ProductNew = (props) => {
  const { state } = props.location;
  const dispatch = useDispatch();
  const history = useHistory();
  const [listAddicionais, setListAdditional] = useState([]);
  const [selectedAddicional, setSelectedAdditional] = useState([]);
  const [valueDefaultAdditional, setValueDefaultAdditional] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [measureUnit, setMeasureUnit] = useState([]);
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [isModalAdditionalDefault, setIsModalAdditionalDefault] =
    useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    (() => {
      if (state !== undefined) {
        setFormState({
          ...formState,
          isValid: true,
          isEdit: true,
          values: state,
        });
        setPreviewImage(state.image_url);
        if (state.additional !== "") {
          setSelectedAdditional(state.additional.split(",").map(Number));
          getAdditional(state.additional).then((response) =>
            setListAdditional(response)
          );
        }

        if (state.additional !== "") {
          setValueDefaultAdditional(
            state.valueDefautAdditional.split(",").map(Number)
          );
        }
      }
    })();
    // eslint-disable-next-line
  }, [state]);

  useEffect(() => {
    (() => {
      getCategorys().then((response) => {
        setCategorys(response);
        getMeasureUnit().then((response) => setMeasureUnit(response));
      });
    })();
  }, []);

  // Atualização os dados do Formulário
  const handleChange = (event) => {
    event.persist();

    let dataForm = {
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value === "true"
            ? true
            : event.target.value === "false"
            ? false
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    };

    const errors = validate(dataForm.values, schemaProduct);

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
  // Selecionar imagem e salvar no state
  const handleSelectImage = (event) => {
    if (!event.target.files) {
      return;
    }
    // método Array.from() cria uma nova instância de um Array quando for
    // passado um array-like ou um iterable object como argumento
    const selectImage = Array.from(event.target.files);
    setImage(selectImage);
    // Cria um novo objeto URL, cujo tempo de vida está ligado ao document na
    // janela na qual este objeto foi criado. O novo objeto URL representa o
    // objeto File
    const selectImagePreview = URL.createObjectURL(selectImage[0]);
    setPreviewImage(selectImagePreview);
  };
  // Remove uma image
  const handleRemoverImage = () => {
    setImage([]);
    setPreviewImage(null);
  };
  // Enviar dados do Formulário produto para Salvar ou Editar
  const handlerSubmit = (event) => {
    event.preventDefault();
    setIsloading(true);

    const dataForm = {
      name: formState.values.name,
      description: formState.values.description || "",
      ingredient: formState.values.ingredient || "",
      price: parseFloat(formState.values.price),
      promotion: formState.values.promotion || false,
      pricePromotion: formState.values.pricePromotion || 0,
      visibleApp: formState.values.visibleApp,
      category_id: formState.values.category_id,
      measureUnid_id: formState.values.measureUnid_id,
      additional: formState.values.additional,
      valueDefautAdditional: formState.values.valueDefautAdditional,
    };

    // validação dos dados
    if (formState.isValid) {
      const data = new FormData();
      data.append("name", dataForm.name);
      data.append("description", dataForm.description);
      data.append("ingredient", dataForm.ingredient);
      data.append("price", dataForm.price);
      data.append("promotion", dataForm.promotion);
      data.append("pricePromotion", dataForm.pricePromotion);
      data.append("additional", dataForm.additional);
      data.append("visibleApp", dataForm.visibleApp);
      data.append("category_id", dataForm.category_id);
      data.append("measureUnid_id", dataForm.measureUnid_id);
      data.append("valueDefautAdditional", dataForm.valueDefautAdditional);

      // Incluir todas as imagens selecionadas
      image.forEach((img) => {
        data.append("image", img);
      });

      // Salvar ou criar um novo produto, se existir o state enviado pelo
      // produto ATUALIZAR senão SALVAR
      if (formState.isEdit) {
        // ATUALIZAR os dados do produto
        updateProduct(formState.values.id, data).then((resp) => {
          dispatch({
            type: SET_MESSAGE,
            payload: resp.success
              ? "Seu produto foi atualizado com sucesso."
              : "Erro ao inserir",
          });
          setIsloading(false);
          resp.success ?? history.goBack();
        });
      } else {
        // SALVAR os dados do novo produto
        createProduct(data).then(() => {
          dispatch({
            type: SET_MESSAGE,
            payload: "Seu produto foi adiconado com sucesso.",
          });
          clearFields();
          setIsloading(false);
        });
      }
    }
  };
  // Selecionar itens de adicionais
  const handleSelectItem = (id) => {
    const alreadySelected = selectedAddicional.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedAddicional.filter((item) => item !== id);
      setSelectedAdditional(filteredItems);
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          additional: filteredItems.toString(),
        },
      });
    } else {
      const alreadyListAdditional = listAddicionais.some(
        (addit) => addit.typeAdditional_id === id
      );

      if (!alreadyListAdditional) {
        getAdditional(id).then((response) =>
          setListAdditional([...listAddicionais, ...response])
        );
      }
      setSelectedAdditional([...selectedAddicional, id]);
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          additional: [...selectedAddicional, id].toString(),
        },
      });
    }
  };

  // Selecionar ou Remover Adicionais padrão
  const handleSelectAdditionlDefault = (additional) => {
    // Valor não encontrado retorna -1 | valor localizado retorna 0
    const alreadySelected = valueDefaultAdditional.findIndex(
      (item) => item === additional.id
    );
    // // Item de selção unica já escolhida
    const itemUniqueSelected = listAddicionais
      .filter((addit) => addit.manySelected === false)
      .filter((item) => valueDefaultAdditional.includes(item.id))
      .find(
        (typeAddit) => typeAddit.typeAdditional === additional.typeAdditional
      );

    if (alreadySelected >= 0) {
      const filteredItems = valueDefaultAdditional.filter(
        (item) => item !== additional.id
      );
      setValueDefaultAdditional(filteredItems);
      setFormState({
        ...formState,
        values: {
          ...formState.values,
          valueDefautAdditional: filteredItems.toString(),
        },
      });
    } else {
      // Se o adicional é do tipo apenas uma escolha verificar se já foi
      // escolhido um deste item
      if (typeof itemUniqueSelected !== "undefined") {
        const filteredItems = valueDefaultAdditional.filter(
          (item) => item !== itemUniqueSelected.id
        );
        setValueDefaultAdditional([...filteredItems, additional.id]);
        setFormState({
          ...formState,
          values: {
            ...formState.values,
            valueDefautAdditional: [...filteredItems, additional.id].toString(),
          },
        });
      } else {
        setValueDefaultAdditional([...valueDefaultAdditional, additional.id]);
        setFormState({
          ...formState,
          values: {
            ...formState.values,
            valueDefautAdditional: [
              ...valueDefaultAdditional,
              additional.id,
            ].toString(),
          },
        });
      }
    }
  };
  // Limpar os campos
  const clearFields = () => {
    setFormState({
      isValid: false,
      values: {},
      touched: {},
      errors: {},
    });
    setSelectedAdditional([]);
    setImage([]);
    setPreviewImage(null);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col className="ml-auto mr-auto" md="12">
            <Card className="card-user">
              <CardHeader className="no-gutters">
                <CardTitle tag="h5">
                  <div className="imageVisibleMobile">
                    <img
                      src={
                        formState.values.visibleApp ? imgMobile : imgNoMobile
                      }
                      alt="mobile"
                    />
                    {state !== undefined ? "Editar Produto" : "Novo Produto"}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handlerSubmit} className="form-control">
                  <Row>
                    <Col md="12">
                      <Row>
                        <Col md="9">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label>Nome</label>
                                <Input
                                  name="name"
                                  placeholder="nome do produto"
                                  autoFocus={true}
                                  type="text"
                                  invalid={hasError("name")}
                                  value={formState.values.name || ""}
                                  onChange={(event) => handleChange(event)}
                                />
                                {formState.touched.name &&
                                  Array.isArray(formState.errors.name) &&
                                  formState.errors.name.map((error, idx) => {
                                    return (
                                      <FormText key={idx}>
                                        <span className="error">{error}</span>
                                      </FormText>
                                    );
                                  })}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Categoria</label>
                                <Input
                                  type="select"
                                  id="category_id"
                                  name="category_id"
                                  invalid={hasError("category_id")}
                                  placeholder="Selecione Categoria"
                                  onChange={(event) => handleChange(event)}
                                  value={formState.values.category_id || 0}
                                >
                                  <option value="0">
                                    Selecionar Categoria
                                  </option>
                                  {categorys.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                                {formState.touched.category_id &&
                                  Array.isArray(formState.errors.category_id) &&
                                  formState.errors.category_id.map(
                                    (error, idx) => {
                                      return (
                                        <FormText key={idx}>
                                          <span className="error">{error}</span>
                                        </FormText>
                                      );
                                    }
                                  )}
                              </FormGroup>
                            </Col>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Unid. Medida</label>
                                <Input
                                  id="measureUnid_id"
                                  type="select"
                                  invalid={hasError("measureUnid_id")}
                                  name="measureUnid_id"
                                  value={formState.values.measureUnid_id || 0}
                                  onChange={(event) => handleChange(event)}
                                >
                                  <option value="0">
                                    Selecionar Unid. Medida
                                  </option>
                                  {measureUnit.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      id={item.unid}
                                    >
                                      {item.description}
                                    </option>
                                  ))}
                                </Input>
                                {formState.touched.measureUnid_id &&
                                  Array.isArray(
                                    formState.errors.measureUnid_id
                                  ) &&
                                  formState.errors.measureUnid_id.map(
                                    (error, idx) => {
                                      return (
                                        <FormText key={idx}>
                                          <span className="error">{error}</span>
                                        </FormText>
                                      );
                                    }
                                  )}
                              </FormGroup>
                            </Col>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Preço</label>
                                <Input
                                  valid={
                                    formState.values.promotion ? false : true
                                  }
                                  type="text"
                                  name="price"
                                  invalid={hasError("price")}
                                  value={formState.values.price || ""}
                                  onChange={(event) => handleChange(event)}
                                  style={{ fontWeight: 600, fontSize: 16 }}
                                />
                                {formState.touched.price &&
                                  Array.isArray(formState.errors.price) &&
                                  formState.errors.price.map((error, idx) => {
                                    return (
                                      <FormText key={idx}>
                                        <span className="error">{error}</span>
                                      </FormText>
                                    );
                                  })}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Exibir produto no App</label>
                                <Input
                                  type="select"
                                  name="visibleApp"
                                  value={formState.values.visibleApp || 0}
                                  onChange={(event) => handleChange(event)}
                                >
                                  <option value={false}>Não</option>
                                  <option value={true}>Sim</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Promoção</label>
                                <Input
                                  type="select"
                                  name="promotion"
                                  value={formState.values.promotion || 0}
                                  onChange={(event) => handleChange(event)}
                                >
                                  <option value={false}>Não</option>
                                  <option value={true}>Sim</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col className="pl-3" md="4">
                              <FormGroup>
                                <label>Preço Promocional</label>
                                <Input
                                  valid={
                                    formState.values.promotion ? true : false
                                  }
                                  type="text"
                                  name="pricePromotion"
                                  invalid={hasError("pricePromotion")}
                                  value={formState.values.pricePromotion || ""}
                                  onChange={(event) => handleChange(event)}
                                  style={{ fontWeight: 600, fontSize: 16 }}
                                />
                                {formState.touched.pricePromotion &&
                                  Array.isArray(
                                    formState.errors.pricePromotion
                                  ) &&
                                  formState.errors.pricePromotion.map(
                                    (error, idx) => {
                                      return (
                                        <FormText key={idx}>
                                          <span className="error">{error}</span>
                                        </FormText>
                                      );
                                    }
                                  )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col md="3" className="row justify-content-center">
                          <div className="contentImageProdut">
                            {previewImage !== null ? (
                              <div>
                                <object
                                  data={previewImage}
                                  type="image/png"
                                  className="imgProduct"
                                >
                                  <img
                                    src={`${url}/uploads/default.jpg`}
                                    alt="default"
                                    // className="avatar"
                                  />
                                </object>
                                <img
                                  src={imgRemover}
                                  alt="remover"
                                  className="removerImage"
                                  onClick={() => handleRemoverImage()}
                                />
                              </div>
                            ) : (
                              <label htmlFor="icon-button-file">
                                <img
                                  src={imgCamera}
                                  alt="icon"
                                  style={{ height: 100 }}
                                />
                              </label>
                            )}
                            <input
                              id="icon-button-file"
                              type="file"
                              accept="image/*"
                              onChange={handleSelectImage}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Descrição</label>
                            <Input
                              type="textarea"
                              name="ingredient"
                              value={formState.values.ingredient || ""}
                              onChange={(event) => handleChange(event)}
                              placeholder="Descrição do produto"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Additional
                        selected={selectedAddicional}
                        onClick={(id) => handleSelectItem(id)}
                      />
                    </Col>
                    {selectedAddicional.length > 0 && (
                      <Col md="12">
                        <div className="listAdditionalDefault">
                          <div>
                            <span>O produto possui adicional padrão.</span>
                            <p>
                              Este(s) são os adicionais definidos como padrão
                              para este produto.
                            </p>
                          </div>
                          <Button
                            color="dark"
                            onClick={() => setIsModalAdditionalDefault(true)}
                          >
                            Definir
                          </Button>{" "}
                        </div>
                        {listAddicionais.length > 0 ? (
                          <Table responsive>
                            <thead>
                              <tr>
                                <th style={{ textAlign: "center" }}>#</th>
                                <th>Descrição</th>
                                <th>Preço</th>
                                <th>Categoria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {listAddicionais.map((item, idx) => {
                                if (valueDefaultAdditional.includes(item.id)) {
                                  return (
                                    <tr key={idx}>
                                      <td
                                        onClick={() =>
                                          handleSelectAdditionlDefault(item)
                                        }
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <BsTrash />
                                      </td>
                                      <td>{item.description}</td>
                                      <td>{item.price}</td>
                                      <td>{item.typeAdditional}</td>
                                    </tr>
                                  );
                                }
                                return null;
                              })}
                            </tbody>
                          </Table>
                        ) : (
                          <div className="titleTableAdditional">
                            <span>
                              Não foi definido nenhum adicional padrão para este
                              produto
                            </span>
                          </div>
                        )}
                      </Col>
                    )}
                  </Row>

                  <Row>
                    <CardFooter style={{ width: "100%" }}>
                      <div className="ml-auto mr-auto footerButton">
                        <Button color="dark" onClick={() => history.goBack()}>
                          Voltar
                        </Button>{" "}
                        <Button
                          color="dark"
                          onClick={() =>
                            history.push({ pathname: "categoryProduct" })
                          }
                        >
                          Nova Categoria
                        </Button>{" "}
                        <Button
                          disabled={isLoading || !formState.isValid}
                          color="info"
                          type="submit"
                        >
                          {isLoading && <Spinner size="sm" color="warning" />}{" "}
                          {state === undefined
                            ? "Cadastrar"
                            : "Salvar Alterações"}
                        </Button>
                      </div>
                    </CardFooter>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* MODAL: ADICIONAR/EDITAR CATEGORIA */}
      <ModalView
        size="lg"
        title={
          <>
            <img src={imgPlus} alt="icon" style={{ height: 40 }} />
            <Label>Selecionar adicionais como padrão.</Label>
          </>
        }
        modal={isModalAdditionalDefault}
        toggle={() => setIsModalAdditionalDefault(!isModalAdditionalDefault)}
        confirmed={() => setIsModalAdditionalDefault(!isModalAdditionalDefault)}
      >
        <div className="contentAddAdditinalDefault">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>#</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {listAddicionais.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td
                      onClick={() => handleSelectAdditionlDefault(item)}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        color: "#008000",
                        fontSize: "20px",
                      }}
                    >
                      {valueDefaultAdditional.includes(item.id) && (
                        <BsCartCheckFill />
                      )}
                    </td>
                    <td
                      onClick={() => handleSelectAdditionlDefault(item)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {item.description}
                    </td>
                    <td>{item.price}</td>
                    <td>{item.typeAdditional}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </ModalView>
    </>
  );
};

export default ProductNew;
