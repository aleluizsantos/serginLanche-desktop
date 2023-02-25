import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button } from "reactstrap";

import { BsTrash, BsPencilSquare, BsFillPlusCircleFill } from "react-icons/bs";
import {
  getUserSystem,
  register,
  deleteUser,
  upgradeUser,
} from "../../../hooks/Auth";
import imgAdmin from "../../../assets/img/admin.png";
import imgUserBlocked from "../../../assets/img/user-blocked.png";
import imgUser from "../../../assets/img/user.png";
import imgAttendant from "../../../assets/img/attendant.png";
import ModalFormsUser from "../ModalFomsUser";
import "./styles.css";
import { typeFormUserSystem } from "../ModalFomsUser/types";
import ModalConfirmed from "../ModalConfirmed";
import { action } from "../type";

export default function UserSystem() {
  const [listUserSystem, setListUserSystem] = useState([]);
  const [selectedUser, setSelectedUser] = useState(typeFormUserSystem);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalConfirmed, setModalConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      getUserSystem().then((resp) => setListUserSystem(resp));
    };
    fetchData();
  }, []);

  // Set: usuário escolhido pelo usuário e abre o modal com os dados
  const handleSelectedUser = (user, _action) => {
    setSelectedUser(
      user
        ? {
            ...selectedUser,
            isEdit: true,
            values: user,
          }
        : typeFormUserSystem
    );

    switch (_action) {
      case action.NEW_USER:
      case action.EDIT_USER:
        setOpenModalUser(true);
        break;
      case action.DELETE_USER:
        setModalConfirmed(true);
        break;
      default:
        break;
    }
  };

  // salvar novo usuário
  const handleToSaveUser = async (user, _action) => {
    try {
      if (_action === action.NEW_USER) {
        register(user).then((resp) => {
          setListUserSystem([...listUserSystem, resp]);
        });
      }
      if (_action === action.EDIT_USER) {
        upgradeUser(user).then(() => {
          const toUpdate = listUserSystem.map((item) =>
            item.id === user.id ? user : item
          );
          setListUserSystem(toUpdate);
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Excluir o usuário
  const handleDeleteUser = async (idUser) => {
    deleteUser(idUser).then((resp) => {
      const removeUser = listUserSystem.filter((item) => item.id !== idUser);
      setListUserSystem(removeUser);
      setModalConfirmed(false);
    });
  };

  return (
    <>
      <ModalFormsUser
        open={openModalUser}
        user={selectedUser}
        toggle={setOpenModalUser}
        toSaveUser={handleToSaveUser}
      />
      <ModalConfirmed
        title="Excluir usuário"
        toogle={() => setModalConfirmed(!ModalConfirmed)}
        open={openModalConfirmed}
        data={selectedUser.values}
        confirmed={handleDeleteUser}
      />
      <Card>
        <CardHeader tag="h5">Usuários do Sistema</CardHeader>
        <CardBody>
          <Button
            onClick={() => handleSelectedUser(null, action.NEW_USER)}
            className="btn-round btn-icon"
            color="info"
          >
            <BsFillPlusCircleFill size={28} color="#007bff" />
          </Button>
          <section id="transaction">
            <table id="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {React.Children.toArray(
                  listUserSystem.map((item) => (
                    <tr>
                      <td>
                        <img
                          style={{ height: 25 }}
                          src={item.blocked ? imgUserBlocked : imgUser}
                          alt="user"
                        />{" "}
                        {item.name}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>
                        <img
                          style={{ height: 25 }}
                          src={
                            item.typeUser === "admin" ? imgAdmin : imgAttendant
                          }
                          alt="ìcone admin"
                        />
                      </td>
                      <td>
                        <Button
                          onClick={() =>
                            handleSelectedUser(item, action.DELETE_USER)
                          }
                          className="btn-round btn-icon"
                          color="danger"
                        >
                          <BsTrash />
                        </Button>
                        <Button
                          onClick={() =>
                            handleSelectedUser(item, action.EDIT_USER)
                          }
                          className="btn-round btn-icon"
                          color="info"
                        >
                          <BsPencilSquare />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </CardBody>
      </Card>
    </>
  );
}
