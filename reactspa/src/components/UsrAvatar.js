/*
 * Use redux global data to show username && avatar
*/

import {
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/accountReducer';

const PURL = process.env.PUBLIC_URL;
const UsrAvatar = (props) => {
	const avatar = useSelector((state) => state.account.avatar);
	const username = useSelector((state) => state.account.username);
	const dispatch = useDispatch();

	return (
		<UncontrolledDropdown nav>
			<DropdownToggle nav>
				<Media className="align-items-center">
					<span className="avatar avatar-sm rounded-circle">
						<img
							alt="..."
							src= { avatar === null? `${PURL}/img/no-login.png` : avatar }
						/>
					</span>
					<Media className="ml-2 d-none d-lg-block">
						<span className="mb-0 text-sm font-weight-bold">
							{username === null? 'Login now': username}
						</span>
					</Media>
				</Media>
			</DropdownToggle>
			<DropdownMenu className="dropdown-menu-arrow" right>
				{username !== null ?
					<>
						<DropdownItem className="noti-title" header tag="div">
							<h6 className="text-overflow m-0">Welcome!</h6>
						</DropdownItem>
						<DropdownItem to="/main/user-profile" tag={Link}>
							<i className="ni ni-single-02" />
							<span>My profile</span>
						</DropdownItem>
						<DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
							<i className="ni ni-settings-gear-65" />
							<span>Settings</span>
						</DropdownItem>
						<DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
							<i className="ni ni-calendar-grid-58" />
							<span>Activity</span>
						</DropdownItem>
						<DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
							<i className="ni ni-support-16" />
							<span>Support</span>
						</DropdownItem>
						<DropdownItem divider />
						<DropdownItem href="#pablo" onClick={() => dispatch(signOut())}>
							<i className="ni ni-user-run" />
							<span>Logout</span>
						</DropdownItem>
					</>
					:
					<>
						<DropdownItem to="/auth/login" tag={Link}>
							<i className="ni ni-circle-08" />
							<span>Login</span>
						</DropdownItem>
						<DropdownItem divider />
						<DropdownItem to="/auth/register" tag={Link}>
							<i className="ni ni-paper-diploma" />
							<span>Create account</span>
						</DropdownItem>
					</>
				}
			</DropdownMenu>
		</UncontrolledDropdown>
	);
} 

export default UsrAvatar;
