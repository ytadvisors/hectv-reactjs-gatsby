import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './modules.scss';

export default class PricingPlans extends Component {
  constructor(props) {
    super(props);
    this.getPricingFeature = this.getPricingFeature.bind(this);
  }

  getPricingFeature(feature, plan) {
    let feature_name = '';
    if (plan.feature_ids.indexOf(feature.parent) >= 0) {
      feature_name =
        plan.feature_ids.indexOf(feature.id) >= 0 ? feature.name : '';
    } else {
      feature_name = this.props.features.reduce((result, item) => {
        if (feature.parent === item.parent) {
          if (plan.feature_ids.indexOf(item.id) >= 0) {
            result = item.name;
            return result;
          }
        }
        return result;
      }, '');
    }
    return feature_name;
  }

  render() {
    const num_columns = Math.floor(12 / this.props.pricing_plans.length);
    let featured = [];

    return (
      <section className="pricing-plans">
        <div className="row">
          {this.props.pricing_plans.map((plan, i) => (
            <div
              key={`name-${plan.name}`}
              className={`col-md-${num_columns} vcenter`}
            >
              <div className="plan-container name-container">
                <div
                  className="plan-details plan-name text-center"
                  style={{
                    backgroundColor: plan.background_color,
                    color: plan.font_color
                  }}
                >
                  {plan.name}
                </div>
              </div>
            </div>
          ))}
          {this.props.pricing_plans.map((plan, i) => (
            <div
              key={`price-${plan.name}`}
              className={`col-md-${num_columns} vcenter`}
            >
              <div className="plan-container ">
                <div
                  className="plan-details plan-price text-center"
                  style={{
                    backgroundColor: plan.background_color,
                    color: plan.font_color
                  }}
                >
                  {plan.price == 0 ? `Free` : `$${plan.price} / month`}
                </div>
              </div>
            </div>
          ))}
          {this.props.features.map(feature =>
            this.props.pricing_plans.map((plan, i) => {
              let feature_name = this.getPricingFeature(feature, plan);
              let featured_key = `${plan.name}-${feature.parent}`;
              if (!featured[featured_key]) {
                featured[featured_key] = 1;
                return (
                  <div
                    key={plan.name}
                    className={`col-md-${num_columns} vcenter`}
                  >
                    <div className="plan-container">
                      <div
                        key={featured_key}
                        className="plan-details text-center"
                        dangerouslySetInnerHTML={{
                          __html: feature_name ? feature_name : '-'
                        }}
                      />
                    </div>
                  </div>
                );
              }
            })
          )}

          {this.props.pricing_plans.map((plan, i) => (
            <div key={plan.name} className={`col-md-${num_columns} vcenter`}>
              <div className="plan-container">
                <div className="plan-details ">
                  <a href="#" className="btn-primary btn buy-btn">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
}

PricingPlans.propTypes = {
  features: PropTypes.array.isRequired,
  pricing_plans: PropTypes.array.isRequired
};
