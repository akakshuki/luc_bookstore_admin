import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import { IoMdMoon, IoMdSunny, IoMdDesktop } from 'react-icons/io';

const ThemeToggle = () => {
  const { mode, setMode } = useTheme();

  const handleMenuClick = ({ key }) => {
    setMode(key);
  };

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[mode]}>
      <Menu.Item key="light" icon={<IoMdSunny />}>
        Light
      </Menu.Item>
      <Menu.Item key="dark" icon={<IoMdMoon />}>
        Dark
      </Menu.Item>
      <Menu.Item key="system" icon={<IoMdDesktop />}>
        System
      </Menu.Item>
    </Menu>
  );

  const getIcon = () => {
    switch (mode) {
      case 'dark':
        return <IoMdMoon />;
      case 'light':
        return <IoMdSunny />;
      case 'system':
      default:
        return <IoMdDesktop />;
    }
  };

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="text" style={{ color: 'white' }} icon={getIcon()}>
         <span style={{ marginLeft: 8, textTransform: 'capitalize' }}>{mode}</span>
      </Button>
    </Dropdown>
  );
};

export default ThemeToggle;
