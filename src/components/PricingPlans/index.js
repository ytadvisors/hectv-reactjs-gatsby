import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import './modules.scss';
import _ from 'lodash';

export default class PricingPlans extends Component {
  constructor(props) {
    super(props);
    this.getPlans = this.getPlans.bind(this);
    this.isMobile = false;
  }

  componentDidMount() {
    this.isMobile = this.state.width <= 500;
  }

  getPlans(plans, features) {
    const num_columns = Math.floor(12 / plans.length);
    const { openPricing } = this.props;
    let displayed_row = {};
    console.log(features);
    return (
      <table className="row">
        <tbody>
          <tr>
            {plans.map((plan, i) => (
              <td
                key={`name-${plan.name}`}
                className={`col-md-${num_columns} header-container top-header vcenter`}
                style={{
                  backgroundColor: plan.background_color,
                  color: plan.font_color
                }}
              >
                <div className="plan-container">
                  <div className="plan-details plan-name text-center">
                    {plan.name}
                  </div>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {plans.map((plan, i) => (
              <td
                key={`price-${plan.name}`}
                className={`col-md-${num_columns} header-container bottom-header vcenter`}
                style={{
                  backgroundColor: plan.background_color,
                  color: plan.font_color
                }}
              >
                <div className="plan-container ">
                  <div className="plan-details plan-price text-center">
                    {plan.price === '0' ? `Free` : `$${plan.price} / month`}
                  </div>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            {plans.map((plan, i) => (
              <td
                key={`btn-${plan.name}-${i}`}
                className={`col-md-${num_columns} vcenter`}
                style={{
                  backgroundColor: plan.background_color,
                  color: plan.font_color,
                  border: '0'
                }}
              >
                <div className="plan-container">
                  <div className="plan-details ">
                    {plan.price !== '0' ? (
                      <Button
                        className="btn-primary btn buy-btn"
                        onClick={() => openPricing(plan.id)}
                      >
                        {' '}
                        Buy Now
                      </Button>
                    ) : (
                      <Button
                        className="btn-default btn buy-btn"
                        onClick={() => openPricing(plan.id)}
                      >
                        {' '}
                        Sign up
                      </Button>
                    )}
                  </div>
                </div>
              </td>
            ))}
          </tr>
          {plans.map(plan => {
            return _.keys(plan.features).map(key => {
              if (!displayed_row[key]) {
                displayed_row[key] = 1;
                return (
                  <tr key={`row-${key}`}>
                    {plans.map((plan_list, i) => (
                      <td
                        key={`col-${key}-${i}`}
                        className={`col-md-${num_columns} vcenter`}
                      >
                        {plan.features[key].map((details, y) => {
                          return (
                            <div key={`plan-${y}`} className="plan-container">
                              <div className="plan-details">
                                {plan_list.features[key]
                                  ? plan_list.features[key][0]
                                  : '-'}
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    ))}
                  </tr>
                );
              }
            });
          })}
        </tbody>
      </table>
    );
  }

  render() {
    const { pricing_plans } = this.props;
    let features = pricing_plans.reduce((result, item) => {
      result = { ...result, ...item.features };
      return result;
    }, {});

    let plans = <div />;
    if (!this.isMobile) {
      plans = this.getPlans(pricing_plans, features);
    } else {
      plans = (
        <section>
          {pricing_plans.map((plan, x) => (
            <div className="row" key={`planlist-${x}`}>
              {this.getPlans([plan])}
            </div>
          ))}
        </section>
      );
    }
    return <section className="pricing-plans">{plans}</section>;
  }
}

PricingPlans.propTypes = {
  pricing_plans: PropTypes.array.isRequired,
  openPricing: PropTypes.func.isRequired
};
