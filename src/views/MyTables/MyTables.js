import React, { useState, useEffect } from "react";

import "./styles.css";

import { Card, CardHeader, CardBody, CardFooter, Button } from "reactstrap";
import CardTable from "./CardTable";
import TableNew from "./TableNew";
import { getListTable } from "../../hooks/useTable";

const MyTables = () => {
  const [tables, setTables] = useState([]);
  const [modalNewTable, setModalNewTable] = useState(false);

  useEffect(() => {
    getListTable().then((resp) => setTables(resp));
  }, []);

  return (
    <div className="content">
      <Card>
        <CardHeader tag="h5">Atendimento Mesas</CardHeader>
        <CardBody>
          <div className="contentCardTable">
            {tables.map((table, idx) => (
              <CardTable key={idx} table={table} />
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

      <TableNew
        open={modalNewTable}
        toogle={() => setModalNewTable(!modalNewTable)}
      />
    </div>
  );
};

export default MyTables;
