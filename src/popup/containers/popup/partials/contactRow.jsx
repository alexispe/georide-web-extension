import React from 'react';
import List from '../../../components/list/list';

import './contactRow.scss';

export default class ContactRow extends React.Component {
  render() {
    return (
      <div className="Contact">
        <List.Row className="Row bg-grey">
          <List.Col>
            <List.Meta>
              <a className="Link" href="https://github.com/alexispe/georide-web-extension/issues">
                Signaler une erreur / Demander une fonctionnalité
              </a>
            </List.Meta>
          </List.Col>
        </List.Row>
      </div>
    );
  }
}
