import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";

import { useLocation } from "react-router-dom";

import "./styles.css";
import { typeFormMyOrder } from "./typeFrom";
import ListProducts from "./listProducts";
import Coupom from "./Coupom";

const Pdv = () => {
  const [order, setOrder] = useState(typeFormMyOrder);
  const { state } = useLocation();

  return (
    <div className="content">
      <Card>
        <CardHeader tag="h5">Ponto de Venda</CardHeader>
        <CardBody>
          <div className="content-pdv">
            <ListProducts />
            <Coupom />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Pdv;
