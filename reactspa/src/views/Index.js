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
 * A simple main entry
*/

import {
  Container,
  Row,
  Col,
	UncontrolledCarousel,
	Button,
} from "reactstrap";
import styled from 'styled-components';

import Header from "../components/Headers/Header.js";

//custom style for Carousel to set caption color
const StyledUncontrolledCarousel = styled(UncontrolledCarousel)`
	div.carousel-caption>h3+p {
		color: var(--dark) !important;
		font-weight: bold;
		font-size: 0.85rem;
	}
`;

//Oh, I use a set of SVG images for carousel
const items = [
	{
		src: "data:image/svg+xml,%3Csvg focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 640 512' width='640' height='460'%3E %3Cdefs%3E %3CradialGradient id='mrg' fx='5%25' fy='5%25' r='65%25' spreadMethod='pad'%3E %3Cstop offset='0%25' stop-color='%23fff' stop-opacity='1'/%3E %3Cstop offset='100%25' stop-color='%2370AD47' stop-opacity='1' /%3E %3C/radialGradient%3E %3C/defs%3E %3Cpath fill='url(%23mrg)' d='M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z' /%3E%3C/svg%3E",
		altText: '...',
		header: 'Public require',
		caption: 'The public area can be accessed without a token.',
		key: '1',
	},
	{
		src: "data:image/svg+xml,%3Csvg focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 640 512' width='640' height='460'%3E %3Cdefs%3E %3CradialGradient id='mrg' fx='5%25' fy='5%25' r='95%25' spreadMethod='pad'%3E %3Cstop offset='0%25' stop-color='%23fff' stop-opacity='1'/%3E %3Cstop offset='100%25' stop-color='%23ED7D31' stop-opacity='1' /%3E %3C/radialGradient%3E %3C/defs%3E %3Cpath fill='url(%23mrg)' d='M630.6 364.9l-90.3-90.2c-12-12-28.3-18.7-45.3-18.7h-79.3c-17.7 0-32 14.3-32 32v79.2c0 17 6.7 33.2 18.7 45.2l90.3 90.2c12.5 12.5 32.8 12.5 45.3 0l92.5-92.5c12.6-12.5 12.6-32.7.1-45.2zm-182.8-21c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24c0 13.2-10.7 24-24 24zm-223.8-88c70.7 0 128-57.3 128-128C352 57.3 294.7 0 224 0S96 57.3 96 128c0 70.6 57.3 127.9 128 127.9zm127.8 111.2V294c-12.2-3.6-24.9-6.2-38.2-6.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 287.9 0 348.1 0 422.3v41.6c0 26.5 21.5 48 48 48h352c15.5 0 29.1-7.5 37.9-18.9l-58-58c-18.1-18.1-28.1-42.2-28.1-67.9z' /%3E%3C/svg%3E",
		altText: '...',
		header: 'Token authentication',
		caption: 'Log in to get the token, store it at localStorage, and bring the token when require.',
		key: '2',
	},
	{
		src: "data:image/svg+xml,%3Csvg focusable='false' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 640 512' width='640' height='460'%3E %3Cdefs%3E %3CradialGradient id='mrg' fx='95%25' fy='5%25' r='95%25' spreadMethod='pad'%3E %3Cstop offset='0%25' stop-color='%23fff' stop-opacity='1'/%3E %3Cstop offset='100%25' stop-color='%234472c4' stop-opacity='1' /%3E %3C/radialGradient%3E %3C/defs%3E %3Cpath fill='url(%23mrg)' d='M256 336h-.02c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0C-2.06 328.75.02 320.33.02 336H0c0 44.18 57.31 80 128 80s128-35.82 128-80zM128 176l72 144H56l72-144zm511.98 160c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02zM440 320l72-144 72 144H440zm88 128H352V153.25c23.51-10.29 41.16-31.48 46.39-57.25H528c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H383.64C369.04 12.68 346.09 0 320 0s-49.04 12.68-63.64 32H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h129.61c5.23 25.76 22.87 46.96 46.39 57.25V448H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z' /%3E%3C/svg%3E",
		altText: '...',
		header: 'Refresh when expire',
		caption: 'When receiving the token expiration indication, post token-refresh to get a new token.',
		key: '3',
	},
];

const Index = (props) => {
	const toPetsRoute = () => {
		props.history.push('/main/pets');
	};

  return (
    <>
			<Header 
				title="Seamless JWT refresh React demo"
				subtitle="This is a demo of how to use the React frontend to handle the JWT expiration refresh by the background.<br />
				By using the interceptor, the seamless refresh of the token is easy to achieve."
				children={
					<Button color="info" onClick={toPetsRoute} >
						Getting start
					</Button>
				}
			/>
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
					<Col lg='5' md='10'>
						<StyledUncontrolledCarousel items={items} />
					</Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
