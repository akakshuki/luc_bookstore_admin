import React, { useState, useMemo, useEffect } from 'react';
import { Button, Layout, Menu, Dropdown } from 'antd';
import { store } from './redux/store';
import { ThemeProvider } from 'styled-components';
import { isEmpty } from 'lodash';

import { Provider } from 'react-redux';
import { createMenuAndUrls, createRouters } from './components/Menu';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MenuLinks, ActionLinks } from './config/mapping';

import './App.css';
import theme from './theme';
import { Login } from './containers';
import { LOGIN } from './config/urls';
const { Footer, Header, Sider, Content } = Layout;

const styles = {
  layout: { minHeight: '100vh' },
  headerButton: { float: 'right', color: 'white', marginRight: 40 },
  header: { background: '#16161D', padding: 0, paddingLeft: 16 },
  content: {
    margin: '24px 16px',
    padding: 24,
    background: '#fff',
    minHeight: 280,
  },
  footer: { textAlign: 'center' },
};

const onMenuClick = ({ item, key, keyPath, domEvent }) => {
  if (key === 'logout') {
    console.log('.... response');
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('bsatk');
    window.location.href = '/login';
  }
};

const UserSettingDropdown = (
  <Menu onClick={onMenuClick}>
    <Menu.Divider />
    <Menu.Item key="logout">Log out</Menu.Item>
  </Menu>
);

const AdminDashboard = () => {
  let [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem('bsatk');
  const { menu, urls } = createMenuAndUrls(MenuLinks);
  const routers = createRouters([...urls, ...ActionLinks]);
  const currentAdmin = useMemo(() => JSON.parse(localStorage.getItem('currentAdmin')), []);

  useEffect(() => {
    let data = currentAdmin?.roles?.filter((x) => x?.id === 1 || x?.id === 2);
    if (isEmpty(data)) {
      window.location.href = '/login';
    }
  }, [currentAdmin]);

  useEffect(() => {
    if (!token && isEmpty(currentAdmin)) {
      window.location.href = '/login';
    }
  }, [token, currentAdmin]);
  return (
    <Layout style={styles.layout}>
      <Sider theme={'light'} width={230} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        {collapsed ? (
          <div
            style={{
              height: '64px',
              background: 'rgb(242, 153, 74) none repeat scroll 0% 0%',
            }}
          />
        ) : (
          <div className="logo">
            <span>
              <h3 style={{ color: '#ffffff', fontWeight: 'bold' }}>Bookstore</h3>{' '}
              <span style={{ color: 'rgb(236,236,236)' }}> management system</span>
            </span>
          </div>
        )}

        {menu}
      </Sider>
      <Layout>
        <Header style={styles.header}>
          <div style={styles.headerButton}>
            <Dropdown overlay={UserSettingDropdown}>
              <Button type="link" style={{ color: 'white' }}>
                {`Hello, ${currentAdmin?.name || 'Admin'}`}
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={styles.content}>{routers}</Content>
        <Footer style={styles.footer}>
          Bookstore Management System ©{new Date().getFullYear()} Created by Bookstore
        </Footer>
      </Layout>
    </Layout>
  );
};

const App = ({ t }) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path={LOGIN} component={Login} />
            <Route path="/" component={() => <AdminDashboard t={t} />} />
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
