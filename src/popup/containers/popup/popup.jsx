import React from 'react';
import './popup.scss';

import Loader from '../../components/loader/loader';
import List from '../../components/list/list';


export default class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      trackers: [],
      events: [],
      email: '',
      password: '',
      loading: false,
      loadingView: true,
    };
    this.gapi = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickToggleTracker = this.handleClickToggleTracker.bind(this);
    this.getTrackers = this.getTrackers.bind(this);
  }

  async componentDidMount() {
    this.gapi = chrome.extension.getBackgroundPage();
    this.gapi = this.gapi.gapi;

    this.getTrackers();

    this.gapi.addSocketOnReady(() => {
      this.gapi.socket.on('lockedPosition', () => { this.getTrackers(); });
      this.gapi.socket.on('alarm', () => { this.getTrackers(); });
      this.gapi.socket.on('device', () => { this.getTrackers(); });
      this.gapi.socket.on('position', () => { this.getTrackers(); });
      this.gapi.socket.on('refreshTrackersInstruction', () => { this.getTrackers(); });
    }, 'popup');
  }

  async getTrackers() {
    this.setState({ loading: true });
    const trackers = await this.gapi.getTrackers();
    this.setState({ trackers, loading: false, loadingView: false });
  }


  handleChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ loadingView: true });
    const { email, password } = this.state;
    this.gapi.login(email, password).then((error) => {
      if (error !== true) {
        this.setState({ loadingView: false });
        return alert(error);
      }
      return this.getTrackers();
    });
  }

  handleClickToggleTracker(trackerId) {
    this.gapi.toggleTrackerLock(trackerId);
  }

  async handleClickToggleTrackerEvents(trackerId) {
    let events = await this.gapi.getTrackerEvents(trackerId);
    events = events.events.rows;

    this.setState({ events });
  }

  render() {
    const {
      loadingView, loading, trackers, events,
    } = this.state;

    if (!this.gapi) return <div className="loading">Erreur, veuillez redémarer l&#39;extension.</div>;
    if (loadingView) return <div className="loading">⌛</div>;
    if (this.gapi.token) {
      return (
        <List>
          { trackers.map(t => (
            <List.Item key={`track-item-${t.trackerId}`}>
              <List.Content>

                <List.Row className="bg-grey">
                  <List.Col>
                    <List.Title>{ t.trackerName }</List.Title>
                    <List.Speed>
                      { ((t.moving && t.speed) && `${(t.speed * 1.852).toLocaleString()}hm/h`)
                        || 'À l\'arrêt' }
                    </List.Speed>
                  </List.Col>
                  <List.Col>
                    <List.Icon onClick={
                      () => (t.canLock && t.canUnlock) && this.handleClickToggleTracker(t.trackerId)}
                    >
                      { loading ? <Loader /> : (t.status === 'offline' ? '📶' : (t.isLocked
                        ? <img src="https://app.georide.fr/static/images/icons/lock.svg" className="icon-lock" width="18px" alt="lock" />
                        : <img src="https://app.georide.fr/static/images/icons/unlock.svg" className="icon-unlock" width="18px" alt="unlock" />)) }
                    </List.Icon>
                    <List.Odometer>
                      { t.odometer && `${(t.odometer / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km` }
                    </List.Odometer>
                  </List.Col>
                </List.Row>


                { t.canSeePosition
                  && (
                    <List.Row>
                      <List.Col>
                        <List.Meta>
                          <span
                            onClick={() => {
                              window.open(`https://www.google.com/maps/search/?api=1&query=${t.latitude},${t.longitude}`, '_blank');
                            }}
                          >
                          Localiser
                          </span>
                        </List.Meta>
                      </List.Col>
                    </List.Row>
                  )
                }

                <List.Row>
                  <List.Col>
                    <List.Meta>
                      <span onClick={() => this.handleClickToggleTrackerEvents(t.trackerId)}>
                        Mes derniers évènements
                      </span>
                    </List.Meta>
                  </List.Col>
                </List.Row>

              </List.Content>
            </List.Item>
          ))}
          {
            events.map(e => (
              <List.SubItem>
                <List.Content>
                  <List.Row>
                    <List.Col>
                      <List.Title>{e.name}</List.Title>
                    </List.Col>

                    <List.Col>
                      <List.Meta>{new Date(e.createdAt).toLocaleString('fr-FR')}</List.Meta>
                    </List.Col>
                  </List.Row>
                </List.Content>
              </List.SubItem>
            ))
          }
        </List>
      );
    }
    const { email, password } = this.state;
    return (
      <div className="container">
        <h1>Connexion à GeoRide</h1>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="Email" type="email" name="email" value={email} onChange={this.handleChange} />
          <input placeholder="Mot de passe" type="password" name="password" value={password} onChange={this.handleChange} />
          <input type="submit" value="Connexion" />
        </form>
      </div>
    );
  }
}
