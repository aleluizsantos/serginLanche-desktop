import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FormGroup, Input, Button } from "reactstrap";
import { BsTrash } from "react-icons/bs";

import logo from "../../assets/img/icon.png";
import { formatCurrency } from "../../hooks";

const Coupom = ({ order, removerItem, checkout }) => {
  const { user } = useSelector((state) => state.Authenticate);
  const [noteItem, setNoteItem] = useState("");
  const produtsCuopom = order.items;
  const sumTotalCar = produtsCuopom.reduce(
    (acc, item) => acc + Number(item.sumTotalProduct),
    0
  );

  return (
    <div className="content-coupon">
      <section>
        <div className="header-coupom">
          <img src={logo} alt="logo" />
          <div className="address-store">
            <span>SERGIN LANCHE</span>
            <span>
              {order.address}, {order.number}, {order.neighborhood},{" "}
              {order.city}/{order.uf}
            </span>
            <span>{order.phone}</span>
          </div>
        </div>

        <div style={{ paddingTop: 10, borderBottom: "1px solid #cfcece" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6>MESA: {order?.commads?.table_id}</h6>
            <h6>COMANDA: {order?.commads?.id_commads}</h6>
          </div>
          <h6>Cliente: {order?.commads?.name_client}</h6>
        </div>

        <div className="item-cupom">
          {produtsCuopom.map((item, idx) => (
            <div
              key={idx}
              style={{ borderBottom: "1px solid #272727", padding: "10px 0" }}
            >
              <div className="content-produt">
                <div className="description-product">
                  <img
                    src={item?.product?.image_url}
                    alt="logo"
                    className="avatar"
                  />
                  <span>{item?.product?.name}</span>
                </div>

                <div className="amount-product">
                  <span>{item?.amount}</span> X <span>{item?.price}</span>
                </div>
                <span>{formatCurrency(item?.sumTotalProduct)}</span>
                <BsTrash
                  title={`Excluir item '${item?.product?.name}'`}
                  size={18}
                  className="trash"
                  color="red"
                  onClick={() => removerItem(idx)}
                />
              </div>

              {item.listAdditional.length > 0 && <strong>Adicionais</strong>}
              {item.listAdditional.map((addit, idxAdit) => (
                <div key={idxAdit} className="cupom-additional">
                  <span>{addit?.description}</span>
                  <span>{addit?.price}</span>
                </div>
              ))}
              {item?.note && `OBS: ${item?.note}`}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <FormGroup>
          <Input
            type="textarea"
            style={{ height: 80 }}
            name="noteOrderProduct"
            maxLength={256}
            value={noteItem || ""}
            onChange={(e) => setNoteItem(e.target.value)}
            placeholder="Observação geral"
          />
        </FormGroup>
        <div>
          <span>TOTAL</span>
          <span>{formatCurrency(sumTotalCar)}</span>
        </div>
        <Button
          onClick={() => checkout()}
          disabled={sumTotalCar <= 0}
          color="info"
        >
          Comprar
        </Button>
        <div>
          <span style={{ fontSize: 10 }}>Operador: {user.name}</span>
        </div>
      </footer>
    </div>
  );
};

export default Coupom;
