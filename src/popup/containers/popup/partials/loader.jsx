
import React from 'react';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import List from '../../../components/list/list';

export default class LockRow extends React.Component {
  render() {
    return (
      <List>
        <List.Item>
          <List.Content>

            <List.Row className="bg-grey">
              <List.Col className="Full">
                <List.Title><SkeletonLoader width="50%" height="26px" /></List.Title>
                <List.Speed>
                  <SkeletonLoader width="60px" />
                </List.Speed>
              </List.Col>
              <List.Col>
                <List.Icon>
                  <SkeletonLoader circle width="20px" height="20px" />
                </List.Icon>
                <List.Odometer>
                  <SkeletonLoader width="20px" />
                </List.Odometer>
              </List.Col>
            </List.Row>

            <List.Row>
              <List.Col className="Full">
                <SkeletonLoader width="100px" />
              </List.Col>
              <List.Col>
                <SkeletonLoader circle width="20px" height="20px" />
              </List.Col>
            </List.Row>

            <List.Row>
              <List.Col>
                <List.Meta>
                  <SkeletonLoader width="100px" />
                </List.Meta>
              </List.Col>
            </List.Row>

            <List.Row>
              <List.Col>
                <List.Meta>
                  <SkeletonLoader width="100px" />
                </List.Meta>
              </List.Col>
            </List.Row>

          </List.Content>
        </List.Item>
      </List>
    );
  }
}
