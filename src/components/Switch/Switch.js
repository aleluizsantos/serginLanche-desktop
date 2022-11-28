import React from "react";
import "./styles.css";

const Switch = ({ value, onClick }) => {
  const toogle = value ? "flex-end" : "flex-start";
  return (
    <div
      className="swift"
      style={{
        justifyContent: toogle,
        background: value ? "#CDFFCE" : "#f1f1f1",
        borderColor: value ? "#CDFFCE" : "#f1f1f1",
      }}
    >
      <div
        className="toogle"
        onClick={onClick}
        style={{
          background: value ? "#7fff00" : "#f1f1f1",
        }}
      />
    </div>
  );
};

export default Switch;
