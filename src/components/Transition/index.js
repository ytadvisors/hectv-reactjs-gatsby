import React, { Component } from 'react';
import { Transition as ReactTransition } from 'react-transition-group';
import { getTransitionStyle } from '../../utils/helperFunctions';
import { historyExitingEventType, timeout } from '../../../gatsby-browser';

export default class Transition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exiting: false
    };
  }

  componentDidMount() {
    window.addEventListener(historyExitingEventType, this.listenerHandler);
  }

  static getDerivedStateFromProps({ exiting }) {
    if (exiting) {
      return { exiting: false };
    }
    return null;
  }

  listenerHandler = () => {
    this.setState({ exiting: true });
  };

  render() {
    const { exiting } = this.state;
    const { children } = this.props;
    const transitionProps = {
      timeout: {
        enter: 0,
        exit: timeout
      },
      appear: true,
      in: !exiting
    };

    return (
      <ReactTransition {...transitionProps}>
        {status => (
          <div
            style={{
              ...getTransitionStyle({ status, timeout })
            }}
          >
            {children}
          </div>
        )}
      </ReactTransition>
    );
  }
}
