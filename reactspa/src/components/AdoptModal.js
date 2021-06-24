/*
 * A nested modal for adopt pet
*/

import {useState} from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Table,
} from 'reactstrap';
import axiosInstance from '../utilities/myAxios';
import { useDispatch } from 'react-redux';
import { updatePetsList } from '../redux/plistReducer';

const AdpModal = (props) => {
	const [nestOpen, setNestOpen] = useState(false);
	const [adpResult, setAdpResult] = useState(null);
	const {toggle, petInfo, ...passProps} = props;
	const fields = ['type', 'age', 'petname', 'describe'];

	const toggleNest = () => setNestOpen(false);

	const dispatch = useDispatch();
	const doAdopt = async (pid, index) => {
		const response = await axiosInstance.put('adoption', {pid});
		if(response.data.code && response.data.code === 12202){
			//This pet have been adopted by others
			setAdpResult(false);
		} else {
			setAdpResult(true);
		}
		dispatch(updatePetsList({pid, index}));
		setNestOpen(true);
	};

	return (
		<Modal toggle={toggle} {...passProps}>
			<ModalHeader toggle={props.toggle}>
				Pet detail info
			</ModalHeader>
			<ModalBody>
				<Table className="align-items-center table-flush" >
					<tbody>
						{
							fields.map((t, n) =>{return (
								<tr key={`adtModal${n}`}>
									<th scop="row">{t.toUpperCase()}</th>
									<td>{petInfo[t]}</td>
								</tr>
							);})
						}
					</tbody>
				</Table>
			</ModalBody>

			{/*Nested modal*/}
			<Modal 
				className="modal-dialog-centered"
				isOpen={nestOpen} 
				toggle={toggleNest} 
				backdrop={false}
				onClosed={toggle}
			>
				<ModalHeader>{
					adpResult=== null ? '' :
						adpResult ? 'Congratulations!' : 'Adoption failed!'
				}</ModalHeader>
				<ModalBody>{
					adpResult=== null ? '' :
						adpResult ? 'You adopt this pet sucessfully!' : 'This pet has been adopted by someone else, be faster next time!'
				}</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={toggleNest}>
						Close
					</Button>
				</ModalFooter>
			</Modal>

			<ModalFooter>
				<Button color="primary" onClick={() => {doAdopt(petInfo.id, petInfo.index)}}>
					Adopt
				</Button>
				<Button color="secondary" onClick={toggle}>
					Cancel	
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default AdpModal;
