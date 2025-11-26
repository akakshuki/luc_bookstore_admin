import React from "react";
import {
  Dashboard,
  Login,
  PageAdd,
  LayoutAdd,
  UserAdd,
  ProductAdd,
  CategoryAdd,
  Products,
  Categories,
  Users,
  Orders,
  OrderAdd,
} from "../containers";

import {
  FcAcceptDatabase,
  FcWikipedia,
  FcSettings,
  FcShop,
  FcRatings,
  FcDatabase,
  FcBusinessman,
  FcViewDetails,
  FcCustomerSupport,
  FcCollaboration,
  FcProcess,
  FcBusiness,
  FcSalesPerformance,
} from "react-icons/fc";

import {
  LOGIN,
  DASHBOARD,
  PAGE_ADD,
  LAYOUT_ADD,
  USER_UPDATE,
  USER_ADD,
  LIST_USERS,
  PRODUCT_ADD,
  CATEGORY_ADD,
  PRODUCT_UPDATE,
  CATEGORY_UPDATE,
  LIST_PRODUCTS,
  LIST_CATEGORIES,
  LIST_ORDERS,
  ORDER_ADD,
  ORDER_UPDATE,
} from "./urls";

const MenuIcon = ({ icon, ...props }) =>
  React.createElement(icon, {
    size: 16,
    style: {
      verticalAlign: "center",
      marginBottom: "-2px",
      marginRight: "32px",
    },
    ...props,
  });

const generateKey = (menu = [], key = 0) => {
  menu.forEach((m) => {
    m.key = key++;
    if (m.sub) {
      key = generateKey(m.sub, key);
    }
  });

  return key;
};

let Menu = [
  {
    icon: <MenuIcon icon={FcDatabase} />,
    title: "Dashboard",
    url: { link: DASHBOARD, component: Dashboard },
  },
  // {
  //   icon: <MenuIcon icon={FcBusinessman} />,
  //   title: "Page Management",
  //   sub: [
  //     {
  //       title: "Adding page",
  //       url: { link: PAGE_ADD, component: PageAdd },
  //     },
  //     {
  //       title: "Layout page",
  //       url: { link: LAYOUT_ADD, component: LayoutAdd },
  //     },
  //     {
  //       title: "Login",
  //       url: { link: LOGIN, component: Login },
  //     },
  //   ],
  // },
  {
    icon: <MenuIcon icon={FcViewDetails} />,
    title: "Product",
    sub: [
      {
        title: "List Products",
        url: { link: LIST_PRODUCTS, component: Products },
      },
    ],
  },
  {
    icon: <MenuIcon icon={FcWikipedia} />,
    title: "Category",
    sub: [
      {
        title: "List Categories",
        url: { link: LIST_CATEGORIES, component: Categories },
      },
    ],
  },
  {
    icon: <MenuIcon icon={FcBusinessman} />,
    title: "User",
    sub: [
      {
        title: "List Users",
        url: { link: LIST_USERS, component: Users },
      },
    ],
  },
  {
    icon: <MenuIcon icon={FcShop} />,
    title: "Order",
    sub: [
      {
        title: "List Orders",
        url: { link: LIST_ORDERS, component: Orders },
      },
    ],
  },
];

generateKey(Menu);
export const MenuLinks = Menu;

export const ActionLinks = [
  {
    link: PRODUCT_ADD,
    component: ProductAdd,
  },
  {
    link: PRODUCT_UPDATE,
    component: ProductAdd,
  },
  {
    link: CATEGORY_UPDATE,
    component: CategoryAdd,
  },
  {
    link: CATEGORY_ADD,
    component: CategoryAdd,
  },
  {
    link: USER_UPDATE,
    component: UserAdd,
  },
  {
    link: USER_ADD,
    component: UserAdd,
  },
  {
    link: ORDER_ADD,
    component: OrderAdd,
  },
  {
    link: ORDER_UPDATE,
    component: OrderAdd,
  },
];
