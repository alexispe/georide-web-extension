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
      loading:false,
      loadingView:false,
    };
    this.gapi = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickToggleTracker = this.handleClickToggleTracker.bind(this);
    this.getTrackers = this.getTrackers.bind(this);
  }

  async componentDidMount() {
    this.gapi = window.chrome ? await chrome.extension.getBackgroundPage() : await browser.runtime.getBackgroundPage();
    this.gapi = this.gapi.gapi;

    if(this.gapi.token) this.setState({loadingView: true});

    this.getTrackers();

    this.gapi.addSocketOnReady(() => {
      this.gapi.socketOnLockedPosition = async () => {
        await this.getTrackers();
      };
      this.gapi.socketOnAlarm = this.getTrackers;
      this.gapi.socketOnDevice = async () => {
        await this.getTrackers();
      };
      this.gapi.socketOnPosition = async () => {
        await this.getTrackers();
      };
      this.gapi.socketOnRefreshTrackersInstruction = this.getTrackers;
    }, 'popup');
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({loadingView:true});
    this.gapi.login(this.state.email,this.state.password).then(function(error) {
      if(error) {
        this.setState({loadingView:false});
        return alert(error);
      }
      this.getTrackers();
    }.bind(this));
  }

  async handleClickToggleTracker(trackerId) {
    let trackers = await this.gapi.toggleTrackerLock(trackerId);
  }

  async getTrackers() {
    this.setState({loading:true})
    let trackers = await this.gapi.getTrackers();
    this.setState({trackers,loading:false,loadingView:false});
  }

  render() {

    let trackersElements = [];

    this.state.trackers.map((t) => console.log(t))

    if(!this.gapi) return <div className="loading">Erreur, veuillez redémarer l'extension.</div>;
    if(this.state.loadingView) return <div className="loading">⌛</div>;
    if(this.gapi.token) return (
      <List>
        { this.state.trackers.map((t) => (
          <List.Item>
            <List.Icon onClick={() => (t.canLock && t.canUnlock) && this.handleClickToggleTracker(t.trackerId)}>
              { this.state.loading ? <Loader/> : t.isLocked ? '🔒' : '🔓' }
            </List.Icon>

            <List.Content>
              <List.Title>{ t.trackerName }</List.Title>
              <List.Meta>
                { t.odometer && `${(t.odometer/1000).toLocaleString()}km - ` }

                { (t.moving && t.speed) && `${(t.speed*1.852).toLocaleString()}hm/h - ` }

                { t.canSeePosition &&
                  <a href={`https://www.google.com/maps/search/?api=1&query=${t.latitude},${t.longitude}`} target="blank">
                    Localiser
                  </a>
                }
              </List.Meta>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
    else return (
      <div className="container">
        <h1>Connexion à GeoRide</h1>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="Email" type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
          <input placeholder="Mot de passe" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
          <input type="submit" value="Connexion"/>
        </form>
      </div>
    );

  }
}
