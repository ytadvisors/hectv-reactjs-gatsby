import React, {Component} from 'react';

import SideNavigation from './../../components/SideNavigation';
import ListOfSideTabs from './../../components/ListOfSideTabs';
import ListOfMagazines from './../../components/ListOfMagazines';

import Schedule from './../../components/Schedule';
import ListOfEvents from './../../components/ListOfEvents';
import NewsLetterContainer from './../../containers/NewsLetterContainer';
import SignUp from './../../components/SignUp';
import './styles.scss';



export default class ProgramViewer extends Component{

  constructor(props){
    super(props)
  }


  render(){
    const {
      style,
      schedule,
      children
    } = this.props;

    return (
      <section className="program-viewer">
        <div
          className="container no-padding program-viewer-container"
          style={style}
        >
          <div className="row">
            <div className="col-lg-9 no-padding list-container">
              <div className="clearfix">
                {children}
              </div>
            </div>
            <div className="col-lg-3 no-padding">
              <SideNavigation>
                <div className="row">
                  <div className="col-sm-4 col-sm-push-8 col-lg-12 col-lg-push-0 no-padding">
                    <ListOfEvents />
                  </div>
                  <div className="col-sm-8 col-sm-pull-4  col-lg-12 col-lg-pull-0  no-padding">
                    <ListOfSideTabs
                      current_tab="HEC-TV NewsLetter"
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
                    <Schedule schedule={schedule}/>
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
    )
  }
}
