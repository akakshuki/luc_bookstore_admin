import React from "react";

const Route = ({ Component, path, ...props }) => {
  return <Component path={path} {...props} />;
};

export default Route;
