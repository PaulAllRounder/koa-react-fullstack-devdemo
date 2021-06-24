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
 * Use formik/yup deal form & validate
 * Use redux dispatch login action 
 * jump to main after login
 * Don't deal with 3rd-party login(OAuth) yet
*/

import React from "react";
import { Route } from 'react-router-dom';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import {
	Formik,
	Form,
	Field
} from 'formik';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import { normalLogin } from '../redux/accountReducer';
import { useHistory } from 'react-router-dom';

import WrappedInput from '../utilities/InputWrapper';
import axiosInstance from '../utilities/myAxios';
import OAuthModal from '../components/OAuthModal';

const PURL = process.env.PUBLIC_URL;

const Login = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const submitHandler = async ({username, password}, actions) => {
		const response = await axiosInstance.post('signup', {username, password});
		if(response.data.code && response.data.code === 10102) {
			actions.setFieldError('username', 'Maybe wrong user name');
			actions.setFieldError('password', 'Or wrong password');
			return;
		}
		const { token, reftoken, avatar } = response.data;
		window.localStorage.setItem('token', token);
		window.localStorage.setItem('reftoken', reftoken);
		dispatch(normalLogin({ username, avatar}));
		actions.resetForm();
		history.push('/main');
	}

	const loginSchema = Yup.object().shape({
		username: Yup.string()
		.required('Required'),
		password: Yup.string()
		.required('Required'),
	});

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
										src={ `${PURL}/img/github.svg` }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
										src={ `${PURL}/img/google.svg` }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
						<Formik 
							initialValues={{
								username: '',
								password: '',
							}}
							onSubmit={submitHandler}
							validationSchema={loginSchema}
						>
							{(formik) => {return (
								<Form role="form">
									<FormGroup className="mb-3">
										<InputGroup className="input-group-alternative">
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="ni ni-single-02" />
												</InputGroupText>
											</InputGroupAddon>
											<Field
												placeholder="Name"
												type="text"
												name="username"
												autoComplete="name"
												component={WrappedInput}
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<InputGroup className="input-group-alternative">
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="ni ni-lock-circle-open" />
												</InputGroupText>
											</InputGroupAddon>
											<Field
												placeholder="Password"
												type="password"
												name="password"
												autoComplete="new-password"
												component={WrappedInput}
											/>
										</InputGroup>
									</FormGroup>
									<div className="custom-control custom-control-alternative custom-checkbox">
										<input
											className="custom-control-input"
											id=" customCheckLogin"
											type="checkbox"
										/>
										<label
											className="custom-control-label"
											htmlFor=" customCheckLogin"
										>
											<span className="text-muted">Remember me</span>
										</label>
									</div>
									<div className="text-center">
										<Button className="my-4" color="primary" type="submit">
											Sign in
										</Button>
									</div>
								</Form>
							)}}
						</Formik>
          </CardBody>
        </Card>
				<Route 
					exact
					strict
					path={`${props.match.path}/:tp/:code`}
					component={OAuthModal}
				/>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
