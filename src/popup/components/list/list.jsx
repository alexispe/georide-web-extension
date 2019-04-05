import React from 'react';
import './list.scss';

export default class List extends React.Component {
  static Item = props => <div className="Item">{props.children}</div>;
  static Content = props => <div className="Content">{props.children}</div>;
  static Title = props => <div className="Title">{props.children}</div>;
  static Meta = props => <div className="Meta">{props.children}</div>;
  static Icon = props => <div className="Icon" {...props}>{props.children}</div>;

  render() {
    return (<div className="List">{this.props.children}</div>)
  }
}
