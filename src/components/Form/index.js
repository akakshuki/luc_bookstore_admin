import { Button, Form, notification, InputNumber } from "antd";
import React from "react";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const InputUNumber = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <InputNumber min={0} {...props} />
  </div>
));

export const ActionButtons = (props) => {
  const { onClickCancel, history } = props;

  const handleClickCancelDefault = onClickCancel || history.goBack;

  return (
    <div style={{ marginTop: 10 }}>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {props.addButtonLabel}
        </Button>

        <Button style={{ marginLeft: 5 }} onClick={handleClickCancelDefault}>
          Cancel
        </Button>
      </Form.Item>
    </div>
  );
};

export const handleDelete = ({ deleteAction, params, reload }) => {
  openConfirm({
    title: "Warning",
    message: "Are you sure you want to delete this record?",
    action: async () => {
      console.log(".starting deleteing");
      console.log(params);
      let res = await deleteAction(params);
      console.log(".........done delete ......");
      console.log(res);
      await reload();
      if (res) {
        openNotification({
          title: "Action completed!",
          message: "Deleting record successfully!!",
        });
      }
    },
  });
};

const close = () => {
  console.log(
    "Notification was closed. Either the close button was clicked or duration time elapsed."
  );
};

export const openConfirm = ({ title, message, action }) => {
  const key = `open${Date.now()}`;
  const btn = (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        action && action();
        notification.close(key);
      }}
    >
      Confirm
    </Button>
  );
  notification.open({
    message: title,
    description: message,
    btn,
    key,
    onClose: close,
  });
};

export const openNotification = ({ title, message, action }) => {
  notification.open({
    message: title,
    description: message,
    placement: "bottomRight",
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
  action && action();
};
