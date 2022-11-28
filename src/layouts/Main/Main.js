import React, { useState, createRef, useEffect } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import PropTypes from "prop-types";

import { Navbar, Footer, Sidebar } from "../../components";
import { listRoutes } from "../../routes";

let ps;

const Main = (props) => {
  const { children } = props;
  const [backgroundColor] = useState("white");
  const [activeColor] = useState("danger");
  const mainPanel = createRef();

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return () => {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  }, [mainPanel]);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={listRoutes}
        bgColor={backgroundColor}
        activeColor={activeColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <Navbar {...props} />
        {children}
        <Footer fluid />
      </div>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
