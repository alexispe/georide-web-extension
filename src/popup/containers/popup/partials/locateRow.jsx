import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../components/list/list';

export default class LocateRow extends React.Component {
  render() {
    const { tracker } = this.props;

    if (!tracker.canSeePosition) return null;

    return (
      <List.Row className="pointer">
        <List.Col>
          <List.Meta>
            <span
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${tracker.latitude},${tracker.longitude}`, '_blank');
              }}
            >
              Localiser
            </span>
          </List.Meta>
        </List.Col>
      </List.Row>
    );
  }
}

LocateRow.propTypes = {
  tracker: PropTypes.node.isRequired,
};
