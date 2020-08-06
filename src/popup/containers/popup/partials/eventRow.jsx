import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../components/list/list';

export default class LockRow extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      show: false,
    };
  }

  async handleClickToggleTrackerEvents(trackerId) {
    const { gapi } = this.props;
    let events = await gapi.getTrackerEvents(trackerId); // eslint-disable-line
    events = events.events.rows;
    let { show } = this.state;
    show = !show;

    this.setState({ events, show });
  }

  render() {
    const { tracker } = this.props;
    const { events, show } = this.state;
    const eventsList = {
      lock: 'Vérrouillé', unlock: 'Déverrouillé', deviceOffline: 'Hors ligne', deviceOnline: 'En ligne', exitZone: 'Sortie de zone',
    };

    if (!tracker.canSeeStatistics) return null;

    return (
      <div>
        <List.Row className="pointer">
          <List.Col>
            <List.Meta>
              <span onClick={() => this.handleClickToggleTrackerEvents(tracker.trackerId)}>
                Mes derniers évènements
              </span>
            </List.Meta>
          </List.Col>
        </List.Row>
        { show && events.map(e => (
          <List.SubItem key={e.createdAt}>
            <List.Content>
              <List.Row>
                <List.Col className="Full">
                  <List.Title>{eventsList[e.name] ? eventsList[e.name] : e.name}</List.Title>
                </List.Col>

                <List.Col>
                  <List.Meta>{new Date(e.createdAt).toLocaleString('fr-FR')}</List.Meta>
                </List.Col>
              </List.Row>
            </List.Content>
          </List.SubItem>
        ))
        }
      </div>
    );
  }
}

LockRow.propTypes = {
  tracker: PropTypes.node.isRequired,
  gapi: PropTypes.node.isRequired,
};
