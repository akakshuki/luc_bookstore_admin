import Link from '../Link';
import React from 'react';

export const generateActionColumns = ({ actions = [] }) => (
  <span>
    {actions.map((action, index) => (
      <Link
        onClick={action.onClick}
        key={index}
        to={action.to}
        params={action.params}
      >
        <span
          style={{ marginBottom: 3, marginRight: 5, display: 'inline-block' }}
        >
          {action.inner}
        </span>
      </Link>
    ))}
  </span>
);
