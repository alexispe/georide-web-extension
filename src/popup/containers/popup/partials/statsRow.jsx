import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../components/list/list';


import './statsRow.scss';

export default class StatsRow extends React.Component {
  render() {
    const { tracker } = this.props;

    if (!tracker.canSeeStatistics) return null;
    if (!tracker.statistics) return null;

    return (
      <div className="Stats">
        <List.Row className="bg-grey">
          <List.Col>
            <List.Meta>Statistiques des 30 derniers jours</List.Meta>
          </List.Col>
        </List.Row>
        <List.Row>
          <List.Col>
            <span>
              <img src="/assets/icons/components_icons_trajetfocused.png" alt="" className="Icon" />
              <span className="Value">{ tracker.statistics.count }</span>
            </span>
            <span>trajets</span>
          </List.Col>
          <List.Col className="Full">
            <span>
              <img src="/assets/icons/components_icons_roadfocused.png" alt="" className="Icon" />
              <span className="Value">
                { (tracker.statistics.distance / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }
              </span>
              <span>&nbsp;km</span>
            </span>
            <span>distance totale</span>
          </List.Col>
          <List.Col>
            <span>
              <img src="/assets/icons/components_icons_clockfocused.png" alt="" className="Icon" />
              <span className="Value">{ (tracker.statistics.duration / (1000 * 60 * 60)).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }</span>
              <span>&nbsp;h</span>
            </span>
            <span>durée totale</span>
          </List.Col>
        </List.Row>

        <List.Row>
          <List.Col className="Full">
            <span>
              <img src="/assets/icons/components_icons_speedlowfocused.png" alt="" className="Icon" />
              <span className="Value">{ (tracker.statistics.averageSpeed * 1.852).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }</span>
              <span>&nbsp;km/h</span>
            </span>
            <span>vitesse moyenne</span>
          </List.Col>
          <List.Col className="Full">
            <span>
              <img src="/assets/icons/components_icons_speedmaxfocused.png" alt="" className="Icon" />
              <span className="Value">{ (tracker.statistics.maxSpeed * 1.852).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }</span>
              <span>&nbsp;km/h</span>
            </span>
            <span>vitesse max</span>
          </List.Col>
        </List.Row>
      </div>
    );
  }
}

StatsRow.propTypes = {
  tracker: PropTypes.node.isRequired,
};
