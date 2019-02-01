import React from 'react';
import './styles.scss';
import ProgramViewer from '../ProgramViewer';
import HeaderContainer from '../../containers/HeaderContainer';
import Footer from '../Footer';
import BottomNav from '../BottomNav/index';

export default props => {
  const { children, slug, showBottomNav, menus, absContent } = props;
  const header = menus.reduce(
    (result, menu) => (menu.node.name === 'Header' ? menu.node.items : result)
  );
  const footer = menus.reduce(
    (result, menu) => (menu.node.name === 'Footer' ? menu.node.items : result)
  );
  const social = menus.reduce(
    (result, menu) => (menu.node.name === 'Social' ? menu.node.items : result)
  );
  const bottomNav = menus.reduce(
    (result, menu) =>
      menu.node.name === 'BottomNav' ? menu.node.items : result
  );
  return (
    <section className="layout">
      {absContent}
      <HeaderContainer header={header} social={social} page={slug} {...props} />
      <ProgramViewer {...props}>
        {children}
        {showBottomNav && (
          <BottomNav
            menus={bottomNav && bottomNav.node.items}
            title="more from"
          />
        )}
      </ProgramViewer>
      <Footer footer={footer} social={social} />
    </section>
  );
};
