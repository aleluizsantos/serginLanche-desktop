import React, { useState, createRef, useEffect } from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from "reactstrap";

import { listRoutes } from "../../routes";
import { signOut } from "../../store/Actions";
import Setting from "../Setting";

const NavbarHeader = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [color, setColor] = useState("dark");
  const sidebarToggle = createRef();
  const notificationAlert = createRef();
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.Message);
  const { newOrders } = useSelector((state) => state.Notificate);

  useEffect(() => {
    const notify = (place) => {
      let options = {};
      options = {
        place: place,
        message: (
          <div>
            <div>{message}</div>
          </div>
        ),
        type: "success",
        icon: "nc-icon nc-bell-55",
        autoDismiss: 7,
      };
      notificationAlert.current.notificationAlert(options);
    };
    (() => {
      message !== "" && message !== undefined && notify("br");
    })();
  }, [message, notificationAlert]);

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };

  // const dropdownToggle = (e) => {
  //   setDropdownOpen(!dropdownOpen);
  // };

  const getBrand = () => {
    let brandName = "Sergin Lanche";
    listRoutes.map((prop, key) => {
      if (window.location.href.indexOf(prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  // Efetuar o logout
  const handleLogout = () => {
    dispatch(signOut());
  };

  const handleGotoSetting = () => {
    setOpenSetting(!openSetting);
  };

  const BagdeAmoutMyOrder = () => {
    const amoutMyOrder = newOrders.filter(
      (item) => item.statusRequest_id === 1
    ).length;
    if (amoutMyOrder > 0) {
      return (
        <div className="badgeOrder">
          <span>{amoutMyOrder}</span>
        </div>
      );
    }
  };
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar color={color} expand="lg" className={"fixed-top navbar-absolute "}>
      <Setting
        open={openSetting}
        onChange={() => setOpenSetting(!openSetting)}
      />
      <Container fluid>
        <NotificationAlert ref={notificationAlert} />
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
            <NavItem>
              <BagdeAmoutMyOrder />
              <Link to="/myorders" className="nav-link btn-magnify">
                <i className="nc-icon nc-bell-55" />
                <p>
                  <span className="d-lg-none d-md-block">Meus Pedidos</span>
                </p>
              </Link>
            </NavItem>

            <NavItem>
              <Link
                to="#"
                onClick={() => handleGotoSetting()}
                className="nav-link btn-rotate"
              >
                <i className="nc-icon nc-settings-gear-65" />
                <p>
                  <span className="d-lg-none d-md-block">Configurações</span>
                </p>
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/signin"
                onClick={handleLogout}
                className="nav-link btn-rotate"
              >
                <i className="nc-icon nc-button-power" />
                <p>
                  <span className="d-lg-none d-md-block">Sair</span>
                </p>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarHeader;
