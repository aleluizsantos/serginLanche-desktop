import React from "react";

import PropTypes from "prop-types";

const Minimal = (props) => {
  const { children } = props;

  return <div className="wrapper">{children}</div>;
};

Minimal.propTypes = {
  children: PropTypes.node,
};

export default Minimal;
