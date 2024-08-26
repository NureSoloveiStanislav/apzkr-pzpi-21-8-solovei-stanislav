import React, {FC, useEffect} from 'react';
import './Header.scss';
import Logo from "../../img/Logo.svg";
import {LanguageProvider, useLanguage} from '../../LanguageContext';
import {TypeUser} from "../../types/TypeUser";
import Dropdown from 'react-bootstrap/Dropdown';
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

type HeaderProps = {
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
  user: TypeUser,
  customClassName?: string,
}

const Header: FC<HeaderProps> = ({user, setShowLoginForm, customClassName}) => {
  const {translate, setLanguage, language} = useLanguage();
  const navigate = useNavigate();

  const changeLanguage = (): void => {
    if (language === 'en') setLanguage('ua');
    else setLanguage('en');
  }

  return (
    <header className={customClassName}>
      <nav>
        <ul>
          <li>
            <img onClick={() => navigate('/')} className="logo" src={Logo} alt="Logotype"/>
          </li>
          {
            user?.isAdmin && (
              <li>
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="dropdown-basic">
                    {translate("AdminPanel")}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/admin/users")}>{translate("Users")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/admin/services")}>{translate("Services")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/admin/cleaning")}>{translate("Cleaning")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/admin/materials")}>{translate("Materials")}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )
          }
          <li></li>
          <li>
            <Button variant="secondary" onClick={() => changeLanguage()}>
              {language}
            </Button>
          </li>
          <li>
            {
              user ? (
                <h5 style={{color: "white"}}>{translate('Welcome')}: {user.firstName}</h5>
              ) : (
                <Button variant="primary" onClick={() => setShowLoginForm(true)}>
                  {translate('login')}
                </Button>
              )
            }
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;