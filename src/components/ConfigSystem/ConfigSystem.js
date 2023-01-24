import React from "react";
import { Button } from "reactstrap";

export default function ConfigSystem() {
  const handleOpenSettingConfig = () => window.indexBridge.openSettingConfing();

  return (
    <div>
      <div className="groupSetting">
        <div className="caption">
          <p>Redefinir preferências</p>
          <small>
            Você pode definir suas preferencia do sistema de impressora e som
          </small>
          <Button color="info" onClick={handleOpenSettingConfig}>
            Preferências...
          </Button>
        </div>
      </div>
    </div>
  );
}

// {Object.keys(configSystem).map((key, idx) => (
//   <div key={idx} className="groupSetting">
//     <div className="caption">
//       <p>{configSystem[key].title}</p>
//       <small>{configSystem[key].description}</small>
//       {/* {key === "print" && (
//         <small>Impressora padrão: {configSystem[key].printName}</small>
//       )} */}
//     </div>
//     <div className="actions">
//       <Swift
//         value={configSystem[key].auto}
//         onClick={() => handleUpgradeAction(key, { ...configSystem[key] })}
//       />
//     </div>
//   </div>
// ))}
