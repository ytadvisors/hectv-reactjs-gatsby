import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export default class ListOfSideTabs extends Component {
  constructor(props) {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.state = {
      current_tab: props.current_tab
    };
  }

  changeTab(current_tab) {
    this.setState({ current_tab: current_tab });
  }

  render() {
    const { tabs } = this.props;

    return (
      <section className="list-of-side-tabs">
        <ul className="tab-header">
          {tabs.map((tab, x) => (
            <li
              className={tab.title === this.state.current_tab ? 'active' : ''}
              key={`tabs-${x}`}
              onClick={() => this.changeTab(tab.title)}
            >
              {tab.title}
            </li>
          ))}
        </ul>
        {tabs.map((tab, x) => {
          return (
            tab.title === this.state.current_tab && (
              <div key={`tab-content-${x}`} className="tab-content">
                {tab.content}
              </div>
            )
          );
        })}
      </section>
    );
  }
}

ListOfSideTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  current_tab: PropTypes.string.isRequired
};
