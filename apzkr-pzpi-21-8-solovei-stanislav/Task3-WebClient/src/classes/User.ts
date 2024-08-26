class User {
  private _id: number;
  private _login: string;
  private _phone: string;
  private _firstName: string;
  private _isAdmin: boolean;

  constructor(id: number, login: string, firstName: string, phone: string, isAdmin: boolean) {
    this._id = id;
    this._login = login;
    this._firstName = firstName;
    this._phone = phone;
    this._isAdmin = isAdmin;
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get login(): string {
    return this._login;
  }

  set login(newLogin: string) {
    this._login = newLogin;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(newPhone: string) {
    this._phone = newPhone;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(newFirstName: string) {
    this._firstName = newFirstName;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
}

export default User;