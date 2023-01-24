import React from "react";
import { Card, CardTitle, CardBody, CardText, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

import { formatCurrency } from "../../hooks/format";
import "./styles.css";

const ItemCommad = ({ commads, action }) => {
  const history = useHistory();

  function handleGotoPDV() {
    history.push({
      pathname: "pdv",
      state: commads,
    });
  }

  return (
    <div className="content">
      <Card body>
        <div className="close">
          <Button onClick={action} close />
        </div>
        <CardTitle tag="h5"></CardTitle>
        <CardText tag="h5">
          🛒 Pedido realizado na comanda {commads.idCommad}
        </CardText>
        <Button onClick={handleGotoPDV}>Novo pedido</Button>
        <CardBody>
          {commads.items.map((commad, idx) => (
            <Items key={idx} items={commad.item} />
          ))}
          {commads.items.length === 0 && (
            <span>Não foi realizado nenhum pedido</span>
          )}
        </CardBody>
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
