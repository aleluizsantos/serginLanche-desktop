import React, { useEffect } from "react";
import { Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PrivateRouteWithLayout, RouteWithLayout } from "./components";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";

import {
  Dashboard as DashboardView,
  Login as LoginView,
  Product as ProductView,
  ProductNew as ProductNewView,
  ProductCategory as ProductCategoryView,
  MyOrders as MyOrdersView,
  DetailsMyOrder as DetailsMyOrderView,
  Users as UserView,
  UserClient as UserClientView,
  PDV as PdvView,
  MyTables as MyTablesView,
  TableDetails as TableDetailsView,
  Payments as PaymentesView,
  SalePhone as SalePhoneView,
  DefinitionSystem as DefinitionSystemView,
} from "./views";

import { clearMessage } from "./store/Actions";

const listRoutes = [
  {
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: DashboardView,
    layout: MainLayout,
    path: "/dashboard",
    security: true,
  },
  {
    name: "Pedidos",
    icon: "nc-icon nc-tile-56",
    component: MyOrdersView,
    layout: MainLayout,
    path: "/myorders",
    security: true,
  },
  {
    name: "Categoria Produtos",
    icon: "nc-icon nc-bullet-list-67",
    component: ProductCategoryView,
    layout: MainLayout,
    path: "/categoryProduct",
    security: true,
  },
  {
    name: "Produtos",
    icon: "nc-icon nc-bag-16",
    component: ProductView,
    layout: MainLayout,
    path: "/product",
    security: true,
  },
  {
    name: "Clientes",
    icon: "nc-icon nc-badge",
    component: UserClientView,
    layout: MainLayout,
    path: "/userClient",
    security: true,
  },
  {
    name: "Atendimento Mesa",
    icon: "nc-icon nc-shop",
    component: MyTablesView,
    layout: MinimalLayout,
    path: "/tables",
    security: true,
  },
  {
    name: "Meu perfil",
    icon: "nc-icon nc-single-02",
    component: UserView,
    layout: MainLayout,
    path: "/users",
    security: true,
  },
  {
    name: "Definições",
    icon: "nc-icon nc-settings-gear-65",
    component: DefinitionSystemView,
    layout: MainLayout,
    path: "/definition",
    security: true,
  },
];

const Routes = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    history.listen((location) => dispatch(clearMessage()));
  }, [dispatch, history]);

  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      {listRoutes.map((route, idx) =>
        route.security ? (
          <PrivateRouteWithLayout
            key={idx}
            component={route.component}
            layout={route.layout}
            path={route.path}
            exact
          />
        ) : (
          <RouteWithLayout
            key={idx}
            component={route.component}
            layout={route.layout}
            path={route.path}
            exact
          />
        )
      )}
      <RouteWithLayout
        component={ProductNewView}
        layout={MainLayout}
        path={"/productNew"}
        exact
      />
      <RouteWithLayout
        component={DetailsMyOrderView}
        layout={MainLayout}
        path={"/detailsMyorder"}
        exact
      />
      <RouteWithLayout
        component={LoginView}
        layout={MinimalLayout}
        path={"/login"}
        exact
      />
      <RouteWithLayout
        component={PdvView}
        layout={MinimalLayout}
        path={"/pdv"}
        exact
      />

      <RouteWithLayout
        component={TableDetailsView}
        layout={MinimalLayout}
        path={"/tablesDetails"}
        exact
      />
      <RouteWithLayout
        component={TableDetailsView}
        layout={MainLayout}
        path={"/tablesDetails"}
        exact
      />
      <RouteWithLayout
        component={PaymentesView}
        layout={MainLayout}
        path={"/payments"}
        exact
      />
      <RouteWithLayout
        component={SalePhoneView}
        layout={MainLayout}
        path={"/salephone"}
        exact
      />
      <Redirect to="/login" />
    </Switch>
  );
};

export { Routes, listRoutes };
