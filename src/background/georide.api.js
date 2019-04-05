import io from 'socket.io-client'

const GEORIDE_URL = 'https://api.georide.fr/';

export default class GeorideAPI {

  constructor() {
    this._token = null;
    this._trackers = [];

    this._socket = null;
    this._socketOnReady = [];
    this._socketOnMessage = null;
    this._socketOnDevice = null;
    this._socketOnPosition = null;
    this._socketOnAlarm = null;
    this._socketOnRefreshTrackersInstruction = null;
    this._socketOnLockedPosition = null;

    (async () => {
      await chrome.storage.sync.get(['token'], (data) => {
        if(data.token) {
          this._token = data.token;
          this._socket = io(GEORIDE_URL, {
          	reconnection: true,
            transports: ['polling'],
          	transportOptions: {
          		polling: {
          			extraHeaders: {
          				'token': this.token
          			}
          		}
          	}
          });
          // this.regenerateToken();
        }
      });
    })();
  }

  get token() { return this._token; }
  get trackers() { return this._trackers; }

  get socket() { return this._socket; }

  get socketOnReady() { return this._socketOnReady; }
  addSocketOnReady(fn, key) {
    if (typeof fn !== "function") {
      console.error('socketOnReady need a function');
      return;
    }
    this._socketOnReady[key] = fn;
    console.log(this.socket);
    if(!this.socket) return;
    this.socket.removeAllListeners('message');
    this.socket.removeAllListeners('device');
    this.socket.removeAllListeners('position');
    this.socket.removeAllListeners('alarm');
    this.socket.removeAllListeners('refreshTrackersInstruction');
    this.socket.removeAllListeners('lockedPosition');

    Object.values(this.socketOnReady).map(e => {
      e();
    });
  }
  get socketOnMessage() { return this._socketOnMessage; }
  set socketOnMessage(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnMessage need a function');
      return;
    }
    this._socketOnMessage = fn;
    this._socket.on('message', this.socketOnMessage);
  }
  get socketOnDevice() { return this._socketOnDevice; }
  set socketOnDevice(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnDevice need a function');
      return;
    }
    this._socketOnDevice = fn;
    this._socket.on('device', this.socketOnDevice);
  }
  get socketOnPosition() { return this._socketOnPosition; }
  set socketOnPosition(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnPosition need a function');
      return;
    }
    this._socketOnPosition = fn;
    this._socket.on('position', this.socketOnPosition);
  }
  get socketOnAlarm() { return this._socketOnAlarm; }
  set socketOnAlarm(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnAlarm need a function');
      return;
    }
    this._socketOnAlarm = fn;
    this._socket.on('alarm', this.socketOnAlarm);
  }
  get socketOnRefreshTrackersInstruction() { return this._socketOnRefreshTrackersInstruction; }
  set socketOnRefreshTrackersInstruction(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnRefreshTrackersInstruction need a function');
      return;
    }
    this._socketOnRefreshTrackersInstruction = fn;
    this._socket.on('refreshTrackersInstruction', this.socketOnRefreshTrackersInstruction);
  }
  get socketOnLockedPosition() { return this._socketOnLockedPosition; }
  set socketOnLockedPosition(fn) {
    if (typeof fn !== "function") {
      console.error('socketOnLockedPosition need a function');
      return;
    }
    this._socketOnLockedPosition = fn;
    this._socket.on('lockedPosition', this.socketOnLockedPosition);
  }

  async login(email, password, socket = true) {
    let response = await fetch(GEORIDE_URL + 'user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    });
    let json = await response.json();

    if(json.error) return 'Echec de la connexion : ' + json.error;
    this._token = json.authToken;

    chrome.storage.sync.set({token: this.token});

    if(socket) {
      this._socket = io(GEORIDE_URL, {
      	reconnection: true,
        transports: ['polling'],
      	transportOptions: {
      		polling: {
      			extraHeaders: {
      				'token': this.token
      			}
      		}
      	}
      });
      this.socketOnReady.map(e => e());
    }
    return;
  }

  async regenerateToken() {
    let response = await fetch(GEORIDE_URL + 'user/new-token',{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+this.token
      }
    });
    if(response.status === 401) {
      this._token = null;
      return;
    }
    if(response.status === 429) return;
    let json = await response.json();
    this._token = json.authToken;
    this._socket = io(GEORIDE_URL, {
      reconnection: true,
      transports: ['polling'],
      transportOptions: {
        polling: {
          extraHeaders: {
            'token': this.token
          }
        }
      }
    });
    return this.token;
  }

  async getTrackers() {
    let response = await fetch(GEORIDE_URL + 'user/trackers',{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+this.token
      }
    });
    if(response.status === 401) return [];
    this._trackers = await response.json();
    return this.trackers;
  }

  async toggleTrackerLock(trackerId) {
    let response = await fetch(GEORIDE_URL + 'tracker/'+trackerId+'/toggleLock',{
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+this.token
      }
    });
    let json = await response.json();
    return json.locked;
  }

}
