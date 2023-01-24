import React, { useState, useEffect } from "react";
import { Button, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { SET_MESSAGE } from "../../store/Actions/types";
import { activeAutoOpenClose } from "../../store/Actions/notificateAction";
import { getOpeningHours, saveOpeningHours } from "../../hooks";

import "./styles.css";
import Switch from "../Switch";

const AutoOpenCloseSetting = () => {
  const dispatch = useDispatch();
  const { auto_open_close } = useSelector((state) => state.Notificate);
  const [hours, setHours] = useState({
    hourStart: "",
    hourEnd: "",
    isEdit: false,
  });

  useEffect(() => {
    getOpeningHours().then((resp) => setHours(resp));
  }, []);

  const handleForm = (event) => {
    event.persist();
    let dataForm = {
      ...hours,
      isEdit: true,
      [event.target.name]: event.target.value,
    };
    setHours(dataForm);
  };

  const handleSave = () => {
    saveOpeningHours(hours).then((result) => {
      dispatch({
        type: SET_MESSAGE,
        payload: result?.message,
      });
      setHours({ ...hours, isEdit: false });
    });
  };

  const toogle = () => {
    dispatch(activeAutoOpenClose());
  };

  return (
    <div className="groupSetting">
      <div className="caption">
        <p>Abertura e fechamento</p>
        <small>
          O sistema pode gerenciar automaticamente a abertura e o fechamento da
          loja.
        </small>
        <div className="groupSwitch">
          <span>Ativar</span>
          <Switch value={auto_open_close} onClick={toogle} />
        </div>

        <div className="actions">
          <div className="fields">
            <small htmlFor="hourStard">Abertura</small>
            <Input
              name="hourStart"
              type="time"
              value={hours?.hourStart || ""}
              onChange={(e) => handleForm(e)}
              disabled={auto_open_close}
            />
          </div>
          <div className="fields">
            <small htmlFor="hourEnd">Fechamento</small>
            <Input
              name="hourEnd"
              type="time"
              value={hours?.hourEnd || ""}
              onChange={(e) => handleForm(e)}
              disabled={auto_open_close}
            />
          </div>
        </div>
        <Button
          color="info"
          disabled={auto_open_close || !hours.isEdit}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default AutoOpenCloseSetting;
