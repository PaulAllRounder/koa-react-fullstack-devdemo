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
import React, {useState} from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
	FormFeedback,
	CustomInput,
	Label,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import {
	Formik,
	Form,
	Field
} from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utilities/myAxios';
import styled from 'styled-components';

import WrappedInput from '../utilities/InputWrapper';
import AccountSuccessModal from '../components/AccountSuccessModal';

//formik validate schame for yup
const accountSchema = Yup.object().shape({
	username: Yup.string()
		.min(5, 'At least 5 chars!')
		.required('Required'),
	password: Yup.string()
		.matches(
			/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			'Password must contain at least 8 characters, one uppercase, one number and one special case character.'
		)
		.required('Required'),
	repassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Password do not match!')
		.required('Required'),
	agreeCB: Yup.boolean()
	.oneOf([true], 'Sorry, you have to :-('),
	portrait: Yup.mixed()
		.test(
			'img-type',
			'Must jpeg/png type image!',
			(value) => {
				if(!value) return true;
				return value.type === 'image/jpeg' || value.type === 'image/png';
			})
		.test(
			'file-size',
			'File size must less then 200K!',
			(value) => {
				if(!value) return true;
				return value.size < 200 * 1024;
			}
		)
});


//for password hint
const pwColor = ['text-danger', 'text-orange', 'text-yellow', 'text-yellow', 'text-success'];
const pwHintMsg = ['poor', 'weak', 'medium', 'medium', 'strong'];

//wrapped div for 'is-invalid' class get effect
const StyledDiv = styled.div`
	input.is-invalid {
		border: solid 1px rgb(251, 99, 64) !important;
	}
`;

const Register = () => {
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);
	const [loginName, setLoginName] = useState('');
	const [loginPwd, setLoginPwd] = useState('');

	//formik submit handle function
	const submitHandler = async (values, actions) => {
		//username check first
		const userCheck = await axiosInstance.post('user-check', {username: values.username});
		if(userCheck.data.code && userCheck.data.code === 10101) {
			actions.setFieldError('username', 'This username has already been registered!');
			return;
		}
		//post formData
		const formData = new FormData();
		['username', 'password', 'portrait'].forEach((n) => {
			formData.append(n, values[n]);
		});
		await axiosInstance.post('new-account', formData);
		setLoginName(values.username);
		setLoginPwd(values.password);
		setModal(true);
		/*
		 * Note:
		 * Formik does not handle input=file, so you cannot use <Field>, 
		 * but can only use <input> to set it by "setFieldValue" in the onChange event.i
		 * However, this also prevents resetForm() from clearing this field. 
		 * The easy way is to refresh the page once :-)
		*/
		actions.resetForm();
	};

  return (
    <>
      <Col lg="6" md="8">
				<AccountSuccessModal 
					isOpen={modal}
					toggle={toggle}
					username={loginName}
					password={loginPwd}
				/>
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
						<Formik 
							initialValues={{
								username: '',
								password: '',
								repassword: '',
								agreeCB: true,
							}}
							onSubmit={submitHandler}
							validationSchema={accountSchema}
						>
							{ ({errors, touched, setFieldValue, values}) => { 
								const passwordHint = values.password.length > 2;
								const passwordLevel = (() => {
									let levl = 0;
									const password = values.password;
									if(password.length >= 8) levl += 1;
									if(password.match(/[A-Z]/)) levl += 1;
									if(password.match(/[0-9]/)) levl += 1;
									if(password.match(/[!@#$%^&*()\-_=+{};:,<.>]/)) levl += 1;
									return levl;
								})();

								return (
								<Form role="form">
									<FormGroup>
										<StyledDiv>
											{/* This class don't respons to 'is-invalid', so have to use another div to modify it */}
											<InputGroup className="input-group-alternative mb-3" >
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="ni ni-hat-3" />
													</InputGroupText>
												</InputGroupAddon>
												<Field 
													type="text" 
													placeholder="name" 
													name="username" 
													component={WrappedInput} 
												/>
											</InputGroup>
										</StyledDiv>
									</FormGroup>
									<FormGroup>
										<StyledDiv>
											<InputGroup className="input-group-alternative">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="ni ni-lock-circle-open" />
													</InputGroupText>
												</InputGroupAddon>
												<Field
													placeholder="Password"
													type="password"
													autoComplete="new-password"
													name="password"
													component={WrappedInput}
												/>
											</InputGroup>
										</StyledDiv>
									</FormGroup>
									{passwordHint && 
										<div className= "text-muted font-italic mt--3 mb-2">
											<small>
												password strength:{" "}
												<span className= {`${pwColor[passwordLevel]} font-weight-700`}>
													{pwHintMsg[passwordLevel]}
												</span>
											</small>
										</div>
									}
									<FormGroup>
										<StyledDiv>
											<InputGroup className="input-group-alternative">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="ni ni-lock-circle-open" />
													</InputGroupText>
												</InputGroupAddon>
												<Field
													placeholder="Repeat password"
													type="password"
													autoComplete="new-password"
													name="repassword"
													component={WrappedInput}
												/>
											</InputGroup>
										</StyledDiv>
									</FormGroup>
									<FormGroup>
										<Label for="uploadAvatar" className="text-muted text-sm ml-2">Your avatar (option)</Label>
										<CustomInput
											type="file"
											accept="image/png,image/jpeg"
											id="uploadAvatar"
											name="portrait"
											label="Pick your avatar file!"
											className="text-sm"
											invalid={errors.portrait? true : false}
											onChange={
												(e) => {
													setFieldValue('portrait', e.currentTarget.files[0]);
													e.currentTarget.blur();
											}}
										>
											<FormFeedback>{errors['portrait']}</FormFeedback>
										</CustomInput>
									</FormGroup>
									<FormGroup>
										<Field
											custom
											type="checkbox"
											id="agreeCheckBox"
											label="I agree with the Privacy Policy"
											name="agreeCB"
											className="text-muted"
											component={WrappedInput}
										/>
									</FormGroup>
									<div className="text-center">
										<Button className="mt-4" color="primary" type="submit">
											Create account
										</Button>
									</div>
								</Form>
							)}}
						</Formik>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
