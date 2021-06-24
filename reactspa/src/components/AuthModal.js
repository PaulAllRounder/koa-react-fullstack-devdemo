/*
 * A modal popup when need login to access
 * Because login page set a fancy rule for password,
 * so provide a way to use Paul's account login directly :->
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

const AuthModal = ({ isOpen, toggle }) => {
	const dispatch = useDispatch();
	const paulLogin = () => {
		dispatch(signIn({
			username: 'Paul',
			password: '123456'
		}));
		toggle();
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
				You need to login to access!
			</ModalHeader>
			<ModalBody>
				<p>
					Click to <a className="ml-2" href="/auth/login">Login</a>
				</p>
				<p>
					No account? <a className="ml-2" href="/auth/register">Create a new one</a>
				</p>
				Or simply login use 
				<Button 
					outline 
					color="primary" 
					size="sm" 
					className="ml-2"
					onClick={paulLogin}
				>Paul's accout</Button>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" onClick={toggle}>
					Not now
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default AuthModal;
