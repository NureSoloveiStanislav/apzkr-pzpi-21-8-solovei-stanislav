import React, {FC, useEffect, useState} from 'react';
import './Cleaning.scss';
import Header from "../../../UIComponents/Header/Header";
import {TypeUser} from "../../../types/TypeUser";
import {TypeCleaning} from "../../../types/TypeCleaning";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
import {TypeService} from "../../../types/TypeService";
import {useLanguage} from "../../../LanguageContext";

type CleaningProps = {
  user: TypeUser,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
}

const Cleaning: FC<CleaningProps> = ({user, setShowLoginForm}) => {
  const {translate, setLanguage, language} = useLanguage();
  const [cleaning, setCleaning] = useState<TypeCleaning[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<TypeService[]>([]);

  useEffect(() => {
    fetchServicesData();
    fetchCleaningData();
    fetchUserData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services data: ', error);
    }
  }

  const fetchCleaningData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/cleaning');
      setCleaning(response.data);
    } catch (error) {
      console.error('Error fetching cleaning data: ', error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users data: ', error);
    }
  }

  const onClickDeleteCleaning = async (cleaningId: number) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/cleaning/${cleaningId}`);
      fetchCleaningData();
    } catch (error) {
      console.error('Error deleting cleaning data: ', error);
    }
  }

  return (
    <div id="Cleaning">
      <Header user={user} setShowLoginForm={setShowLoginForm}/>
      <h2>{translate("Cleaning")}</h2>
      <Table striped bordered hover>
        <thead>
        <tr>
          <th>id</th>
          <th>date</th>
          <th>time</th>
          <th>description</th>
          <th>user name</th>
          <th>user phone</th>
          <th>service name</th>
        </tr>
        </thead>
        <tbody>
        {
          cleaning.length > 0 && cleaning.map((cleaning: TypeCleaning, index: number) => (
            <tr key={index}>
              <td>{cleaning.id}</td>
              <td>{cleaning.date}</td>
              <td>{cleaning.time}</td>
              <td>{cleaning.description}</td>
              <td>{users.find(user => user?.id === cleaning.user_id)?.first_name}</td>
              <td>{users.find(user => user?.id === cleaning.user_id)?.phone_number}</td>
              <td>{services.find(service => service?.id === cleaning.service_id)?.name}</td>
              <td>
                <Button onClick={() => onClickDeleteCleaning(cleaning.id)} variant="danger">{translate("Delete")}</Button>
              </td>
            </tr>
          ))
        }
        </tbody>
      </Table>
    </div>
  );
};

export default Cleaning;