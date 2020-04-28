import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
	StructuredListCell,
	StructuredListBody,
	StructuredListHead,
	StructuredListRow,
	StructuredListWrapper,
	Modal,
	SelectItem,
	Select
} from 'carbon-components-react';

export default function ManageAppID() {
	const [ users, setUsers ] = useState([ { id: '', email: '' } ]);
	const [ openModal, setOpenModal ] = useState(false);

	const [ selectedUser, setSelectedUser ] = useState({ id: '', email: '' });
	const [ userRoles, setUserRoles ] = useState([]);
	const [ selectedRole, setSelectedRole ] = useState('');

	const handleSelectRole = ({ value }) => {
		setSelectedRole(value);
	};

	const handleSubmit = async () => {
		await axios.put(`/api/appid/roles/${selectedUser.id}`, JSON.stringify({ roles: { names: [ selectedRole ] } }), {
			headers: { 'Content-Type': 'application/json' }
		});
		setOpenModal(false);
	};

	const handleClickUser = (user) => {
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
		const { data: roles } = await axios(`/api/appid/roles/${selectedUser.id}`);
		setSelectedRole(roles[0]);
		setUserRoles(roles);
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
					{users.map(({ id, email }, idx) => (
						<StructuredListRow tabIndex={0} key={id}>
							<StructuredListCell>
								<a
									href="#"
									data-testid={`appid-email-${idx}`}
									onClick={() => handleClickUser({ id, email })}
								>
									{email}
								</a>
							</StructuredListCell>
							<StructuredListCell>{id}</StructuredListCell>
						</StructuredListRow>
					))}
				</StructuredListBody>
			</StructuredListWrapper>
			<Modal
				open={openModal}
				onRequestClose={() => setOpenModal(false)}
				modalHeading={`Assign roles to ${selectedUser.email}`}
				primaryButtonText="Submit"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setOpenModal(false)}
				onRequestSubmit={() => handleSubmit()}
			>
				<p>A user's role determines the actions that they're able to take within your app.</p>
				<Select
					id="select-1"
					value={selectedRole}
					labelText={`Assign roles to ${selectedUser.email}`}
					onChange={({ target }) => handleSelectRole(target)}
				>
					<SelectItem hidden value="placeholder-item" text="Select Roles" />
					{userRoles.map(({ name }) => <SelectItem value={name} text={name} key={name} />)}
				</Select>
			</Modal>
		</div>
	);
}
