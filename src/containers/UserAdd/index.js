import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
import { isEmpty } from "lodash";

import { GENDER, DATE_FORMAT } from "utils/constant";
import { QUERY_CURRRENT_USER, ADD_USER, GET_ALL_ROLE } from "api";
import { LIST_USERS } from "config/urls";
import { ActionButtons } from "components/Form";
import { openNotification } from "components/Form";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const UserAdd = (props) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");

  const { history } = props;

  let { id } = useParams();

  let actionLabel = id ? "Updating" : "Adding new";

  const { setFieldsValue } = form;

  const queryRoles = async () => {
    const resRoles = await GET_ALL_ROLE();
    setRoles(resRoles);
  };

  const loadCurrent = async ({ id, setFieldsValue }) => {
    if (id) {
      let res = await QUERY_CURRRENT_USER({ id: id });
      res.roles = !isEmpty(res?.roles) && res?.roles?.map((role) => role?.id);
      console.log("query current user");
      console.log(res);
      setPassword(res?.password);
      res.password = "";

      res.birthday = res.birthday && moment(res?.birthday);
      setFieldsValue({ ...res });
    }
    await queryRoles();
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    values.id = id ? parseInt(id) : undefined;
    if (!values?.password && !!password) {
      values.password = password;
    }

    values.birthday = values.birthday && values?.birthday?.toISOString();

    values.roles = roles?.filter(function (e) {
      return this.indexOf(e.id) > -1;
    }, values.roles);

    console.log("After transform values of form: ", values);

    const res = await ADD_USER({ body: values });

    if (res) {
      openNotification({
        title: "Action completed!",
        message: `${actionLabel} users successfully`,
        action: () => history.push(LIST_USERS),
      });
    }
  };

  useEffect(() => {
    loadCurrent({ id, setFieldsValue });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setFieldsValue]);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <h1 className={"page-title"}>{actionLabel} user</h1>

      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "Invalid email" },
          {
            required: true,
            message: "Please input name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="password" label="Password">
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          () => ({
            validator(rule, value) {
              if (isNaN(value)) {
                return Promise.reject("Invalid phone number!");
              }
              if (value?.length === 10 && value[0] === "0") {
                return Promise.resolve();
              }
              if (value?.length === 9) {
                return Promise.resolve();
              }
              return Promise.reject("Invalid phone number!");
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="birthday" label="Birthday">
        <DatePicker format={DATE_FORMAT} />
      </Form.Item>

      <Form.Item label="Gender" name="gender">
        <Select style={{ width: "230px" }}>
          {GENDER?.map((gen) => (
            <Select.Option key={gen?.id} value={gen?.id}>
              {gen?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* <Form.Item
        label="Display to user"
        name="displayToUser"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item> */}

      <Form.Item label="Roles" name="roles">
        <Select mode="multiple" placeholder="Please select">
          {roles?.map((x) => (
            <Select.Option value={x?.id} key={x?.id}>
              {x?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <ActionButtons addButtonLabel={`${actionLabel} user`} history={history} />
    </Form>
  );
};

export default UserAdd;
