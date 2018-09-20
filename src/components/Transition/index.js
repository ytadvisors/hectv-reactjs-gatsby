import React, { Component } from "react";
import { Transition as ReactTransition } from "react-transition-group";
import { getTransitionStyle } from "../../utils/helperFunctions";
import { historyExitingEventType, timeout } from "../../../gatsby-browser";
import { isServer } from "./../../utils/helperFunctions"
import $ from "jquery";

export default class Transition extends Component {
  constructor(props) {
    super(props);
    this.listenerHandler = this.listenerHandler.bind(this);
    this.state = {
      exiting: false
    };
  }

  listenerHandler(event) {
    this.setState({ exiting: true });

  }

  componentDidMount() {
    window.addEventListener(historyExitingEventType, this.listenerHandler);
  }


  static getDerivedStateFromProps({ exiting }) {
    if (exiting) {
      return { exiting: false }
    }
    return null
  }

  render() {
    const transitionProps = {
      timeout: {
        enter: 0,
        exit: timeout,
      },
      appear: true,
      in: !this.state.exiting,
    };

    return (
      <ReactTransition {...transitionProps}>
        {status => (
          <div
            style={{
              ...getTransitionStyle({ status, timeout }),
            }}
          >
            {this.props.children}
          </div>
        )}
      </ReactTransition>
    )
  }
}