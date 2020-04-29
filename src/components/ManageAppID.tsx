import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	StructuredListCell,
	StructuredListBody,
	StructuredListHead,
	StructuredListRow,
	StructuredListWrapper,
	Modal,
	Select,
	SelectItem,
	Loading,
	InlineLoading
} from 'carbon-components-react';

export default function ManageAppID() {
	interface User {
		id: string;
		email: string;
	}
	const [ users, setUsers ] = useState<User[]>([]);
	const [ openModal, setOpenModal ] = useState(false);

	const [ selectedUser, setSelectedUser ] = useState({ id: '', email: '' });
	const [ userRoles, setUserRoles ] = useState([]);
	const [ selectedRole, setSelectedRole ] = useState('');

	const [ loadingDescription, setLoadingDescription ] = useState('...Loading');

	const handleSelectRole = ({ value }) => {
		setSelectedRole(value);
	};

	const handleSubmit = async () => {
		const { id } = selectedUser;
		const role = selectedRole;
		setLoadingDescription('...Updating Role');
		clearUserSelection();

		try {
			await axios.put(`/api/appid/roles/${id}`, JSON.stringify({ role }), {
				headers: { 'Content-Type': 'application/json' }
			});
		} catch (err) {
			alert('Error updating user role. Error: ' + err);
		}
		setOpenModal(false);
	};

	const handleClickUser = (user) => {
		setLoadingDescription('...Loading Current Role');
		setSelectedUser(user);
		setOpenModal(true);
	};

	const getUsers = async () => {
		const { data: users } = await axios('/api/appid/users');
		setUsers(users);
	};

	useEffect(() => {
		getUsers();
	}, []);

	const getUserRoles = async () => {
		const { data } = await axios(`/api/appid/roles/${selectedUser.id}`);
		const { roles, activeRole } = data;
		setSelectedRole(activeRole);
		setUserRoles(roles);
	};

	const clearUserSelection = () => {
		setSelectedRole('');
		setUserRoles([]);
		setSelectedUser({ id: '', email: '' });
	};

	const closeModal = () => {
		setOpenModal(false);
		clearUserSelection();
	};

	useEffect(
		() => {
			if (selectedUser.id) getUserRoles();
		},
		[ selectedUser ]
	);

	return (
		<div>
			<StructuredListWrapper ariaLabel="Structured list">
				<StructuredListHead>
					<StructuredListRow head tabIndex={0}>
						<StructuredListCell head>Email</StructuredListCell>
						<StructuredListCell head>ID</StructuredListCell>
					</StructuredListRow>
				</StructuredListHead>
				<StructuredListBody>
					{users.length ? (
						users.map(({ id, email }) => (
							<StructuredListRow tabIndex={0} key={id}>
								<StructuredListCell>
									<a
										href="#"
										data-testid={`appid-email-${email}`}
										onClick={() => handleClickUser({ id, email })}
									>
										{email}
									</a>
								</StructuredListCell>
								<StructuredListCell>{id}</StructuredListCell>
							</StructuredListRow>
						))
					) : (
						<Loading description="Active loading indicator" withOverlay={true} />
					)}
				</StructuredListBody>
			</StructuredListWrapper>
			<Modal
				open={openModal}
				onRequestClose={closeModal}
				modalHeading={`Assign roles to ${selectedUser.email}`}
				primaryButtonText="Submit"
				secondaryButtonText="Cancel"
				onSecondarySubmit={closeModal}
				onRequestSubmit={() => handleSubmit()}
			>
				<p style={{ color: 'grey' }}>
					A user's role determines the actions that they're able to take within your app.
				</p>
				<br />
				<div>
					<div>
						{userRoles.length ? (
							<Select
								id="select-1"
								value={selectedRole}
								labelText="Current Role"
								onChange={({ target }) => handleSelectRole(target)}
							>
								<SelectItem hidden value="placeholder-item" text={selectedRole || 'none'} />
								{userRoles.map((role) => <SelectItem value={role} text={role} key={role} />)}
							</Select>
						) : (
							<InlineLoading description={loadingDescription} />
						)}
					</div>
				</div>
			</Modal>
		</div>
	);
}
