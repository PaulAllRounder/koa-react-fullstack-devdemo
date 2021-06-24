/*
 * A modal popup for register account success
*/

import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { signIn } from '../redux/accountReducer';
import { useHistory } from 'react-router-dom';

const SuccessModal = ({ isOpen, toggle, username, password }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const loginNow = () => {
		dispatch(signIn({ username, password, isReload: false }));
		toggle();
		history.push('/main');
	}
	const notNow = () => {
		toggle();
		window.location.reload();
	}

	return (
		<Modal
			isOpen={isOpen}
			toggle={toggle}
			backdrop={false}
		>
			<ModalHeader
				close={<div></div>}
			>
				Registered a new account successfully!
			</ModalHeader>
			<ModalBody>
				Login with this account {' '}
				<span className="text-success font-weight-700">{username}</span>
				{' ?'}
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={loginNow}>
					Yes
				</Button>
				<Button color="secondary" onClick={notNow}>
					Not now
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default SuccessModal;
