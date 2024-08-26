import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import './Home.scss';
import LoginForm from "../../UIComponents/LoginForm/LoginForm";
import Header from "../../UIComponents/Header/Header";
import axios from "axios";
import {TypeUser} from "../../types/TypeUser";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CustomInput from "../../UIComponents/CustomInput/CustomInput";
import Form from "react-bootstrap/Form";
import {TypeService} from "../../types/TypeService";
import jsPDF from 'jspdf';
// @ts-ignore
import RobotoRegular from '../../fonts/Roboto-Regular.ttf';
import {useLanguage} from "../../LanguageContext";

type TypeHome = {
  user: TypeUser,
  showLoginForm: any,
  setUser: any,
  setShowLoginForm: any,
}

type TypeNewCleaning = {
  date: string;
  time: string;
  description: string;
  user_id: number;
  service_id: number;
}

const Home: FC<TypeHome> = ({user, setShowLoginForm, showLoginForm, setUser}) => {
  const {translate, setLanguage, language} = useLanguage();
  const [services, setServices] = useState<TypeService[]>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [newCleaning, setNewCleaning] = useState<TypeNewCleaning>({
    date: '',
    time: '',
    description: '',
    user_id: user?.id ? user?.id : 0,
    service_id: 0,
  });
  const [selectedService, setSelectedService] = useState<number | null>(null);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const addNewCleaning = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/cleaning', data);

      if (response.status === 200) {
        handleClose();
        clearForm();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const fetchServicesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services data: ', error);
    }
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedService(selectedId);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setNewCleaning({...newCleaning, [name]: value});
  };

  const onClickBookCleaning = () => {
    if (!user?.id) {
      setShowLoginForm(true);
      return
    }

    setShowModalForm(true);
    fetchServicesData();
  }

  const handleClose = (): void => {
    setShowModalForm(false);
  }

  const clearForm = (): void => {
    setNewCleaning({
      date: '',
      time: '',
      description: '',
      user_id: user?.id ? user?.id : 0,
      service_id: 0,
    });
  }

  const saveCheck = (): void => {
    const doc = new jsPDF();
    doc.addFont(RobotoRegular, 'Roboto', 'normal');
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(20);
    doc.text("ВІТАЮ, ЦЕ ВАШ ЕЛЕКТРОНИЙ ЧЕК!", 10, 10);
    doc.setFontSize(16);
    doc.text(`Дата запису: ${newCleaning.date}. Час: ${newCleaning.time}`, 10, 20);
    doc.text(`Обрана послуга: ${services.find(service => service.id === selectedService)?.name}`, 10, 30);
    doc.text(`Коментар: ${newCleaning.description}`, 10, 40);
    doc.text(`Отримувач послуги: ${user?.firstName}`, 10, 50);
    doc.setFontSize(20);
    doc.text(`До сплати: ${services.find(service => service.id === selectedService)?.price} UAH`, 10, 60);
    doc.save("check.pdf");
  }

  const onSubmitBookCleaningForm = (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    event.preventDefault();

    const data = {
      ...newCleaning,
      user_id: user?.id,
      service_id: selectedService,
    }

    saveCheck();
    addNewCleaning(data);
  }

  return (
    <div id="Home">
      {showLoginForm && (<LoginForm setUser={setUser} setShowLoginForm={setShowLoginForm}/>)}
      <Header user={user} setShowLoginForm={setShowLoginForm}/>
      <Modal show={showModalForm} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{translate("BookCleaning")}</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitBookCleaningForm}>
          <Modal.Body className="users__modal-body">
            <input
              type="date"
              name="date"
              value={newCleaning.date}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="time"
              value={newCleaning.time}
              onChange={handleInputChange}
            />
            <CustomInput type="text" name="description" maxLength={450}
                         isValid={(newCleaning.description.length > 3)} label={translate("Description")}
                         setState={setNewCleaning} state={newCleaning.description}/>
            <Form.Select value={selectedService ?? ''} onChange={handleSelectChange}>
              <option value="" disabled>{translate("SelectService")}</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
            {
              selectedService && (
                <h4>{translate("Price")}: {services.find(service => service.id === selectedService)?.price} UAH</h4>
              )
            }
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
      <main>
        <Button size={"lg"} onClick={() => onClickBookCleaning()} variant="primary">{translate("BookCleaning")}</Button>
      </main>
    </div>
  );
};

export default Home;