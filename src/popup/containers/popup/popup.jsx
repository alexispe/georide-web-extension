import React from 'react';
import './popup.scss';

import Loader from '../../components/loader/loader';
import List from '../../components/list/list';


export default class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      trackers: [],
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

  render() {
    const { loadingView, loading, trackers } = this.state;

    if (!this.gapi) return <div className="loading">Erreur, veuillez redémarer l&#39;extension.</div>;
    if (loadingView) return <div className="loading">⌛</div>;
    if (this.gapi.token) {
      return (
        <List>
          { trackers.map(t => (
            <List.Item>
              <List.Icon onClick={
                  () => (t.canLock && t.canUnlock) && this.handleClickToggleTracker(t.trackerId)}
              >
                { loading ? <Loader /> : (t.status === 'offline' ? '📶' : (t.isLocked ? '🔒' : '🔓')) }
              </List.Icon>

              <List.Content>
                <List.Title>{ t.trackerName }</List.Title>
                <List.Meta>
                  { t.odometer && `${(t.odometer / 1000).toLocaleString()}km -\xa0` }

                  { (t.moving && t.speed) && `${(t.speed * 1.852).toLocaleString()}hm/h -\xa0` }

                  { t.canSeePosition
                  && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${t.latitude},${t.longitude}`} target="blank">
                    Localiser
                  </a>
                  )
                }
                </List.Meta>
              </List.Content>
            </List.Item>
          ))}
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
