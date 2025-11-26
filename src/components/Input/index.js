import React from "react";
import { InputNumber } from "antd";

import { currencyFormat, currencyParser } from "../../utils/currencyFormat";

export const InputUNumber = (props) => (
  <div>
    <InputNumber min={0} max={1} step={0.1} size="large" {...props} />
  </div>
);

export const PriceNumber = (props) => (
  <div>
    <InputNumber
      min={0}
      size="large"
      defaultValue={0}
      style={{ width: "100%" }}
      formatter={currencyFormat}
      parser={currencyParser}
      {...props}
    />
  </div>
);
