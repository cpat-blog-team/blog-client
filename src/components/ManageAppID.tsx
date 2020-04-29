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
	SelectItem
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
		try {
			await axios.put(`/api/appid/roles/${selectedUser.id}`, JSON.stringify({ role: selectedRole }), {
				headers: { 'Content-Type': 'application/json' }
			});
		} catch (err) {
			console.error(err);
		}
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
		const { data } = await axios(`/api/appid/roles/${selectedUser.id}`);
		const { roles, activeRole } = data;
		setSelectedRole(activeRole);
		setUserRoles(roles);
	};

	const closeModal = () => {
		setOpenModal(false);
		setSelectedRole('');
		setUserRoles([]);
		setSelectedUser({ id: '', email: '' });
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
				{userRoles.length ? (
					<div>
						<div>
							<Select
								id="select-1"
								value={selectedRole}
								labelText="Current Role"
								onChange={({ target }) => handleSelectRole(target)}
							>
								<SelectItem hidden value="placeholder-item" text={selectedRole} />
								{userRoles.map((role) => <SelectItem value={role} text={role} key={role} />)}
							</Select>
						</div>
					</div>
				) : (
					<div>...loading</div>
				)}
			</Modal>
		</div>
	);
}
