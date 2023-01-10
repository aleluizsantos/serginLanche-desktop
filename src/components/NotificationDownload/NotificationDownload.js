import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles.css";

import icoDownloadCloud from "../../assets/img/icon_download-cloud.png";
import { UPDATESYSTEM } from "../../store/Actions/types";

export default function NotificationDownload() {
  const dispatch = useDispatch();
  const { updateSystem } = useSelector((state) => state.Notificate);

  let timeUpdate;

  async function handleUpdateApp() {
    const update = await window.indexBridge.hasUpdateApp();
    if (!update) {
      clearInterval(timeUpdate);
      dispatch({
        type: UPDATESYSTEM,
        payload: false,
      });
    }
  }

  function checkUpddate() {
    timeUpdate = setInterval(() => {
      handleUpdateApp();
    }, 2000);
  }

  // Checando se a atualizaçaõ foi concluída
  updateSystem && checkUpddate();

  return updateSystem ? (
    <div className="container__notification__dowload">
      <img src={icoDownloadCloud} alt="download" />
      <span>Download</span>
    </div>
  ) : null;
}
