import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../components/list/list';

export default class LockRow extends React.Component {
  render() {
    const { tracker, onClick } = this.props;
    const img = tracker.isLocked
      ? <img src="https://app.georide.fr/static/images/icons/unlock.svg" className="icon-lock icon-grey" width="18px" alt="unlock" />
      : <img src="https://app.georide.fr/static/images/icons/lock.svg" className="icon-unlock icon-grey" width="18px" alt="lock" />;
    const text = tracker.isLocked ? 'Déverrouiller' : 'Verrouiller';

    if (!(tracker.canLock && tracker.canUnlock)) return null;

    return (
      <List.Row className="pointer" onClick={onClick}>
        <List.Col className="Full">
          { text }
        </List.Col>
        <List.Col>
          { img }
        </List.Col>
      </List.Row>
    );
  }
}

LockRow.propTypes = {
  tracker: PropTypes.node.isRequired,
  onClick: PropTypes.node.isRequired,
};
