import { Menu } from "antd";
import React from "react";
import { Link, Route } from "react-router-dom";

import { Translation } from "react-i18next";
const { SubMenu } = Menu;

const styles = {
  menu: { minHeight: "90vh" },
  item: { marginTop: "2px", marginBottom: "2px" },
};

const ItemLabel = ({ item, hasSub }) => {
  let styles = {};

  if (!hasSub && item.key !== 0) {
    styles = { marginLeft: 22 };
  }
  return (
    <Translation>
      {(t) => (
        <span style={styles}>
          {item.icon}
          {hasSub ? <b>{t(`${item.title}`)}</b> : t(`${item.title}`)}
        </span>
      )}
    </Translation>
  );
};

const resolveMenu = ({ items, urls, t }) => {
  return items.map((item, index) => {
    if (item.url != null) {
      urls.push(item.url);
      return (
        <Menu.Item key={item.key} style={styles.item}>
          <ItemLabel item={item} />
          <Link to={item.url.link} />
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu
          key={[item.key, index].join("")}
          title={<ItemLabel item={item} hasSub={true} />}
        >
          {resolveMenu({ items: item.sub, urls })}
        </SubMenu>
      );
    }
  });
};

export const createMenuAndUrls = (items) => {
  let urls = [];
  return {
    menu: (
      <Menu
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        style={styles.menu}
      >
        {resolveMenu({ items, sub: 0, urls: urls })}
      </Menu>
    ),
    urls: urls,
  };
};

export const createRouters = (urls) =>
  urls.map((url, index) => (
    <Route
      key={`${url.link}-${index}`}
      exact
      path={url.link}
      component={url.component}
    />
  ));
