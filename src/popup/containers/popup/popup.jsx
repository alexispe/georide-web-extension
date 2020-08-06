import React from 'react';
import './popup.scss';

import Loader from '../../components/loader/loader';
import List from '../../components/list/list';
import LoaderView from './partials/loader';
import LockRow from './partials/lockRow';
import LocateRow from './partials/locateRow';
import EventRow from './partials/eventRow';
import StatsRow from './partials/statsRow';

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

    trackers.map(async (t, index) => {
      const tracker = t;
      const date = new Date();
      const to = date.toISOString();
      date.setMonth(date.getMonth() - 1);
      const from = date.toISOString();

      const trips = await this.gapi.getTrackerTrips(tracker.trackerId, from, to);

      tracker.statistics = {
        count: 0,
        distance: 0,
        duration: 0,
        averageSpeed: 0,
        totalAverageSpeed: 0,
        maxSpeed: 0,
      };

      await trips.map((trip) => {
        tracker.statistics.count += 1;
        tracker.statistics.distance += trip.distance;
        tracker.statistics.duration += trip.duration;
        tracker.statistics.totalAverageSpeed += trip.averageSpeed;
        if (trip.maxSpeed > tracker.statistics.maxSpeed) {
          tracker.statistics.maxSpeed = trip.maxSpeed;
        }
        return trip;
      });
      const { totalAverageSpeed, count } = tracker.statistics;
      tracker.statistics.averageSpeed = totalAverageSpeed / count;

      const { trackers: tempTrackers } = this.state;
      tempTrackers[index] = tracker;
      this.setState({ trackers: tempTrackers });
      return tracker;
    });

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
    const {
      loadingView, loading, trackers,
    } = this.state;

    if (!this.gapi) return <div className="loading">Erreur, veuillez redémarer l&#39;extension.</div>;
    if (loadingView) return <LoaderView />;
    if (this.gapi.token) {
      return (
        <List>
          { trackers.map(t => (
            <List.Item key={`track-item-${t.trackerId}`}>
              <List.Content>

                <List.Row className="bg-grey">
                  <List.Col className="Full">
                    <List.Title>{ t.trackerName }</List.Title>
                    <List.Speed>
                      { ((t.moving && t.speed) && `${(t.speed * 1.852).toLocaleString()}hm/h`)
                        || 'À l\'arrêt' }
                    </List.Speed>
                  </List.Col>
                  <List.Col>
                    <List.Icon onClick={
                      () => (
                        (t.canLock && t.canUnlock) && this.handleClickToggleTracker(t.trackerId)
                      )}
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

                <LockRow tracker={t} onClick={() => this.handleClickToggleTracker(t.trackerId)} />
                <LocateRow tracker={t} />
                <EventRow tracker={t} gapi={this.gapi} />
                <StatsRow tracker={t} />

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
