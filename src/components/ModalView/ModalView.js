import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";

const ModalView = (props) => {
  const { title, modal, toggle, children, confirmed, size } = props;
  const [backdrop] = useState("static");
  const [keyboard] = useState(true);

  const handleConfirmed = () => {
    confirmed();
  };

  return (
    <div>
      <Modal
        size={size}
        isOpen={modal}
        toggle={() => toggle()}
        backdrop={backdrop}
        keyboard={keyboard}
      >
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirmed}>
            Confirmar
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

ModalView.prototype = {
  title: PropTypes.string,
  modal: PropTypes.bool,
  toggle: PropTypes.func,
  children: PropTypes.node,
  confirmed: PropTypes.func,
  idProdSelected: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};
ModalView.defaultProps = {
  size: "md",
};

export default ModalView;
