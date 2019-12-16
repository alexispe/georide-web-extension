import React from 'react';
import PropTypes from 'prop-types';
import './list.scss';

export default class List extends React.Component {
  static Item = props => <div className="Item">{props.children}</div>;

  static Row = props => <div className={`Row ${props.className}`}>{props.children}</div>;

  static Col = props => <div className={`Col ${props.className}`}>{props.children}</div>;

  static SubItem = props => <div className="SubItem">{props.children}</div>;

  static Content = props => <div className="Content">{props.children}</div>;

  static Speed = props => <div className="Speed">{props.children}</div>;

  static Odometer = props => <div className="Odometer">{props.children}</div>;

  static Title = props => <div className="Title">{props.children}</div>;

  static Meta = props => <div className="Meta">{props.children}</div>;

  static Icon = props => <div className="Icon" {...props}>{props.children}</div>;

  render() {
    const { children } = this.props;
    return (<div className="List">{children}</div>);
  }
}

List.propTypes = {
  children: PropTypes.node.isRequired,
};
