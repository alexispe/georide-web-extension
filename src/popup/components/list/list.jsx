import React from 'react';
import PropTypes from 'prop-types';
import './list.scss';

export default class List extends React.Component {
  static Item = props => <div {...props} className="Item">{props.children}</div>;

  static Row = props => <div {...props} className={`Row ${props.className}`}>{props.children}</div>;

  static Col = props => <div {...props} className={`Col ${props.className}`}>{props.children}</div>;

  static SubItem = props => <div {...props} className="SubItem">{props.children}</div>;

  static Content = props => <div {...props} className="Content">{props.children}</div>;

  static Speed = props => <div {...props} className="Speed">{props.children}</div>;

  static Odometer = props => <div {...props} className="Odometer">{props.children}</div>;

  static Title = props => <div {...props} className="Title">{props.children}</div>;

  static Meta = props => <div {...props} className="Meta">{props.children}</div>;

  static Icon = props => <div {...props} className="Icon" {...props}>{props.children}</div>;

  render() {
    const { children } = this.props;
    return (<div className="List">{children}</div>);
  }
}

List.propTypes = {
  children: PropTypes.node.isRequired,
};
