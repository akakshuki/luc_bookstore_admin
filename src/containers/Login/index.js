import React from "react";
import { Form, Input, Button, Row, Col, Card } from "antd";
import { isEmpty } from "lodash";

import { LOGIN, QUERY_CURRENT_ADMIN } from "api";
import { openNotification } from "components/Form";
import { DASHBOARD, LOGIN as LOGIN_ROUTE } from "config/urls";
import { handleSSOLogin } from "utils/authHandlers";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = (props) => {
  const { history } = props;

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    let res = await LOGIN({ body: values });
    console.log("...............");
    console.log(res);

    if (res) {
      localStorage.setItem("bsatk", res?.token);
      const resCurrentAdmin = await QUERY_CURRENT_ADMIN({
        headers: {
          Authorization: `Bearer ${res?.token}`,
        },
      });
      if (resCurrentAdmin) {
        let data = resCurrentAdmin?.roles?.filter(
          (x) => x?.id === 1 || x?.id === 2
        );
        if (!isEmpty(data)) {
          localStorage.setItem("currentAdmin", JSON.stringify(resCurrentAdmin));
          openNotification({
            title: "Successfully",
            message: `Login successfully`,
            action: () => history.push(DASHBOARD),
          });
        } else {
          openNotification({
            title: "Permission Denied",
            message: `Login failed`,
            action: () => history.push(LOGIN_ROUTE),
          });
        }
      }
    }
  };

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: 'url("/images/user-login-background.png")',
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Col xs={20} sm={16} md={8}>
        <Card>
          <Form name="register" {...layout} form={form} onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              colon={false}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              colon={false}
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="default"
                style={{ marginLeft: "10px" }}
                onClick={handleSSOLogin}
              >
                Sign in with SSO
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
