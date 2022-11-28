import React, { useState, useEffect } from "react";
// reactstrap componentss
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  CardText,
  Table,
  Button,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  Label,
} from "reactstrap";

import "./styles.css";

import { ModalView, SelectDropdown, Pagination } from "../../components";
import imgEntryProduct from "../../assets/img/inventory.png";
import icoTrash from "../../assets/img/icoTrash-64.png";
import icoBuy from "../../assets/img/icoBuy-64.png";

import { formatCurrency, formatDate } from "../../hooks/format";
import { toCurrency } from "../../hooks/currencyConversion";
import { getProductSearch } from "../../hooks/Product";
import { getProvider } from "../../hooks/provider";
import {
  getEntryProducts,
  addEntryProduct,
  deletEntryProduct,
} from "../../hooks/entryProductStock";
import validate from "validate.js";

const EntryProductStock = () => {
  const [modalAddStock, setModalAddStock] = useState(false);
  const [modalRemover, setModalRemover] = useState(false);
  const [entryProduct, setEntryProduct] = useState([]);
  const [dataListAddEntryProduct, setDataListAddEntryProduct] = useState([]);
  const [itemselected, setItemSelected] = useState("");
  const [totalRecords, setTotalRecords] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [valuePurchase, setValuePurchase] = useState(0);
  const [nameProvider, setNameProvider] = useState("");
  const [dataEntry, setDataEntry] = useState();
  const [product, setProduct] = useState("");
  const [amountEntryProduct, setAmountEntryProduct] = useState("");
  const [priceEntryProduct, setPriceEntryProduct] = useState("");
  const [validForm, setValidForm] = useState({
    isValid: false,
    errors: {},
  });

  useEffect(() => {
    (() => {
      getEntryProducts(pageCurrent).then((response) => {
        setEntryProduct(response.productStock);
        setTotalRecords(response.totalentryProduct);
      });
    })();
  }, [pageCurrent]);

  // Carregar os 10 ultimos lançamentos
  const loadingEntryProduct = async () => {
    await getEntryProducts(pageCurrent).then((response) => {
      setEntryProduct(response.productStock);
      setTotalRecords(response.totalentryProduct);
    });
  };

  const schema = {
    dataEntry: {
      presence: { allowEmpty: false },
    },
    amount: {
      presence: { allowEmpty: false, message: "Campo obrigatório" },
      numericality: true,
    },
    measureUnid: {
      presence: { allowEmpty: false, message: "Campo obrigatório" },
    },
    price: {
      presence: { allowEmpty: false, message: "Campo obrigatório" },
      numericality: true,
    },
    nameProduct: {
      presence: { allowEmpty: false, message: "Campo obrigatório" },
    },
    nameProvider: {
      presence: { allowEmpty: false, message: "Campo obrigatório" },
    },
  };

  // Buscar lista de Fornecedores conforme parameto passado
  const searchProvider = async (inputValue) => {
    const response = await getProvider(inputValue);
    const dataProvider = response.map((item) => {
      const dataItem = {
        value: item.id,
        label: item.nameProvider,
      };
      return dataItem;
    });
    return dataProvider;
  };

  // Buscar lista de Produto conforme parameto passado
  const searchProduct = async (inputValue) => {
    const response = await getProductSearch(inputValue);
    const dataProducts = response.products.map((item) => {
      const dataItem = {
        value: item.id,
        label: item.name,
        measureUnid: item.measureUnid,
        inventory: item.inventory,
      };
      return dataItem;
    });
    return dataProducts;
  };

  // Somar o total de itens que forma comprados
  const purchaseSum = (totalItem) => {
    setValuePurchase(valuePurchase + totalItem);
  };

  // Deletar o item
  const deleteItem = (itemselected) => {
    deletEntryProduct(itemselected);
    setModalRemover(!modalRemover);
    loadingEntryProduct();
  };

  // Abrir modal confirmando o item a ser excluido
  const handleModalDelete = (item) => {
    setItemSelected(item);
    setModalRemover(!modalRemover);
  };
  // Abrir modal de Adicionar item de entrada
  const handleModalAddEntryProduct = () => {
    setValidForm({
      isValid: false,
      errors: {},
    });
    clearfields();
    setModalAddStock(!modalAddStock);
  };

  const handleRemoveItemListProvisional = (itemProduct) => {
    setValuePurchase(valuePurchase - itemProduct.total);
    const newList = dataListAddEntryProduct.filter(
      (item) => item.nameProduct !== itemProduct.nameProduct
    );
    setDataListAddEntryProduct(newList);
  };

  // Dados do formulário, adicinar na lista provisória para inclusão
  const handleAddListEntryProduct = (event) => {
    event.preventDefault();

    const dataListAdd = {
      dataEntry: dataEntry,
      amount: amountEntryProduct,
      measureUnid: product.measureUnid,
      price: toCurrency(priceEntryProduct),
      product_id: product.value,
      nameProduct: product.label,
      provider_id: nameProvider.value,
      nameProvider: nameProvider.label,
      total: Number(priceEntryProduct) * Number(amountEntryProduct),
    };

    const errors = validate(dataListAdd, schema);

    const isValidForm = {
      isValid: errors ? false : true,
      errors: errors || {},
    };

    setValidForm(isValidForm);

    if (isValidForm.isValid) {
      purchaseSum(dataListAdd.total); //Somar os itens
      clearfields(); //Limpar os campos
      setDataListAddEntryProduct([...dataListAddEntryProduct, dataListAdd]);
    }
  };

  // Limpar campos para adicionar novos itens
  const clearfields = () => {
    setProduct("");
    setAmountEntryProduct("");
    setPriceEntryProduct("");
  };

  // Rastear os erros do formulários
  const hasError = (field) => (validForm.errors[field] ? true : false);

  // Salvar todos os itens de entrada, da lista temporiária
  const handleSalveItensEntry = () => {
    if (dataListAddEntryProduct.length > 0) {
      addEntryProduct(dataListAddEntryProduct);
      loadingEntryProduct();
      setModalAddStock(false);
      setDataListAddEntryProduct([]);
    }
  };

  return (
    <div className="content">
      {/* Modal Adiconar item */}
      <ModalView
        size="lg"
        title={
          <>
            <img src={icoBuy} alt="trash" style={{ height: 40 }} />{" "}
            <Label>Adicionar produto no estoque</Label>
          </>
        }
        modal={modalAddStock}
        toggle={() => handleModalAddEntryProduct()}
        confirmed={handleSalveItensEntry}
      >
        <Form onSubmit={handleAddListEntryProduct}>
          <Row>
            <Col className="pl-3" md="8">
              <FormGroup>
                <Label>Nome fornecedor</Label>
                <SelectDropdown
                  placeholder="Informe o fornecedor"
                  options={searchProvider}
                  onChange={setNameProvider}
                  invalid={hasError("nameProvider")}
                />
              </FormGroup>
            </Col>
            <Col className="pl-3" md="4">
              <FormGroup>
                <Label for="exampleDatetime">Data compra</Label>
                <Input
                  type="date"
                  name="date"
                  id="exampleDate"
                  placeholder="date placeholder"
                  onChange={(event) => setDataEntry(event.target.value)}
                  invalid={hasError("dataEntry")}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ background: "#f1f1f1", paddingTop: 15 }}>
            <Col md="6">
              <FormGroup>
                <Label>Produto</Label>
                <SelectDropdown
                  placeholder="Informe o produto"
                  options={searchProduct}
                  isClearabl={true}
                  setValue={product}
                  onChange={setProduct}
                  invalid={hasError("nameProduct")}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <span className="measureUnid">{product.measureUnid}</span>
              <FormGroup>
                <Label>Quantidade</Label>
                <Input
                  placeholder="Quant."
                  type="text"
                  value={amountEntryProduct}
                  onChange={(event) =>
                    setAmountEntryProduct(event.target.value)
                  }
                  invalid={hasError("amount")}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Preço</Label>
                <Input
                  placeholder="0.00"
                  style={{ fontWeight: 600, fontSize: 16 }}
                  type="text"
                  value={priceEntryProduct}
                  onChange={(event) =>
                    setPriceEntryProduct(toCurrency(event.target.value))
                  }
                  invalid={hasError("price")}
                />
              </FormGroup>
            </Col>
          </Row>

          <div className="buttonAdd">
            <div>
              <span>Saldo em Estoque: </span>
              <span
                style={{
                  fontWeight: 700,
                  color: product.inventory < 0 ? "red" : "black",
                }}
              >
                {product.inventory} {product.measureUnid}
              </span>
            </div>
            <Button typ="submit" outline color="success" size="sm">
              <i className="fa fa-plus" /> Adicionar
            </Button>{" "}
          </div>
          <Row>
            <div className="contentTable">
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>P. Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dataListAddEntryProduct.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="groupItem">
                          <i
                            className="fa fa-times"
                            onClick={() =>
                              handleRemoveItemListProvisional(item)
                            }
                          />
                          {item.nameProduct}
                        </div>
                      </td>
                      <td>
                        {item.amount}
                        {item.measureUnid}
                      </td>
                      <td>{formatCurrency(item.price)}</td>
                      <td className="text-right">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Row>
        </Form>
        <div className="totalEntryProduct">
          <div>
            <span className="title">Número itens:</span>
            <span style={{ paddingLeft: 20 }}>
              {dataListAddEntryProduct.length}
            </span>
          </div>
          <div>
            <span className="title">Valor da nota:</span>
            <span style={{ paddingLeft: 20 }}>
              {formatCurrency(valuePurchase)}
            </span>
          </div>
        </div>
      </ModalView>
      {/* Modal Remover item */}
      <ModalView
        title={
          <>
            <img src={icoTrash} alt="trash" style={{ height: 40 }} />{" "}
            <Label> Remover item </Label>
          </>
        }
        modal={modalRemover}
        toggle={() => setModalRemover(!modalRemover)}
        confirmed={() => deleteItem(itemselected)}
      >
        {itemselected && (
          <div className="text-center">
            <strong>Deseje realmente excluir o item?</strong>
            <p>
              O item <strong>{itemselected.name}</strong>, do fornecedor{" "}
              {itemselected.nameProvider} serár removido.
            </p>
          </div>
        )}
      </ModalView>

      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <div className="imageVisibleMobile">
              <img src={imgEntryProduct} alt="mobile" />
              Entrada de produto
            </div>
          </CardTitle>
        </CardHeader>

        <CardBody>
          <CardTitle tag="h5">Lançamentos de entrada</CardTitle>
          <Button onClick={() => setModalAddStock(!modalAddStock)}>
            <i className="fa fa-plus" /> Adicinar
          </Button>
          <CardText style={{ color: "#c6c6c6" }}>
            Exibidos os dez ultimos lançamentos de entrada.
          </CardText>
          <Table responsive>
            <thead className="text-primary">
              <tr>
                <th className="text-center">Data</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th className="text-right">Preço Unitário</th>
                <th className="text-right">P. Total</th>
                <th>Fornecedor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entryProduct.map((item, idx) => (
                <tr key={idx}>
                  <td>{formatDate(item.data_entry)}</td>
                  <td>{item.name}</td>
                  <td className="text-right">{item.amount}</td>
                  <td className="text-right">{item.price}</td>
                  <td className="text-right">
                    {formatCurrency(Number(item.amount) * Number(item.price))}
                  </td>
                  <td>{item.nameProvider}</td>
                  <td>
                    <div className="groupButton">
                      <Button
                        className="btn-round btn-icon"
                        color="danger"
                        outline
                        size="sm"
                        onClick={() => handleModalDelete(item)}
                      >
                        <i className="fa fa-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>

        <CardFooter>
          {!!totalRecords && (
            <Pagination
              totalRecords={Number(totalRecords)}
              pageLimit={10}
              pageNeighbours={1}
              onPageChanged={(data) => setPageCurrent(data.currentPage)}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EntryProductStock;
