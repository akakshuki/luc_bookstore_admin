import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Upload, Checkbox, Select, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import reqwest from "reqwest";

import { QUERY_CURRRENT_PRODUCT, QUERY_CATEGORIES, ADD_PRODUCT } from "api";
import { LIST_PRODUCTS } from "config/urls";
import { PriceNumber, InputUNumber } from "components/Input";
import TinyEditor from "components/TinyEditor";
import { ActionButtons } from "components/Form";
import { slugify } from "utils/utils";
import { openNotification } from "components/Form";
import { createFileName } from "utils/utils";

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

const ProductAdd = (props) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);

  const [isUploadImage, setIsUploadImage] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [fileList, setFileList] = useState([]);

  const { history } = props;

  let { id } = useParams();

  const currentAdmin = useMemo(
    () => JSON.parse(localStorage.getItem("currentAdmin")),
    []
  );
  // let url = `${UPLOAD_PRODUCT_FILES}${idParam}`;
  let actionLabel = id ? "Updating" : "Adding new";

  const { setFieldsValue, getFieldValue } = form;

  const loadCurrent = async ({ id, setFieldsValue }) => {
    const resCategories = await QUERY_CATEGORIES(null, { page: 1, limit: 100 });
    setCategories(resCategories);

    if (id) {
      let res = await QUERY_CURRRENT_PRODUCT({ id: id });
      res.categoryId = resCategories?.data?.find(
        (category) => category.id === res.category.id
      ).id;
      setImageSrc(process.env.REACT_APP_BACKEND_URL + "/" + res?.image);
      setImage(res?.image);
      setFieldsValue({ ...res });
    }
  };

  const onNameChange = (e) => {
    const name = getFieldValue("name");
    if (!!name) {
      setFieldsValue({ slug: slugify(name) });
    }
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    values.id = id ? parseInt(id) : undefined;
    values.createdBy = currentAdmin?.id;
    const category = categories?.data?.find(
      (category) => category.id === values.categoryId
    );
    values.category = category;
    values.image = image;
    console.log("After transform values of form: ", values);

    const res = await ADD_PRODUCT({ body: values });

    if (isUploadImage) {
      handleUpload();
    }

    if (res) {
      openNotification({
        title: "Action completed!",
        message: `${actionLabel} products successfully`,
        action: () => history.push(LIST_PRODUCTS),
      });
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleUpload = () => {
    const formData = new FormData();
    console.log("handleUpload");
    formData.append("file", fileList?.[0]);
    formData.append("name", image.replace("images/products/", ""));

    reqwest({
      url: process.env.REACT_APP_BACKEND_URL + "/product/upload",
      method: "post",
      processData: false,
      data: formData,
      success: () => {
        message.success("upload successfully.");
      },
      error: () => {
        message.error("upload failed.");
      },
    });
  };

  // TODO: lấy dữ liệu của field name chuyển thành dạng slug
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    oncancel: () => setIsUploadImage(false),
  };

  useEffect(() => {
    loadCurrent({ id, setFieldsValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setFieldsValue]);

  const handleChange = (info) => {
    setFileList([info?.file, ...fileList]);
    const imageName = createFileName(info.file?.name);
    setIsUploadImage(true);
    setImage(`images/products/${imageName}`);

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      if (e && e.target) {
        setImageSrc(e.target.result);
      }
    });
    reader.readAsDataURL(info.file);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <h1 className={"page-title"}>{actionLabel} product</h1>

      <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload {...uploadProps} onChange={handleChange}>
          <Button
            style={{
              color: "white",
              width: 150,
              height: 150,
              backgroundSize: "cover",
              backgroundImage: `url('${imageSrc}')`,
              backgroundPosition: "center ",
            }}
            icon={<UploadOutlined style={{ fontSize: 35 }} />}
          ></Button>
        </Upload>
      </Form.Item>

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
        label="Display to user"
        name="displayToUser"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item label="Show to Home" name="showToHome" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true,
            message: "Please input price",
          },
        ]}
      >
        <PriceNumber />
      </Form.Item>

      <Form.Item label="Discount" name="discount">
        <InputUNumber />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TinyEditor />
      </Form.Item>

      <Form.Item
        label="Category"
        name="categoryId"
        rules={[
          {
            required: true,
            message: "Please select category",
          },
        ]}
      >
        <Select style={{ width: "230px" }}>
          {categories?.data?.map((category) => (
            <Select.Option key={category?.id} value={category?.id}>
              {category?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <ActionButtons
        addButtonLabel={`${actionLabel} product`}
        history={history}
      />
    </Form>
  );
};

export default ProductAdd;
