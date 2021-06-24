/*
 * A modal popup to unadopt a pet from 'MyPets'
*/

import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from 'reactstrap';
import { useContext } from 'react';
import MyPetsContext from '../utilities/contextManager';

const UnAdoptModal = (props) => {
	const {toggle, ...passProps} = props;
	const { mpstate, dispatch } = useContext(MyPetsContext);
	const { pid, index } = mpstate.selectedPet;
	
	const doUnAdopt = (pid, index) => {
		dispatch({type:'updatePetsList', payload:{pid, index}});
		dispatch({type:'setUnAdoptModal', payload:false})
	};

	return (
		<Modal toggle={toggle} {...passProps}>
			<ModalHeader toggle={props.toggle}>
				Unadopt pet
			</ModalHeader>
			<ModalBody>
				Are you really sure to unadopt this pet?
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={() => {doUnAdopt(pid, index)}}>
					Unadopt
				</Button>
				<Button color="secondary" onClick={toggle}>
					Cancel	
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default UnAdoptModal;
