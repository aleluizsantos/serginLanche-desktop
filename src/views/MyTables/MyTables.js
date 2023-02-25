import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsBank } from "react-icons/bs";
import { useHistory } from "react-router-dom";

import { saveTable } from "../../hooks/useTable";
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
    loadingTable();
  }, []);

  const loadingTable = async () => {
    getListTable().then((resp) => setTables(resp));
  };

  const handleSelectedTable = (table) => {
    history.push({
      pathname: "tablesDetails",
      state: table,
    });
  };

  const createNewTable = async (form) => {
    //Verificar a validação do formulário
    if (form.isValid) {
      saveTable(form.values).then(() => {
        setModalNewTable(!modalNewTable);
        loadingTable();
      });
    }
  };

  return (
    <div className="content">
      <Card style={{ height: "100vh" }}>
        <CardHeader tag="h5" style={{ display: "flex", alignItems: "center" }}>
          <Button
            className="btn-round btn-icon"
            color="info"
            onClick={() => history.goBack()}
          >
            <BsArrowLeftCircle size={24} color="#007bff" />
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            className="btn-round btn-icon"
            color="info"
            onClick={() => history.push("dashboard")}
          >
            <BsBank size={22} color="#007bff" />
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
        saveTable={createNewTable}
      />
    </div>
  );
};

export default MyTables;
