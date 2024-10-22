export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date,
    public role: string  // This role comes from Firebase custom claims
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}


//nedgto tbe able to access name and user infromation as they navigaet the app and hsoudl eb stored in some sort fo sessionStorage,