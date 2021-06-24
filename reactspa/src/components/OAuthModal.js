/*
 * This's for 3rt-party login(OAuth), bynow is still a blank modal
 * will add it soon
*/

import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from 'reactstrap';
import { useState } from 'react';

const OAuthModal = (props)=> {
	const [isOpen, setOpen] = useState(true);
	const toggle = () => setOpen(!isOpen);

	const doSth= () => {
		toggle();
	}
	const doCancle= () => {
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
				Login use third-party authing ...
			</ModalHeader>
			<ModalBody>
				{`${props.match.params.tp } is authing now.`}
				{`Auth code is ${props.match.params.code}.`}
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={doSth}>
					Yes
				</Button>
				<Button color="secondary" onClick={doCancle}>
					No
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default OAuthModal;
