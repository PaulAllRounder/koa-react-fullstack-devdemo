/*
 * A example of using "reducer + context" as alternative to redux;
 * although the use of global data is not so necessary here :->.
 * The final conclusion is obvious, even if use immer here, it is more convenient and simpler to use RTK.
*/

import {
	Container,
	Row,
	Col,
} from 'reactstrap';
import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import axiosInstance from '../utilities/myAxios';

import ComTable from '../components/ComTable';
import AuthModal from '../components/AuthModal';
import UnAdoptModal from '../components/UnAdoptModal';
import Header from "../components/Headers/Header";
import MyPetsContext from '../utilities/contextManager'

const initialState = {
	authModalOpen: false,
	unAdoptModalOpen: false,
	pets: [],
	selectedPet: {pid:null, index:null}
};

/*
 * For async action deal function
 * Note: this isn't "createAsyncThunk" in RTK, the only arg is "action.payload",
 * no 2nd parameter like thankAPI, so I can't deal state here.
*/
const asyncThunk = {
	async getMyPets() {
		const response = await axiosInstance.get('my-pets');
		return response.data;
	},
	async updatePetsList(payload) {
		await axiosInstance.put('adoption', {pid: payload.pid});
		return payload.index;
	}
}

/*
 * The reducer does not allow side effects, such as asynchronous network requests.
 * So it's necessary to wrap the dispatch function, deal async processing first, and then execute the dispatch.
 * The code here is:
 * - function of async action must be in "asyncThunk"
 * - the same async action type in reducer must be start with "async/"
 * Note: DON'T add "async/" when dispatch async action
*/
const dispatchWrapper = (dispatch) => {
	return (action) => {
		if(Object.keys(asyncThunk).includes(action.type))
		{
			asyncThunk[action.type](action.payload)
				.then((v) => {
					dispatch({type: `async/${action.type}`, payload: v});
				});
		} else {
			dispatch(action);
		}
	}
}

//immerReducer
const reducer = (draft, action) => {
	switch (action.type) {
		case 'setAuthModal':
			draft.authModalOpen = action.payload;
			break;
		case 'setUnAdoptModal':
			draft.unAdoptModalOpen = action.payload;
			break;
		case 'async/getMyPets':
			if(action.payload.code && action.payload.code === 10310 ) {
				draft.authModalOpen = true;
			} else {
				draft.pets = action.payload;
			}
			break;
		case 'setSelectedPet':
			draft.selectedPet.pid = action.payload.pid;
			draft.selectedPet.index = action.payload.index;
			break;
		case 'async/updatePetsList':
			delete draft.pets[draft.selectedPet.index];
			break;
		default:
			throw new Error('Action type error!');
	}
};

const tableHead = [
	'type',
	'petname',
	'age',
	'describe',
	'',
];

const MyPets = (props) => {
	const [mpstate, dispatch] = useImmerReducer(reducer, initialState);

	const adpBtnHandler = (pid, index) => {
		dispatch({type:'setSelectedPet', payload:{pid, index}});
		dispatch({type:'setUnAdoptModal', payload:true});
	};

	useEffect(() => {
		//not under Context.Provider, so must use wrapper to deal dispatch
		dispatchWrapper(dispatch)({type:'getMyPets'});
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header
				title="My own pets list"
				subtitle="JWT token needed. Adopt pets in 'All Pets' route first."
			>
			</Header>
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
					<Col>
						<MyPetsContext.Provider value={{mpstate, dispatch:dispatchWrapper(dispatch)}}>
							<AuthModal 
								isOpen={mpstate.authModalOpen}
								toggle={() => {
									dispatch({type: 'setAuthModal', payload: !mpstate.authModalOpen});
								}}
								backdrop={false}
							/>
							<ComTable 
								title="My own pets"
								tableHead={tableHead}
								tbodyData={mpstate.pets}
								adpBtnHandler={adpBtnHandler}
								dark
								btnActive
							/>
							<UnAdoptModal 
								isOpen={mpstate.unAdoptModalOpen}
								toggle={() => {
									dispatch({type: 'setUnAdoptModal', payload: !mpstate.unAdoptModalOpen});
								}}
								backdrop="static"
								className="modal-dialog-centered"
							/>
						</MyPetsContext.Provider>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default MyPets;
