/*
 * Query pets list from back-end, and show it as table
 * Use redux to manage data
*/

import { useState, useEffect } from 'react';
import {
	Container,
	Row,
	Col,
} from 'reactstrap';

import ComTable from '../components/ComTable';
import Header from "../components/Headers/Header";
import AdoptModal from '../components/AdoptModal';
import AuthModal from '../components/AuthModal';
import { 
	getPetsByPage,  
	clearPets,
	setAuthModalOpen,
} from '../redux/plistReducer';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../utilities/myAxios';

const tableHead = [
	'type',
	'age',
	'owner',
	'',
];

const PetsList = (props) => {
	const [adpModalOpen, setAdpModalOpen] = useState(false);
	const adpModalToggle = () => setAdpModalOpen(!adpModalOpen);

	const authModalOpen = useSelector((state) => state.plist.authModalOpen);
	const dispatch = useDispatch();
	const authModalToggle = () => dispatch(setAuthModalOpen(!authModalOpen));

	const tabData = useSelector((state) => state.plist.pets);
	const [petInfo, setPetInfo] = useState({});

	const adpBtnHandler = async (pid, index) => {
		const response = await axiosInstance.get(`pets/${pid}`);
		setPetInfo({...response.data, index});
		setAdpModalOpen(true);
	};

	const pageHandler = (page) => {
		dispatch(getPetsByPage(page));
	};

	const getPageNum = async () => {
		const response = await axiosInstance.get('pets-num');
		return Math.ceil(response.data.number / 10);
	}

	useEffect(() => {
		dispatch(getPetsByPage(1));
		return () => {
			dispatch(clearPets());
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header 
				title="Get pets list"
				subtitle="JWT token needed. Valid token can get through login."
			/>
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
					<Col>
						<AuthModal 
							isOpen={authModalOpen}
							toggle={authModalToggle}
							backdrop={false}
						/>
						<ComTable 
							title="All pets list"
							tableHead={tableHead}
							tbodyData={tabData}
							totalPage={getPageNum}
							pageHandler={pageHandler}
							adpBtnHandler={adpBtnHandler}
						/>
						<AdoptModal
							isOpen={adpModalOpen}
							toggle={adpModalToggle}
							backdrop="static"
							className="modal-dialog-centered"
							petInfo={petInfo}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default PetsList;
