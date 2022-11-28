import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../hooks";

const PrivateRouteWithLayout = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) =>
        isAuthenticated() ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect to="/signIn" />
        )
      }
    />
  );
};

export default PrivateRouteWithLayout;
