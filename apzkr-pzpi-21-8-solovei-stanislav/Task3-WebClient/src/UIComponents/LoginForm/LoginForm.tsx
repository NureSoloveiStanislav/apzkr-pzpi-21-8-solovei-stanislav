import React, {FC, useEffect, useState} from 'react';
import './LoginForm.scss';
import CustomInput from "../CustomInput/CustomInput";
import axios from "axios";
import User from "../../classes/User";
import {TypeUser} from "../../types/TypeUser";

type LoginFormProps = {
  setShowLoginForm: any,
  setUser: React.Dispatch<React.SetStateAction<TypeUser | null>>,
}

type TypeErrorLoginForm = {
  login: boolean,
  password: boolean,
}

type TypeLoginFormData = {
  login: string,
  password: string,
}

type TypeRegisterFormData = {
  firstName: string,
  phone: string,
  login: string,
  password: string,
  password2: string,
}

type TypeErrorRegisterForm = {
  firstName: boolean,
  phone: boolean,
  login: boolean,
  password: boolean,
  password2: boolean,
}

const LoginForm: FC<LoginFormProps> = ({setShowLoginForm, setUser}) => {
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);

  const [loginFormData, setLoginFormData] = useState<TypeLoginFormData>({
    login: '',
    password: '',
  });

  const [errorLoginForm, setErrorLoginForm] = useState<TypeErrorLoginForm>({
    login: true,
    password: true,
  });

  const [registerFormData, setRegisterFormData] = useState<TypeRegisterFormData>({
    firstName: '',
    phone: '',
    login: '',
    password: '',
    password2: '',
  });

  const [errorRegisterForm, setErrorRegisterForm] = useState<TypeErrorRegisterForm>({
    firstName: true,
    phone: true,
    login: true,
    password: true,
    password2: true,
  });

  const validateLogin: RegExp = /^[a-zA-Z0-9]+$/;
  const validatePassword: RegExp = /^[a-zA-Z0-9]+$/;

  useEffect(() => {
    if (loginFormData.login.length > 5 && validateLogin.test(loginFormData.login)) {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        login: false,
      }));
    } else {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        login: true,
      }));
    }
  }, [loginFormData.login]);

  useEffect(() => {
    if (validatePassword.test(loginFormData.password)) {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        password: false,
      }));
    } else {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        password: true,
      }));
    }
  }, [loginFormData.password]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as unknown as EventListener);

    return () => {
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.code === 'Escape') {
      setShowLoginForm(false);
    } else if (event.code === 'Enter') {
      showRegisterForm ? register() : login();
    }
  };

  const validateLoginForm = (): boolean => {
    return Object.values(errorLoginForm).every(value => !value);
  }

  const clearLoginForm = () => {
    setLoginFormData({
      login: '',
      password: '',
    });
  };

  const login = async () => {
    if (validateLoginForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/login', {
          login: loginFormData.login,
          password: loginFormData.password,
        });

        if (response.status === 200) {
          const {id, login, firstName, phone, isAdmin} = response.data;

          setUser({id, login, firstName, phone, isAdmin});
          sessionStorage.setItem('user', JSON.stringify({id, login, firstName, phone, isAdmin}));

          setShowLoginForm(false);
          clearLoginForm();
        }
      } catch (error) {
        console.error('Error submitting the login form: ', error);
      }
    }
  }

  const onSubmitLoginForm = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    login();
  };

  useEffect(() => {
    if (registerFormData.login.length > 5 && validateLogin.test(registerFormData.login)) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        login: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        login: true,
      }));
    }
  }, [registerFormData.login]);

  useEffect(() => {
    if (registerFormData.firstName.length > 1) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        firstName: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        firstName: true,
      }));
    }
  }, [registerFormData.firstName]);

  useEffect(() => {
    if (registerFormData.phone.length > 5) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        phone: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        phone: true,
      }));
    }
  }, [registerFormData.phone]);

  useEffect(() => {
    if (validatePassword.test(registerFormData.password)) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password: true,
      }));
    }
  }, [registerFormData.password]);

  useEffect(() => {
    if (validatePassword.test(registerFormData.password2) && registerFormData.password2 === registerFormData.password) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password2: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password2: true,
      }));
    }
  }, [registerFormData.password2, registerFormData.password]);

  const validateRegisterFields = (): boolean => {
    return Object.values(errorRegisterForm).every(value => !value);
  }

  const clearRegisterForm = () => {
    setRegisterFormData({
      login: '',
      firstName: '',
      phone: '',
      password: '',
      password2: '',
    });
  };

  const register = async () => {
    if (validateRegisterFields()) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/register', {
          login: registerFormData.login,
          firstName: registerFormData.firstName,
          phone: registerFormData.phone,
          password: registerFormData.password,
        });

        if (response.status === 200) {
          const user = {
            id: response.data.id,
            login: registerFormData.login,
            firstName: registerFormData.firstName,
            phone: registerFormData.phone,
            isAdmin: false,
          };

          setUser(user);
          sessionStorage.setItem('user', JSON.stringify(user));
          setShowLoginForm(false);
          clearRegisterForm();
        }
      } catch (error) {
        console.error('Error submitting the registration form: ', error);
      }
    }
  }

  const onSubmitRegisterForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    register();
  }

  return (
    <div id='LoginForm' onClick={() => setShowLoginForm(false)}>
      {
        showRegisterForm ? (
          <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => onSubmitRegisterForm(event)}
                onClick={(event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => event.stopPropagation()}>
            <CustomInput type="text" name="firstName" isValid={!errorRegisterForm.firstName} label={'First Name'}
                         setState={setRegisterFormData} state={registerFormData.firstName}/>
            <CustomInput type="text" name="login" isValid={!errorRegisterForm.login} label={'Login'}
                         setState={setRegisterFormData} state={registerFormData.login}/>
            <CustomInput type="tel" name="phone" isValid={!errorRegisterForm.phone} label={'Phone'}
                         setState={setRegisterFormData} state={registerFormData.phone}/>
            <CustomInput type="password" name="password" isValid={!errorRegisterForm.password} label={'Password'}
                         setState={setRegisterFormData} state={registerFormData.password}/>
            <CustomInput type="password" name="password2" isValid={!errorRegisterForm.password2}
                         label={'Repeat password'}
                         setState={setRegisterFormData} state={registerFormData.password2}/>
            <button>Register</button>
            <a onClick={() => setShowRegisterForm(false)}>I already have an account</a>
          </form>
        ) : (
          <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => onSubmitLoginForm(event)}
                onClick={(event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => event.stopPropagation()}>
            <CustomInput type="text" name="login" isValid={!errorLoginForm.login} label={'Login'}
                         setState={setLoginFormData} state={loginFormData.login}/>
            <CustomInput type="password" name="password" isValid={!errorLoginForm.password} label={'Password'}
                         setState={setLoginFormData} state={loginFormData.password}/>
            <button type="submit">Login</button>
            <a onClick={() => setShowRegisterForm(true)}>I don't have an account</a>
          </form>
        )
      }
    </div>
  );
};

export default LoginForm;