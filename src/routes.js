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
  // {
  //   name: "Entrada Produto",
  //   icon: "nc-icon nc-cart-simple",
  //   component: EntryProductStockView,
  //   layout: MainLayout,
  //   path: "/entryProduct",
  //   security: true,
  // },
  // {
  //   name: "Fornecedores",
  //   icon: "nc-icon nc-app",
  //   component: ProviderView,
  //   layout: MainLayout,
  //   path: "/provider",
  //   security: true,
  // },
  {
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: UserView,
    layout: MainLayout,
    path: "/users",
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
      <Redirect to="/login" />
    </Switch>
  );
};

export { Routes, listRoutes };
