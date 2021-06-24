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
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

const Header = (props) => {
  return (
		<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
			<Container className="d-flex align-items-center" fluid>
				<Row className="w-100">
					<Col lg="7" md="10">
						<h1 className="display-2 text-white">
							{props.title}
						</h1>
						<p className="text-white mt-0 mb-5" 
							dangerouslySetInnerHTML={{__html:props.subtitle }}
						/>
						{props.children}
					</Col>
				</Row>
			</Container>
		</div>
  );
};

export default Header;
