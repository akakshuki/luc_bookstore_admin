import React, { useEffect, useMemo } from "react";
import { Form, Input, Checkbox } from "antd";
import { useParams } from "react-router-dom";

import { LIST_CATEGORIES } from "config/urls";
import { QUERY_CURRRENT_CATEGORY, ADD_CATEGORY } from "api";
import TinyEditor from "components/TinyEditor";
import { ActionButtons, openNotification } from "components/Form";
import { slugify } from "utils/utils";

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

const CategoryAdd = (props) => {
  const [form] = Form.useForm();
  const { history } = props;
  let { id } = useParams();
  const currentAdmin = useMemo(
    () => JSON.parse(localStorage.getItem("currentAdmin")),
    []
  );

  // let url = `${UPLOAD_PRODUCT_FILES}${idParam}`;
  let actionLabel = id ? "Updating" : "Adding new";

  const { setFieldsValue, getFieldValue } = form;

  let loadCurrent = async ({ id, setFieldsValue }) => {
    let res = await QUERY_CURRRENT_CATEGORY({ id: id });
    console.log("current.....");

    setFieldsValue({ ...res });
  };

  const onNameChange = (e) => {
    const name = getFieldValue("name");
    if (!!name) {
      setFieldsValue({ slug: slugify(name) });
    }
  };

  const onFinish = async (values) => {
    values.id = id ? parseInt(id) : undefined;
    values.createdBy = currentAdmin?.id;

    console.log("Received values of form: ", values);
    const res = await ADD_CATEGORY({ body: values });
    if (res) {
      openNotification({
        title: "Action completed!",
        message: `${actionLabel} category successfully`,
        action: () => history.push(LIST_CATEGORIES),
      });
    }
  };

  useEffect(() => {
    if (id) {
      (async () => await loadCurrent({ id, setFieldsValue }))();
    }
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
      <h1 className={"page-title"}>{actionLabel} category</h1>
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
        <Input onChange={onNameChange} />
      </Form.Item>
      <Form.Item
        name="slug"
        label="Slug"
        rules={[
          {
            required: true,
            message: "Please input slug",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Display To User"
        name="displayToUser"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Show To Footer"
        name="showToFooter"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TinyEditor />
      </Form.Item>
      <ActionButtons
        addButtonLabel={`${actionLabel} category`}
        history={history}
      />
    </Form>
  );
};

export default CategoryAdd;
