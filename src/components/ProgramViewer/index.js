import React from 'react';

import SideNavigation from '../SideNavigation';
import ListOfSideTabs from '../ListOfSideTabs';
import ListOfMagazines from '../ListOfMagazines';

import Schedule from '../Schedule';
import ListOfEvents from '../ListOfEvents';
import ShareSocialLinks from '../ShareSocialLinks';
import NewsLetterContainer from '../../containers/NewsLetterContainer';
import SignUp from '../SignUp';
import './styles.scss';

export default ({ style, programs, showShareIcons, children, url, title }) => (
  <section className="program-viewer">
    <div
      className="container no-padding program-viewer-container"
      style={style}
    >
      <div className="row">
        <div className="col-lg-9 no-padding list-container">
          <div className="clearfix">{children}</div>
        </div>
        <div className="col-lg-3 no-padding">
          <SideNavigation>
            {showShareIcons && (
              <div className="row share-container">
                <ShareSocialLinks url={url} title={title} />
              </div>
            )}
            <div className="row">
              <div className="col-sm-4 col-sm-push-8 col-lg-12 col-lg-push-0 no-padding">
                <ListOfEvents />
              </div>
              <div className="col-sm-8 col-sm-pull-4  col-lg-12 col-lg-pull-0  no-padding">
                <ListOfSideTabs
                  currentTab="HEC-TV NewsLetter"
                  tabs={[
                    {
                      title: 'Sign Up',
                      content: <SignUp />
                    },
                    {
                      title: 'HEC-TV NewsLetter',
                      content: <NewsLetterContainer />
                    }
                  ]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 col-sm-push-8 col-lg-12 col-lg-push-0 no-padding">
                <Schedule programs={programs} />
              </div>
              <div className="col-sm-8 col-sm-pull-4  col-lg-12 col-lg-pull-0  no-padding">
                <ListOfMagazines />
              </div>
            </div>
          </SideNavigation>
        </div>
      </div>
    </div>
  </section>
);
