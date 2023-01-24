import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardTitle, Button, CardText, Row, Col } from "reactstrap";

import "./styles.css";

import { formatCurrency } from "../../hooks/format";
import { listItemCommads } from "../../hooks/useTable";

import imgTable from "../../assets/img/table.png";
import Commads from "./Commads";
import ItemCommad from "./ItemCommad";
import { AddNewCommads } from "./AddNewCommads";

const typeSelectCommad = {
  idCommad: null,
  items: [],
};

function TableDetail() {
  const { state } = useLocation();
  const [itemCommad, setItemCommads] = useState([]);
  const [selectedCommad, setSelectedCommad] = useState(typeSelectCommad);
  const [modalNewCommads, setModalNewCommads] = useState(false);

  const handleViewCommads = async (commad) => {
    // Lista os items da comanda somente se exite algo.
    if (Number(commad.totalValueToOrder) > 0) {
      const hasItemCommad = itemCommad.filter(
        (elem) => elem.commads_id === commad.id_commads
      );

      if (hasItemCommad.length > 0) {
        setSelectedCommad({
          idCommad: commad.id_commads,
          items: hasItemCommad,
        });
      } else {
        listItemCommads(commad.id_commads).then((result) => {
          setItemCommads(...itemCommad, result);
          setSelectedCommad({ idCommad: commad.id_commads, items: result });
        });
      }
    } else {
      setSelectedCommad({
        idCommad: commad.id_commads,
        items: [],
      });
    }
  };

  return (
    <div className="content">
      <h5>Detalhe da mesa</h5>
      <Row>
        <Col>
          <Card body style={{ width: "30rem" }}>
            <small className="status-table">
              {state.busy ? "Ocupado" : "Livre"}
            </small>
            <CardTitle tag="h5">
              <img className="avatar" src={imgTable} alt="table" /> Mesa{" "}
              {state.id}
            </CardTitle>
            <CardText tag="h6">
              Total: {formatCurrency(state.tableGrandTotal)}
            </CardText>
            <CardText tag="h6">Comandas: {state.commads.length}</CardText>
            <Button
              onClick={() => setModalNewCommads(!modalNewCommads)}
              color="info"
              outline
            >
              Criar comanda
            </Button>

            <h5>Comandas abertas</h5>
            {state.commads.map((item, idx) => (
              <Commads
                key={idx}
                commad={item}
                listItemCommad={handleViewCommads}
              />
            ))}
          </Card>
        </Col>

        <Col>
          {selectedCommad.idCommad && (
            <ItemCommad
              commads={selectedCommad}
              action={() => setSelectedCommad(typeSelectCommad)}
            />
          )}
        </Col>
      </Row>

      <AddNewCommads
        open={modalNewCommads}
        toogle={setModalNewCommads}
        idTable={state.id}
        tokenOperation={state.tokenOperation}
      />
    </div>
  );
}

export default TableDetail;
