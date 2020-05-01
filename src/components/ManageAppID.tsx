import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Select,
  SelectItem,
  InlineLoading,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  DataTable,
  TableHeader,
  TableBody,
  TableCell,
  Search,
  DataTableSkeleton,
  SearchSkeleton,
} from "carbon-components-react";

export default function ManageAppID() {
  interface User {
    id: string;
    email: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState({ id: "", email: "" });
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loadingDescription, setLoadingDescription] = useState("...Loading");

  const handleSelectRole = ({ value }) => {
    setSelectedRole(value);
  };

  const handleSearchInputChange = ({ target }) => {
    setSearchInput(target.value);
  };

  const handleSubmit = async () => {
    const { id } = selectedUser;
    const role = selectedRole;
    setLoadingDescription("...Updating Role");
    clearUserSelection();

    try {
      await axios.put(`/api/appid/roles/${id}`, JSON.stringify({ role }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      alert("Error updating user role. Error: " + err);
    }
    setOpenModal(false);
  };

  const handleClickUser = (user) => {
    setLoadingDescription("...Loading Current Role");
    setSelectedUser(user);
    setOpenModal(true);
  };

  const getUsers = async () => {
    const { data: users } = await axios("/api/appid/users");
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
    setSelectedRole("");
    setUserRoles([]);
    setSelectedUser({ id: "", email: "" });
  };

  const closeModal = () => {
    setOpenModal(false);
    clearUserSelection();
  };

  const filterUsers = ([{ value: email }, { value: id }], str) => {
    str = str.toLowerCase();
    id = id.toLowerCase();
    email = email.toLowerCase();
    return email.includes(str) || id.includes(str);
  };

  useEffect(() => {
    if (selectedUser.id) getUserRoles();
  }, [selectedUser]);

  const newHeaderData = [
    {
      header: "Email",
      key: "email",
    },
    {
      header: "ID",
      key: "id",
    },
  ];

  return (
    <div className="container-wide">
      {users.length ? (
        <DataTable
          rows={users}
          headers={newHeaderData}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
          }) => (
            <TableContainer title="DataTable with expansion">
              <Search
                id="search-1"
                placeHolderText="Search users"
                labelText="search"
                type="search"
                data-testid="search-input"
                onChange={(e) => handleSearchInputChange(e)}
                value={searchInput}
              />

              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <React.Fragment key={row.id}>
                      {filterUsers(row.cells, searchInput) && (
                        <TableRow {...getRowProps({ row })}>
                          {row.cells.map((cell, idx) => {
                            return (
                              <TableCell
                                key={cell.id}
                                data-testid={`appid-email-${cell.value}`}
                                onClick={() => {
                                  handleClickUser({
                                    id: row.id,
                                    email: row.email,
                                  });
                                }}
                              >
                                {cell.value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      ) : (
        <div style={{ paddingTop: '0.125rem', overflowX: 'auto' }}>
          <br />
          <SearchSkeleton />
          <DataTableSkeleton
            compact={false}
            rowCount={10}
            columnCount={2}
            headers={[
              { key: "email" },
              { key: "id" },
            ]}
          />
        </div>
      )}

      <Modal
        open={openModal}
        onRequestClose={closeModal}
        modalHeading={`Assign roles to ${selectedUser.email}`}
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onSecondarySubmit={closeModal}
        onRequestSubmit={() => handleSubmit()}
      >
        <p style={{ color: "grey" }}>
          A user's role determines the actions that they're able to take within
          your app.
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
                <SelectItem
                  hidden
                  value="placeholder-item"
                  text={selectedRole || "none"}
                />
                {userRoles.map((role) => (
                  <SelectItem value={role} text={role} key={role} />
                ))}
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
