import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// reactstrap componentss
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Table,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Spinner,
  Label,
} from "reactstrap";

import { BsTrash, BsPencilSquare, BsX } from "react-icons/bs";

import { url } from "../../services/host";
import { SET_MESSAGE } from "../../store/Actions/types";
import {
  getProduct,
  getCategorys,
  deleteProduto,
  getPromotionProduct,
  getProductSearch,
  debounceEvent,
  updateProduct,
} from "../../hooks";
import { ModalView, PaginationNew, SearchBar } from "../../components";
import imgNoMobile from "../../assets/img/noMobile.png";
import imgMobile from "../../assets/img/mobile.png";
import icoTrash from "../../assets/img/icoTrash-64.png";

const PRODUCT_PROMOTION = "-1";

const Product = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [dataProduct, setDataProduct] = useState([]);
  const [listAllCategorys, setListAllCategorys] = useState([]);
  const [selectCategory, setSelectCategory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [idProdSelected, setIdProdSelected] = useState("");
  const [productSelected, setProductSelected] = useState(null);
  const [search, setSearch] = useState(null);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    (() => {
      setIsloading(true);
      const categoryId = selectCategory.map((item) => item.id).toString();

      if (categoryId === PRODUCT_PROMOTION) {
        getPromotionProduct().then((response) => {
          setDataProduct(response);
          setIsloading(false);
        });
        return;
      }

      if (search === null) {
        getProduct(pageCurrent, categoryId).then((response) => {
          const { countProducts, products } = response;
          setDataProduct(products);
          setTotalRecords(countProducts);
          setIsloading(false);
        });
      } else {
        getProductSearch(search, pageCurrent).then((response) => {
          const { countProducts, products } = response;
          setDataProduct(products);
          setTotalRecords(countProducts);
          setIsloading(false);
        });
      }
    })();
  }, [pageCurrent, selectCategory, search]);

  //Button Categoria carrega todas as catgorias
  const dropdownToggle = (e) => {
    e.preventDefault();
    // Verificar se o usuário selecionado o botão de "PRODUTO EM PROMOÇÃO"
    // Se estiver selecionado ao clicar no botão categoria limpar state
    // selectCategory para um array vazio.
    const exist = selectCategory.findIndex(
      (cat) => cat.id === PRODUCT_PROMOTION
    );
    !!!exist && setSelectCategory([]);
    setSearch(null);

    listAllCategorys.length <= 0 &&
      getCategorys().then((response) => {
        setListAllCategorys(response);
      });
    setDropdownOpen(!dropdownOpen);
  };
  // Selecionar a categoria escolhida no button
  const handleSelectCategoy = (item) => {
    // se não tive objetos na categoria botão desabilitado
    if (listAllCategorys.length <= 0) return;

    // Remover da lista Category
    const newListCat = listAllCategorys.filter(
      (category) => category.id !== item.id
    );
    setListAllCategorys(newListCat);
    setSelectCategory([...selectCategory, item]);
  };
  // Remove o item selecionado das categorias
  const handleRemoveSelectCategory = (item) => {
    // Remover da lista do filtro de categorias selecionadas o item
    const newSelectCat = selectCategory.filter((cat) => cat.id !== item.id);
    // Retornar para page 1
    setPageCurrent(1);
    // Setar a nova lista de categoria apos exclusão do item
    setSelectCategory(newSelectCat);

    item.id !== PRODUCT_PROMOTION &&
      setListAllCategorys([...listAllCategorys, item]); //Retornar a categoria no Dropdown
  };
  // Badge retorna style de produto em promoção
  const BadgePromotion = (value) => {
    switch (value) {
      case true:
        return <span className="badge promotion">Promoção</span>;
      case false:
        return <span className="badge">Normal</span>;
      default:
        break;
    }
    return <span>{value ? "Promotion" : "Normal"}</span>;
  };
  // Redirecionar para a página de Cagastro de novo produto
  const goToAddNewProduct = () => {
    history.push({ pathname: "productNew" });
  };
  // Redireciona para a pagina Produto para editar-lo
  const goToEditProduct = (product) => {
    history.push({
      pathname: "/productNew",
      state: product,
    });
  };
  // Abre o modal
  const handleShowModal = (product) => {
    setIdProdSelected(product.id);
    setProductSelected(product);
    setModal(true);
  };
  //Exibe todos os produto em promoção
  const handleProductPromotion = () => {
    // Verificando se já esta selecionado os produto em promoção
    // Casa não esteja retorna -1, senão 0 já esta selecionado prod. em promoção
    const exist = selectCategory.findIndex(
      (cat) => cat.id === PRODUCT_PROMOTION
    );
    // Converte em true ou false
    Boolean(exist) &&
      setSelectCategory([
        { id: PRODUCT_PROMOTION, name: "Produtos em Promoções" },
      ]);
  };
  // Excluir um produto
  const handleDeleteProduct = (index) => {
    deleteProduto(index).then((response) => {
      // Remover o produto do array
      const newProduct = dataProduct.filter((item) => item.id !== index);
      setDataProduct(newProduct);

      // Definir novo total de quantidade de produtos
      const newTotalProduct = newProduct.length;
      setTotalRecords(newTotalProduct);

      dispatch({
        type: SET_MESSAGE,
        payload: response.message,
      });
      setModal(false);
    });
  };

  const handleSearch = (value) => {
    const searchValue = value === "" ? null : value;
    debounceEvent(() => setSearch(searchValue));
  };

  const handleChangeVisibleApp = (item) => {
    const newDataProduct = dataProduct.map((product) => {
      return product.id === item.id
        ? { ...product, visibleApp: !product.visibleApp }
        : product;
    });
    setDataProduct(newDataProduct);
    upgradeProductVisibleApp(item);
  };
  // Atualizar o produto Visivel no aplicativo
  const upgradeProductVisibleApp = async (product) => {
    const data = new FormData();
    data.append("name", product.name);
    data.append("description", product.description);
    data.append("price", parseFloat(product.price));
    data.append("promotion", product.promotion);
    data.append("pricePromotion", parseFloat(product.pricePromotion));
    data.append("category_id", parseInt(product.category_id));
    data.append("measureUnid_id", parseInt(product.measureUnid_id));
    data.append("visibleApp", !product.visibleApp);

    // ATUALIZAR os dados do produto
    await updateProduct(product.id, data);
  };

  return (
    <>
      <div className="content">
        {isloading && (
          <div className="spinner">
            <Spinner color="light" />
          </div>
        )}
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Meus Produtos </CardTitle>
                <div className="contentButton">
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={(e) => dropdownToggle(e)}
                  >
                    <DropdownToggle>
                      <i className="nc-icon nc-bullet-list-67" />
                      <span> Categoria</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      {listAllCategorys.map((item, idx) => (
                        <DropdownItem
                          key={idx}
                          id={item.id}
                          tag="a"
                          onClick={() => handleSelectCategoy(item)}
                        >
                          {item.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Button color="primary" onClick={handleProductPromotion}>
                    Produto em Promoção
                  </Button>
                  <Button color="info" onClick={goToAddNewProduct}>
                    Novo Produto
                  </Button>
                </div>
                {selectCategory.length > 0 ? (
                  <strong>Filtro:</strong>
                ) : (
                  <SearchBar onChange={(value) => handleSearch(value)} />
                )}
                <div className="selectCategory">
                  {selectCategory.map((item) => (
                    <span
                      key={item.id}
                      onClick={() => handleRemoveSelectCategory(item)}
                    >
                      <BsX />
                      {item.name}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive style={{ border: "solid 1px #a9a9a9" }}>
                  <thead className="text-primary">
                    <tr>
                      <th colSpan="2" className="text-center">
                        Produto
                      </th>
                      <th>Unidade</th>
                      <th className="text-right">Preço</th>
                      <th>Promoção</th>
                      <th className="text-right">P. Promoção</th>
                      <th>Categoria</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProduct.map((item, idx) => (
                      <tr key={idx}>
                        <td align="center">
                          <div className="contentImageName">
                            <object
                              data={item.image_url}
                              type="image/png"
                              className="avatar"
                            >
                              <img
                                src={`${url}/uploads/default.jpg`}
                                alt={item.description}
                                className="avatar"
                              />
                            </object>
                          </div>
                        </td>
                        <td className="title">
                          <img
                            style={{
                              height: 28,
                              paddingRight: 10,
                              cursor: "pointer",
                            }}
                            src={item.visibleApp ? imgMobile : imgNoMobile}
                            alt="mobile"
                            onClick={() => handleChangeVisibleApp(item)}
                          />
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => goToEditProduct(item)}
                          >
                            {item.name}
                          </span>
                        </td>
                        <td>{item.measureUnid}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                          {BadgePromotion(item.promotion)}
                        </td>
                        <td className="text-right">{item.pricePromotion}</td>
                        <td className="text-center">{item.category}</td>
                        <td>
                          <div className="groupButton">
                            <Button
                              className="btn-round btn-icon"
                              color="danger"
                              size="sm"
                              onClick={() => handleShowModal(item)}
                            >
                              <BsTrash />{" "}
                            </Button>
                            <Button
                              className="btn-round btn-icon"
                              color="success"
                              size="sm"
                              onClick={() => goToEditProduct(item)}
                            >
                              <BsPencilSquare />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <span className="totalProduct">
                  Total de produto: <strong>{totalRecords}</strong>
                </span>

                <PaginationNew
                  totalRecords={totalRecords}
                  pageLimit={10}
                  pageNeighbours={1}
                  onPageChanged={(data) => setPageCurrent(data)}
                />

                {/* {!!totalRecords && (
                  <Pagination
                    totalRecords={Number(totalRecords)}
                    pageLimit={10}
                    pageNeighbours={1}
                    onPageChanged={(data) => setPageCurrent(data)}
                  />
                )} */}
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Confirmação de remover produto */}
      <ModalView
        title={
          <>
            <img src={icoTrash} alt="trash" style={{ height: 40 }} />{" "}
            <Label> Remover Produto </Label>
          </>
        }
        modal={modal}
        toggle={() => setModal(!modal)}
        confirmed={() => handleDeleteProduct(idProdSelected)}
      >
        {productSelected && (
          <div className="text-center">
            <strong>Deseje realmente excluir o produto?</strong>
            <p>
              O produto <strong>{productSelected.name}</strong> será revomido.
            </p>
          </div>
        )}
      </ModalView>
    </>
  );
};
export default Product;
