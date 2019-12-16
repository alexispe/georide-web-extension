import io from 'socket.io-client';

const GEORIDE_URL = 'https://api.georide.fr/';

export default class GeorideAPI {
  constructor() {
    this.token = null;
    this.trackers = [];

    this.socket = null;
    this.socketOnReady = [];

    (async () => {
      await chrome.storage.sync.get(['token'], (data) => {
        if (data.token) {
          this.token = data.token;
          this.socket = io(
            GEORIDE_URL,
            {
              reconnection: true,
              transports: ['polling'],
              transportOptions: {
                polling: {
                  extraHeaders: {
                    token: this.token,
                  },
                },
              },
            },
          );
        }
      });
    })();
  }

  addSocketOnReady(fn, key) {
    this.socketOnReady[key] = fn;
    if (!this.socket) return false;
    this.socket.removeAllListeners('message');
    this.socket.removeAllListeners('device');
    this.socket.removeAllListeners('position');
    this.socket.removeAllListeners('alarm');
    this.socket.removeAllListeners('refreshTrackersInstruction');
    this.socket.removeAllListeners('lockedPosition');

    Object.values(this.socketOnReady).map(e => e());
    return true;
  }

  async login(email, password, socket = true) {
    const response = await fetch(`${GEORIDE_URL}user/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (json.error) return `Echec de la connexion : ${json.error}`;
    this.token = json.authToken;

    chrome.storage.sync.set({ token: this.token });

    if (socket) {
      this.socket = io(
        GEORIDE_URL,
        {
          reconnection: true,
          transports: ['polling'],
          transportOptions: {
            polling: {
              extraHeaders: {
                token: this.token,
              },
            },
          },
        },
      );
      this.socketOnReady.map(e => e());
    }
    return true;
  }

  async regenerateToken() {
    const response = await fetch(`${GEORIDE_URL}user/new-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.status === 401) {
      this.token = null;
      return false;
    }
    if (response.status === 429) return false;
    const json = await response.json();
    this.token = json.authToken;
    this.socket = io(GEORIDE_URL, {
      reconnection: true,
      transports: ['polling'],
      transportOptions: {
        polling: {
          extraHeaders: {
            token: this.token,
          },
        },
      },
    });
    return this.token;
  }

  async getTrackers() {
    const response = await fetch(`${GEORIDE_URL}user/trackers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.status === 401) {
      this.token = null;
      return [];
    }
    this.trackers = await response.json();
    console.log('trackers:', this.trackers);
    return this.trackers;
  }

  async getTrackerEvents(trackerId) {
    const response = await fetch(`${GEORIDE_URL}tracker/${trackerId}/events/?results=30&page=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (response.status === 401) return [];
    return response.json();
  }

  async toggleTrackerLock(trackerId) {
    const response = await fetch(`${GEORIDE_URL}tracker/${trackerId}/toggleLock`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const json = await response.json();
    return json.locked;
  }
}
