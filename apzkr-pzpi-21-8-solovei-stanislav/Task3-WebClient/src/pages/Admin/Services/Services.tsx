import React, {FC, useEffect, useState} from 'react';
import './Services.scss';
import {TypeUser} from "../../../types/TypeUser";
import Header from "../../../UIComponents/Header/Header";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import CustomInput from "../../../UIComponents/CustomInput/CustomInput";
import axios from "axios";
import {TypeService} from "../../../types/TypeService";
import {useLanguage} from "../../../LanguageContext";

type ServicesProps = {
  user: TypeUser,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
}

type TypeNewService = {
  name: string,
  description: string,
  price: number,
}

const Services: FC<ServicesProps> = ({user, setShowLoginForm}) => {
  const {translate, setLanguage, language} = useLanguage();
  const [services, setServices] = useState<TypeService[]>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [newService, setNewService] = useState<TypeNewService>({
    name: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    fetchServicesData();
  }, []);

  const clearForm = (): void => {
    setNewService({
      name: '',
      description: '',
      price: 0,
    });
  }

  const fetchServicesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services data: ', error);
    }
  }

  const onClickDeleteService = async (serviceId: number) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/services/${serviceId}`);
      fetchServicesData();
    } catch (error) {
      console.error('Error deleting service data: ', error);
    }
  }

  const onClickAddMaterial = (): void => {
    setShowModalForm(true);
  }

  const handleClose = (): void => {
    setShowModalForm(false);
  }

  const addNewService = async (newService: TypeNewService) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/services', newService);

      if (response.status === 200) {
        alert('Successful');
        fetchServicesData();
        handleClose();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const onSubmitServiceForm = (event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => {
    event.preventDefault();

    addNewService(newService);
    clearForm();
  }

  return (
    <div id="Services">
      <Header user={user} setShowLoginForm={setShowLoginForm}/>
      <Modal show={showModalForm} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{translate("AddServices")}</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitServiceForm}>
          <Modal.Body className="users__modal-body">
            <CustomInput type="text" name="name" maxLength={45}
                         isValid={(newService.name.length > 3)} label={translate("ServiceName")}
                         setState={setNewService} state={newService.name}/>
            <CustomInput type="text" name="description" maxLength={250}
                         isValid={(newService.description.length > 3)} label={translate("ServiceDescription")}
                         setState={setNewService} state={newService.description}/>
            <CustomInput type="number" name="price"
                         isValid={newService.price > 0} label={''}
                         setState={setNewService} state={newService.price}/>
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
      <div className="services">
        <h2>{translate("Services")}</h2>
        <Button onClick={() => onClickAddMaterial()} variant="primary">{translate("AddServices")}</Button>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>description</th>
            <th>price</th>
          </tr>
          </thead>
          <tbody>
          {
            services.length > 0 && services.map((service: TypeService, index: number) => (
              <tr className="user-table__item" key={index}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{service.price}</td>
                <td>
                  <Button onClick={() => onClickDeleteService(service.id)} variant="danger">{translate("Delete")}</Button>
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

export default Services;