import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function ManageAppID() {
  const [users, setUsers] = useState([{ id: '', email: '' }]);

  const getUsers = async () => {
    const { data } = await axios('/api/appid/users');
    setUsers(data.users);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>Users
      {users.map(({ id, email }) => <div key={id}>email: {email} id {id}</div>)}
    </div>
  );
}