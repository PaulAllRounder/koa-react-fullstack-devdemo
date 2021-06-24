/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/*
 * Use redux to implement auto login when just close the tab without logout.
*/

import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

import MainNavbar from "../components/Navbars/MainNavbar.js";
import MainFooter from "../components/Footers/MainFooter.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";
import { useDispatch } from 'react-redux';
import { autoSignIn } from '../redux/accountReducer';

const PURL = process.env.PUBLIC_URL;
const Admin = (props) => {
  const mainContent = React.useRef(null);
	const location = props.location;
	const dispatch = useDispatch();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
		dispatch(autoSignIn());
		//eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getRoutes = (routes) => {
		return routes
			.filter(prop => prop.layout === '/main')
			.map((prop, key) => {
				return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
				);
			});
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if ( location.pathname.includes(routes[i].layout + routes[i].path)) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/main/index",
					imgSrc: `${PURL}/img/demo-react.png`,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <MainNavbar
          {...props}
          brandText={getBrandText(location.pathname)}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/main/index" />
        </Switch>
        <Container fluid>
          <MainFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
