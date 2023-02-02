import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsBank } from "react-icons/bs";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CardText,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";

import { useLocation, useHistory } from "react-router-dom";

import "./styles.css";
import { typeFormMyOrder } from "./typeFrom";
import ListProducts from "./listProducts";
import Coupom from "./Coupom";
import { getAddressStore, createOrder, getListPayments } from "../../hooks";

const Pdv = () => {
  const history = useHistory();
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [listPayment, setListPayment] = useState([]);
  const { state } = useLocation();
  const [order, setOrder] = useState(typeFormMyOrder);

  console.log(order);

  useEffect(() => {
    const fetchData = async () => {
      let address;
      // Verificar se foi passado o Endereço
      address = state?.address ? state.address : await getAddressStore();

      setOrder({
        ...order,
        commads: state.commad,
        commads_id: state.commad.id_commads,
        table_id: state.commad.table_id,
        name_client: state.commad.name_client,
        deliveryType_id: state.typeDelivery,
        statusRequest_id: 2, // Em Preparação
        payment_id: state.typePayment,
        address: address.address,
        number: address.number,
        neighborhood: address.neighborhood,
        phone: address.phone,
        city: address.city,
        uf: address.uf,
        items: [],
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchData = async () =>
      await getListPayments().then((resp) => setListPayment(resp));
    fetchData();
  }, []);
  // Adiciona o produto escolhido na order items
  const handleAddProductCar = (itemProduct) => {
    setOrder({
      ...order,
      items: [...order.items, itemProduct],
    });
  };

  // Remove o item da orderm, passando o index do item
  const handleRemoveItemOrder = (indexItem) => {
    let itemOrder = order.items;
    itemOrder.splice(indexItem, 1);
    setOrder({ ...order, items: itemOrder });
  };

  // Realizar a compra do produtos
  const handleCheckout = async () => {
    // Verificar se o pedido veio pelo telefone ou balcão
    if (order.commads_id === 1 && order.table_id === 1) {
      // Abri Modal para verificar tipo de pagamento
      setOpenModalPayment(true);
    } else {
      // Salvar meu pedido
      handleSalveOrder(order);
    }
  };

  // Salvar Pedido
  const handleSalveOrder = async (_order) => {
    const hasCreateOrder = await createOrder(_order);
    // Criação do pedido com sucesso
    if (hasCreateOrder.status === 201) history.push("myorders");
  };

  // Caso a venda seja feita via balcão o operador de informar
  // como será feito o pagamento
  const handleChangePayment = (paymentType) => {
    const { id } = paymentType;
    const changeOrder = {
      ...order,
      payment_id: id,
    };
    handleSalveOrder(changeOrder);
  };

  return (
    <div className="content">
      <Modal
        isOpen={openModalPayment}
        toggle={() => setOpenModalPayment(false)}
        backdrop={false}
      >
        <ModalHeader>Como será o pagamento?</ModalHeader>
        <ModalBody>
          {listPayment.map((item, idx) => (
            <ul key={idx} className="content-type-payment">
              <li onClick={() => handleChangePayment(item)}>
                <img src={item.image_url} alt={item.type} />
                <span>{item.type}</span>
              </li>
            </ul>
          ))}
        </ModalBody>
      </Modal>
      <Card>
        <CardHeader tag="h5" style={{ display: "flex", alignItems: "center" }}>
          <Button title="Voltar" onClick={() => history.goBack()} size="sm">
            <BsArrowLeftCircle size={26} />
          </Button>
          <Button
            title="Início"
            onClick={() => history.push("dashboard")}
            size="sm"
          >
            <BsBank size={26} />
          </Button>
          <CardText style={{ marginLeft: 20 }}>Ponto de Venda</CardText>
        </CardHeader>
        <CardBody>
          <div className="content-pdv">
            <ListProducts addProductCar={handleAddProductCar} />
            <Coupom
              order={order}
              removerItem={handleRemoveItemOrder}
              checkout={handleCheckout}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Pdv;
