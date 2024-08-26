import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import './Materials.scss'
import {TypeUser} from "../../../types/TypeUser";
import Header from "../../../UIComponents/Header/Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CustomInput from "../../../UIComponents/CustomInput/CustomInput";
import Table from "react-bootstrap/Table";
import axios from "axios";
import {TypeService} from "../../../types/TypeService";
import Form from 'react-bootstrap/Form';
import {useLanguage} from "../../../LanguageContext";

type MaterialsProps = {
  user: TypeUser,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
}

type TypeMaterial = {
  id: number;
  name: string;
  quantity: number;
  service_id: number;
}

type TypeNewMaterial = {
  name: string;
  quantity: number;
}

const Materials: FC<MaterialsProps> = ({user, setShowLoginForm}) => {
  const {translate, setLanguage, language} = useLanguage();
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [materials, setMaterials] = useState<TypeMaterial[]>([]);
  const [services, setServices] = useState<TypeService[]>([]);
  const [newMaterial, setNewMaterial] = useState<TypeNewMaterial>({
    name: '',
    quantity: 0,
  });
  const [selectedService, setSelectedService] = useState<number | null>(null);

  useEffect(() => {
    fetchMaterialsData();
    fetchServicesData();
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedService(selectedId);
  };

  const fetchMaterialsData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials data: ', error);
    }
  }

  const handleClose = () => {
    setShowModalForm(false)
  }

  const fetchServicesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services data: ', error);
    }
  }

  const onClickAddMaterials = async () => {
    setShowModalForm(true);
    await fetchServicesData();
  }

  const onClickDeleteMaterial = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/materials/${id}`);
      fetchMaterialsData();
    } catch (error) {
      console.error('Error deleting materials data: ', error);
    }
  }

  const addNewMaterial = async (newMaterial: TypeNewMaterial) => {
    try {
      const data = {...newMaterial, service_id: selectedService}
      const response = await axios.post('http://localhost:5000/api/v1/materials', data);

      if (response.status === 200) {
        alert('Successful');
        fetchMaterialsData();
        handleClose();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const onSubmitMaterialForm = (event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => {
    event.preventDefault();

    addNewMaterial(newMaterial);
  }

  return (
    <div id="Materials">
      <Header user={user} setShowLoginForm={setShowLoginForm}/>
      <Modal show={showModalForm} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{translate("AddMaterials")}</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitMaterialForm}>
          <Modal.Body className="users__modal-body">
            <CustomInput type="text" name="name" maxLength={45}
                         isValid={(newMaterial.name.length > 3)} label={translate("MaterialName")}
                         setState={setNewMaterial} state={newMaterial.name}/>
            <CustomInput type="number" name="quantity"
                         isValid={newMaterial.quantity > 0} label={''}
                         setState={setNewMaterial} state={newMaterial.quantity}/>
            <Form.Select value={selectedService ?? ''} onChange={handleSelectChange}>
              <option value="" disabled>{translate("SelectService")}</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
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
      <div className="materials">
        <h2>{translate("Materials")}</h2>
        <Button onClick={() => onClickAddMaterials()} variant="primary">{translate("AddMaterials")}</Button>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>id</th>
            <th>material</th>
            <th>quantity</th>
            <th>service name</th>
          </tr>
          </thead>
          <tbody>
          {
            materials.length > 0 && materials.map((material: TypeMaterial, index: number) => (
              <tr className="user-table__item" key={index}>
                <td>{material.id}</td>
                <td>{material.name}</td>
                <td>{material.quantity}</td>
                <td>{services.find(service => service.id === material.service_id)?.name}</td>
                <td>
                  <Button onClick={() => onClickDeleteMaterial(material.id)} variant="danger">{translate("Delete")}</Button>
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

export default Materials;