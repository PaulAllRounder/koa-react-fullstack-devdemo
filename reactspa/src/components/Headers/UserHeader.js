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
import { Button, Container, Row, Col } from "reactstrap";
import styled from 'styled-components';

const PURL = process.env.PUBLIC_URL;
const StyledDiv = styled.div`
	min-height: 600px;
	background-image: url(${PURL}/img/${props => props.username === 'Paul'? 'team-1-800x800.jpg' : 'profileBg.jpg'});
	background-size: cover;
	background-position: center top;
`;
const headStr = 'Under construction. There is only a blank UI layout. <br />Still need auth to access.';

const UserHeader = (props) => {
	const {username} = props;
  return (
    <>
			<StyledDiv
				username={username}
				className="header pb-8 pt-5 pt-md-8"
			>
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
					<Row className="w-100">
            <Col lg="7" md="10">
							<h1 className="display-2 text-white">
								{`Hello ${typeof(username) === 'string'? username : ''}`}
							</h1>
              <p className="text-white mt-0 mb-5"
								dangerouslySetInnerHTML={{__html:headStr}}
							/>
							{username !== null && 
								<Button
									color="info"
									href="#pablo"
									onClick={(e) => e.preventDefault()}
								>
									Edit profile
								</Button>
							}
            </Col>
          </Row>
        </Container>
			</StyledDiv>
    </>
  );
};

export default UserHeader;
