import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardBody,
  CardText,
  Button,
  CardFooter,
} from "reactstrap";

import { formatCurrency } from "../../hooks";

import "./styles.css";

const ItemCommad = ({ commads, action, deleteCommads, openModalPayment }) => {
  const history = useHistory();

  // Ir para tela PDV
  const handleGotoPDV = () => {
    history.push({
      pathname: "pdv",
      state: commads,
    });
  };

  const existItems = () => (commads.items.length === 0 ? false : true);

  return (
    <div className="content">
      <Card body>
        <div className="close">
          <Button onClick={action} close />
        </div>
        <CardTitle tag="h5"></CardTitle>
        <CardText tag="h5">
          🛒 Pedido realizado na comanda{" "}
          <strong>{commads.commad.id_commads}</strong>
        </CardText>
        <CardText tag="h6">Cliente: {commads.commad.name_client}</CardText>
        <div>
          <Button onClick={handleGotoPDV}>Novo pedido</Button>
          {existItems() ? (
            <Button color="info" onClick={openModalPayment}>
              PAGAR
            </Button>
          ) : (
            <Button
              color="info"
              onClick={() => deleteCommads(commads.commad.id_commads)}
            >
              Encerrar comanda
            </Button>
          )}
        </div>
        <CardBody>
          {commads.items.map((commad, idx) => (
            <Items key={idx} items={commad.item} />
          ))}
          {!existItems() && <span>Não foi realizado nenhum pedido</span>}
        </CardBody>
        <CardFooter
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <CardText tag="h4">TOTAL</CardText>
          <CardText tag="h4">
            {formatCurrency(commads.commad.totalValueToOrder)}
          </CardText>
        </CardFooter>
      </Card>
    </div>
  );
};

// Lista os item do pedido
const Items = ({ items }) => {
  return items.map((item, idx) => (
    <div key={idx} className="content-item-commad">
      <div className="item-commad">
        <span>{item.product}</span>
        <span>
          {item.amount}x{item.price}
        </span>
        <span>{formatCurrency(item.total)}</span>
      </div>
      <Additional additional={item.additional} />
    </div>
  ));
};

// Lista os adicionais do item
const Additional = ({ additional }) => {
  return additional.map((addit, idx) => (
    <div key={idx} className="item-additional">
      <span>{addit.description}</span>
      <span>{addit.price}</span>
    </div>
  ));
};

export default ItemCommad;
