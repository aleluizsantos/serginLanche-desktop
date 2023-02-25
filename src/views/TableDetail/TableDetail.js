import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { Card, CardTitle, Button, CardText, Row, Col } from "reactstrap";
import { BsArrowLeftCircle } from "react-icons/bs";

import "./styles.css";

import { SET_MESSAGE } from "../../store/Actions/types";
import ModalPayments from "../ModalPayments";
import { formatCurrency, makePayment } from "../../hooks";
import { listItemCommads, deleteCommads } from "../../hooks/useTable";
import Commads from "./Commads";
import ItemCommad from "./ItemCommad";
import { ModalAddNewCommads } from "./ModalAddNewCommads";
import { typePayment, typeDelivery } from "../../variables/types";
import imgTable from "../../assets/img/table.png";

const typeSelectCommad = {
  commad: {},
  items: [],
  typeDelivery: typeDelivery.TABLE, // Atendimento mesa
  typePayment: typePayment.NOTA, // Aguardando pagamento
};

// Detalhe da mesa: Recebendo da page Mesas o state contendo
// dados da mesa
function TableDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();
  const [dataTable, setDataTable] = useState(state);
  const [itemCommad, setItemCommads] = useState([]);
  const [selectedCommad, setSelectedCommad] = useState(typeSelectCommad);
  const [modalNewCommads, setModalNewCommads] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [listCommandsOpen, setListCommandsOpen] = useState(state.commads);

  // VISUALIZAR OS PEDIDOS DA COMANDS
  const handleViewCommads = async (commad) => {
    let itemsCommads = [];

    // Verificar se a comanda possui pedidos.
    if (Number(commad.totalValueToOrder) > 0) {
      // Verificar se o pedido esta salvo no state do componete
      const hasItemCommad = itemCommad.filter(
        (elem) => elem.commads_id === commad.id_commads
      );
      // Se encontrou o pedido no state definir como  selecionado
      if (hasItemCommad.length > 0) {
        setSelectedCommad({
          commad: commad,
          items: hasItemCommad,
          typeDelivery: typeDelivery.TABLE, // Atendimento mesa
          typePayment: typePayment.NOTA,
        });
      } else {
        // Buscar os pedidos referente a comanda e salvar no state para nova pesquisa
        listItemCommads(commad.id_commads).then((result) => {
          setItemCommads([...itemCommad, result]);
          setSelectedCommad({
            commad: commad,
            items: result,
            typeDelivery: typeDelivery.TABLE, // Atendimento mesa
            typePayment: typePayment.NOTA, // Aguardando pagamento
          });
        });
      }
    } else {
      setSelectedCommad({
        commad: commad,
        items: itemsCommads,
        typeDelivery: typeDelivery.TABLE, // Atendimento mesa
        typePayment: typePayment.NOTA, // Aguardando pagamento
      });
    }
  };

  // ADICIONAR UMA NOVA COMANDA
  const handleAddNewCommands = (commadsNew) => {
    setListCommandsOpen([...listCommandsOpen, commadsNew]);
    setSelectedCommad({
      commad: { ...commadsNew },
      items: [],
      typeDelivery: typeDelivery.TABLE, // Atendimento mesa
      typePayment: typePayment.NOTA, // Aguardando pagamento
    });
  };

  //DELETAR UM COMANDA QUE NÃO TENHA NENHUM PEDIDO
  const handleDeleteCommads = async (idCommads) => {
    const hasDelete = await deleteCommads(idCommads);
    // Exclusão com sucesso
    if (hasDelete.status === 200) {
      // Remover da lista a comanda excluída
      const removeCommadsList = listCommandsOpen.filter(
        (item) => item.id_commads !== idCommads
      );
      if (removeCommadsList.length > 0) {
        setListCommandsOpen(removeCommadsList);
        setSelectedCommad(typeSelectCommad);
      } else {
        history.push("tables");
      }
    }
  };

  // REALIZAR PAGAMENTO DA CONTA
  const handleMakePayment = async (
    id_commads,
    tokenOperation,
    typePayment,
    cash
  ) => {
    await makePayment(id_commads, tokenOperation, typePayment, cash).then(
      async (resp) => {
        dispatch({
          type: SET_MESSAGE,
          payload: resp.message,
        });
        // Atualizar a listacommadsOpen
        const updateListCommadOpen = await listCommandsOpen.filter(
          (item) => item.id_commads !== id_commads
        );
        // Se não existir mais comanda ir para as mesas
        if (updateListCommadOpen.length <= 0) history.push("tables");
        // Se existir comandas aberta atualizar a lista
        setListCommandsOpen(updateListCommadOpen);
        // Atualizar o total gasto na mesa
        const valueTotal =
          Number(dataTable.tableGrandTotal) -
          Number(selectedCommad.commad.totalValueToOrder);

        setDataTable({
          ...dataTable,
          tableGrandTotal: valueTotal,
        });
        // limpar a seleção da commada
        setSelectedCommad(typeSelectCommad);
      }
    );
  };

  return (
    <div className="container-table-details">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 50 }}>
        <Button
          className="btn-round btn-icon"
          color="info"
          onClick={() => history.goBack()}
        >
          <BsArrowLeftCircle size={28} color="#007bff" />
        </Button>
        <CardText style={{ marginLeft: 20 }} tag="h3">
          Detalhe da mesa
        </CardText>
      </div>

      <Row>
        {/* DADOS DA MESA COM AS COMANDAS ABERTAS */}
        <Col>
          <Card body>
            <small className="status-table">
              {dataTable.busy ? "Ocupado" : "Livre"}
            </small>
            <CardTitle tag="h5">
              <img className="avatar" src={imgTable} alt="table" /> Mesa{" "}
              {dataTable.id}
            </CardTitle>
            <CardText tag="h6">
              Total: {formatCurrency(dataTable.tableGrandTotal)}
            </CardText>
            <CardText tag="h6">
              Total comandas: {listCommandsOpen.length}
            </CardText>
            <Button
              onClick={() => setModalNewCommads(!modalNewCommads)}
              color="info"
              outline
            >
              Criar comanda
            </Button>

            {listCommandsOpen.length > 0 && <h5>Comandas abertas</h5>}
            {/* LISTA TODAS AS COMANDAS CRIADAS PARA A MESA */}
            {listCommandsOpen.map((item, idx) => (
              <Commads
                key={idx}
                onClick={() => handleViewCommads(item)}
                commad={item}
              />
            ))}
          </Card>
        </Col>
        {/* PEDIDO REALIZADO NA COMANDA -LISTAR
         *   Exibir somente se a comanda for selecionada
         */}
        <Col>
          {Object.keys(selectedCommad.commad).length > 0 && (
            <ItemCommad
              commads={selectedCommad}
              action={() => setSelectedCommad(typeSelectCommad)}
              deleteCommads={handleDeleteCommads}
              openModalPayment={() => setModalPayment(!modalPayment)}
            />
          )}
        </Col>
      </Row>

      {/* MODAL ADICIONAR COMANDA */}
      <ModalAddNewCommads
        open={modalNewCommads}
        toogle={setModalNewCommads}
        idTable={dataTable.id}
        tokenOperation={dataTable.tokenOperation}
        addNewCommad={handleAddNewCommands}
      />
      {/* MODAL PAGAMENTO DA COMANDA */}
      <ModalPayments
        dataCommad={selectedCommad}
        open={modalPayment}
        toogle={setModalPayment}
        makePayment={handleMakePayment}
      />
    </div>
  );
}

export default TableDetail;
