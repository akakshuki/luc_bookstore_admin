import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  Input,
  Checkbox,
  Select,
  Table,
} from "antd";
import { useParams } from "react-router-dom";

import { QUERY_CURRENT_ORDER, ADD_ORDER } from "api";
import { ORDER_STATUS } from "utils/constant";
import Link from "components/Link";
import { LIST_ORDERS, PRODUCT_UPDATE } from "config/urls";
import { PriceNumber } from "components/Input";
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

const OrderAdd = (props) => {
  const [form] = Form.useForm();
  const [response, setResponse] = useState([]);

  const { history } = props;

  let { id } = useParams();

  const currentAdmin = useMemo(
    () => JSON.parse(localStorage.getItem("currentAdmin")),
    []
  );
  // let url = `${UPLOAD_PRODUCT_FILES}${idParam}`;
  let actionLabel = id ? "Updating" : "Adding new";

  const { setFieldsValue } = form;

  const loadCurrent = async ({ id, setFieldsValue }) => {
    if (id) {
      let res = await QUERY_CURRENT_ORDER({ id: id });
      console.log({ res });
      setFieldsValue({ ...res });
      setResponse(res);
    }
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    values.id = id ? parseInt(id) : undefined;
    values.createdBy = response.createdBy && response.createdBy;
    values.updatedBy = currentAdmin?.id;
    values.total = response?.total;

    console.log("After transform values of form: ", values);

    const res = await ADD_ORDER({ body: values });

    if (res) {
      openNotification({
        title: "Action completed!",
        message: `${actionLabel} order successfully`,
        action: () => history.push(LIST_ORDERS),
      });
    }
  };

  useEffect(() => {
    loadCurrent({ id, setFieldsValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setFieldsValue]);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={PRODUCT_UPDATE} params={{ id: record?.product?.id }}>
          {record?.product?.id}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={PRODUCT_UPDATE} params={{ id: record?.product?.id }}>
          {record?.product?.name}
        </Link>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          style={{ maxWidth: "50px" }}
          src={process.env.REACT_APP_BACKEND_URL + "/" + record?.product?.image}
          alt={record?.product?.name}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => record?.product?.price,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text, record) => record?.product?.discount,
    },
    {
      title: "Quantity",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <h1 className={"page-title"}>{actionLabel} order</h1>

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
        name="phone"
        label="Phone"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
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

      <Form.Item
        name="province"
        label="Province"
        rules={[
          {
            required: true,
            message: "Please input province",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="district"
        label="District"
        rules={[
          {
            required: true,
            message: "Please input district",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ward"
        label="Ward"
        rules={[
          {
            required: true,
            message: "Please input ward",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Display to user"
        name="displayToUser"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item label="Show to Home" name="showToHome" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item label="Total original price" name="totalOriginalSalePrice">
        <PriceNumber disabled={true} />
      </Form.Item>

      <Form.Item label="Total Sale Price" name="totalSalePrice">
        <PriceNumber disabled={true} />
      </Form.Item>

      <Form.Item label="Order note" name="note">
        <Input />
      </Form.Item>

      <Table
        rowKey={(item) => item.product.id}
        columns={columns}
        dataSource={response?.orderDetails}
      />

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
            message: "Please select status",
          },
        ]}
      >
        <Select style={{ width: "230px" }}>
          {ORDER_STATUS?.map((status) => (
            <Select.Option key={status?.id} value={status?.value}>
              {status?.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <ActionButtons
        addButtonLabel={`${actionLabel} order`}
        history={history}
      />
    </Form>
  );
};

export default OrderAdd;
