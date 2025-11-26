import { Link as LinkLibrary } from "react-router-dom";

import React from "react";

const replaceParams = (to, params) => {
  if (params == null) return to;
  Object.keys(params).forEach((key) => {
    to = to.replace(":" + key, params[key]);
  });
  return to;
};

const Link = ({ to, params, children, ...props }) => {
  const newTo = replaceParams(to, params);
  return (
    <LinkLibrary to={newTo} {...props}>
      {children}
    </LinkLibrary>
  );
};

export default Link;
