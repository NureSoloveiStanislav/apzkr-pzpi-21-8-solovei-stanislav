import React, {FC, useEffect, useState} from 'react';
import './Users.scss';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CustomInput from "../../../UIComponents/CustomInput/CustomInput";
import {TypeUser} from "../../../types/TypeUser";
import Header from "../../../UIComponents/Header/Header";
import {useLanguage} from "../../../LanguageContext";

type Props = {
  user: TypeUser,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
}

type userProps = {
  id: number;
  login: string;
  phone_number: string;
  first_name: string;
  is_admin: boolean;
}

type newUserProps = {
  login: string;
  password: string;
  phone_number: string;
  first_name: string;
  is_admin: any;
};

const Users: FC<Props> = ({user, setShowLoginForm}) => {
  const {translate, setLanguage, language} = useLanguage();
  const [usersArray, setUsersArray] = useState<userProps[]>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<newUserProps>({
    login: '',
    password: '',
    phone_number: '',
    first_name: '',
    is_admin: 0,
  });

  const fetchUsersArrayData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users');
      setUsersArray(response.data);
    } catch (error) {
      console.error('Error fetching users data: ', error);
    }
  };

  useEffect(() => {
    fetchUsersArrayData();
  }, []);

  const onClickDeleteUser = async (userId: number) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/users/${userId}`);
      fetchUsersArrayData();
    } catch (error) {
      console.error('Error deleting user data: ', error);
    }
  }

  const onClickAddUser = () => {
    setShowModalForm(true);
  }

  const addNewUser = async (user: newUserProps) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users', user);

      if (response.status === 200) {
        alert('Successful');
        fetchUsersArrayData();
        handleClose();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const onSubmitAddUserForm = (event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => {
    event.preventDefault();
    addNewUser(newUser);
  }

  const handleClose = () => {
    setShowModalForm(false)
  }

  return (
    <div id="Users">
      <Header user={user} setShowLoginForm={setShowLoginForm}/>
      <Modal show={showModalForm} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{translate("AddUser")}</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitAddUserForm}>
          <Modal.Body className="users__modal-body">
            <CustomInput customClassName="user-input" type="text" name="login"
                         isValid={(newUser.login.length > 3)} label={translate("LoginUser")}
                         setState={setNewUser} state={newUser.login}/>
            <CustomInput customClassName="user-input" type="text" name="first_name"
                         isValid={(newUser.first_name.length > 3)} label={translate("FirstName")}
                         setState={setNewUser} state={newUser.first_name}/>
            <CustomInput customClassName="user-input" type="text" name="phone_number"
                         isValid={(newUser.phone_number.length > 5)} label={translate("PhoneNumber")}
                         setState={setNewUser} state={newUser.phone_number}/>
            <CustomInput customClassName="user-input" type="password" name="password"
                         isValid={(newUser.password.length > 3)} label={translate("Password")}
                         setState={setNewUser} state={newUser.password}/>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={newUser.is_admin}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  setNewUser({
                    ...newUser,
                    is_admin: event.target.checked,
                  });
                }}
              />
              <p>Is admin? </p>
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {translate("Close")}
            </Button>
            <Button variant="primary" type={"submit"}>
              {translate("SaveChanges")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="users">
        <h2>{translate("Users")}</h2>
        <Button onClick={() => onClickAddUser()} variant="primary">{translate("AddUser")}</Button>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>id</th>
            <th>login</th>
            <th>phone number</th>
            <th>first name</th>
            <th>is admin?</th>
          </tr>
          </thead>
          <tbody>
          {
            usersArray.length > 0 && usersArray.map((user: userProps, index: number) => (
              <tr className="user-table__item" key={index}>
                <td>{user?.id}</td>
                <td>{user?.login}</td>
                <td>{user?.phone_number}</td>
                <td>{user?.first_name}</td>
                <td>{user?.is_admin}</td>
                <td>
                  <Button onClick={() => onClickDeleteUser(user.id)} variant="danger">{translate("Delete")}</Button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;