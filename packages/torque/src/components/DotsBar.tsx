import React, { Component } from "react";

export class DotsBar extends Component {
  public render() {
    return (
      <div className="dots-bar">
        <div className="dot dot--blue" />
        <div className="dot dot--green" />
        <div className="dot dot--yellow" />
      </div>
    );
  }
}
