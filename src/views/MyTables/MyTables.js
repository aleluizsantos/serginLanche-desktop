import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsBank } from "react-icons/bs";
import { useHistory } from "react-router-dom";

import "./styles.css";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  CardText,
} from "reactstrap";
import CardTable from "./CardTable";
import ModalTableNew from "./ModalTableNew";
import { getListTable } from "../../hooks/useTable";

const MyTables = () => {
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [modalNewTable, setModalNewTable] = useState(false);

  useEffect(() => {
    getListTable().then((resp) => setTables(resp));
  }, []);

  const handleSelectedTable = (table) => {
    history.push({
      pathname: "tablesDetails",
      state: table,
    });
  };

  return (
    <div className="content">
      <Card style={{ height: "100vh" }}>
        <CardHeader tag="h5" style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={() => history.goBack()} size="sm">
            <BsArrowLeftCircle size={26} />
          </Button>
          <Button
            title="Início"
            onClick={() => history.push("dashboard")}
            size="sm"
          >
            <BsBank size={26} />
          </Button>
          <CardText style={{ marginLeft: 20 }}>Atendimento Mesas</CardText>
        </CardHeader>

        <CardBody>
          <div className="contentCardTable">
            {tables.map((table, idx) => (
              <CardTable
                onClick={() => handleSelectedTable(table)}
                key={idx}
                table={table}
              />
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <Button
            onClick={() => setModalNewTable(!modalNewTable)}
            color="info"
            outline
          >
            Adicionar mesa
          </Button>
        </CardFooter>
      </Card>

      <ModalTableNew
        open={modalNewTable}
        toogle={() => setModalNewTable(!modalNewTable)}
      />
    </div>
  );
};

export default MyTables;
