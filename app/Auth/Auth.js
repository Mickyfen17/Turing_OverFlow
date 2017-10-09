import Auth0 from 'auth0-lock';
import config from '../../config.json';

const EventEmitter = require('events').EventEmitter;

const authOptions = {
  allowedConnections: ['github'],
  theme: {
    logo: 'https://d3c5s1hmka2e2b.cloudfront.net/uploads/topic/image/182/Turing---Logo-Black.png',
  },
};

export default class Auth extends EventEmitter {
  constructor(clientID, domain) {
    super();
    this.lock = new Auth0(clientID, domain, authOptions);
    this.lock.on('authenticated', this.authenticate.bind(this));
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
  }

  login() {
    this.lock.show();
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }

  loggedIn() {
    const token = localStorage.getItem('id_token');
    return !token ? false : true;
  }

  authenticate(authResult) {
    const idToken = authResult.accessToken;

    localStorage.setItem('id_token', idToken);

    this.lock.getUserInfo(idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        const { clientID, name, nickname, picture } = profile;
        const user = { clientID, name, nickname, picture };
        this.setProfile(user);
      }
    });
  }

  setProfile(user) {
    localStorage.setItem('profile', JSON.stringify(user));
    this.emit('userAdded', user);
  }

  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }
}