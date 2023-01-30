import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsBank } from "react-icons/bs";
import { Card, CardHeader, CardBody, Button, CardText } from "reactstrap";

import { useLocation, useHistory } from "react-router-dom";

import "./styles.css";
import { typeFormMyOrder } from "./typeFrom";
import ListProducts from "./listProducts";
import Coupom from "./Coupom";
import { getAddressStore, createOrder } from "../../hooks";

const Pdv = () => {
  const history = useHistory();
  const { state } = useLocation();
  const [order, setOrder] = useState(typeFormMyOrder);

  useEffect(() => {
    const fetchData = async () => {
      const addressStore = await getAddressStore();
      setOrder({
        ...order,
        commads: state.commad,
        commads_id: state.commad.id_commads,
        table_id: state.commad.table_id,
        name_client: state.commad.name_client,
        deliveryType_id: 3, // Atendimetno Mesa
        statusRequest_id: 2, // Em Preparação
        payment_id: 6, // pagament tipo nota
        address: addressStore.address,
        number: addressStore.number,
        neighborhood: addressStore.neighborhood,
        phone: addressStore.phone,
        city: addressStore.city,
        uf: addressStore.uf,
        items: [],
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const hasCreateOrder = await createOrder(order);
    // Criação do pedido com sucesso
    if (hasCreateOrder.status === 201) history.push("myorders");
  };

  return (
    <div className="content">
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
