import { Upload, Modal } from "antd";
import React from "react";
import { FcUpload } from "react-icons/fc";
import { equals, isEmpty, propOr } from "ramda";

import { SERVER_PUBLIC_FOLDER } from "api/configRequest";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const mapFileToServerObjectDefaultFunc = ({ rawItem }) => rawItem;
export default class PicturesWall extends React.Component {
  state = {
    visible: false,
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    disabled: false,
  };

  componentDidMount() {
    const { value } = this.props;
    if (isEmpty(value)) {
      return;
    }

    this.migrateSingleValueToSelfState();
    this.migrateArrayValueToSelfState();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.props;

    if (!equals(value, prevProps.value) && !isEmpty(value)) {
      this.migrateSingleValueToSelfState();
      this.migrateArrayValueToSelfState();
    }
  }

  migrateArrayValueToSelfState = () => {
    const { value } = this.props;

    if (Array.isArray(value)) {
      const newFileList = value.map((x) => {
        const fileName = propOr("", "FileName", x.file);
        const fileUrl = propOr("", "Url", x.file);
        let newItem = {};
        if (fileName && fileUrl) {
          const url = `${SERVER_PUBLIC_FOLDER}${fileUrl}?${Date.now()}`;
          newItem = {
            uid: x.ID,
            name: fileName,
            thumbUrl: url,
            url,
            rawItem: x,
          };
        }
        return newItem;
      });
      this.setState({ fileList: newFileList });
    }
  };

  migrateSingleValueToSelfState = () => {
    const { value } = this.props;

    if (!Array.isArray(value) && !isEmpty(value)) {
      const fileName = propOr("", "FileName", value);
      const fileUrl = propOr("", "Url", value);

      if (!fileName && !fileUrl) {
        this.setState({ fileList: [] });
        return;
      }

      const url = `${SERVER_PUBLIC_FOLDER}${fileUrl}?${Date.now()}`;
      let newState = Object.assign({}, this.state, {
        fileList: [
          {
            uid: value.ID || new Date().toString(),
            name: fileName,
            thumbUrl: url,
            rawItem: value,
            url,
          },
        ],
      });

      this.setState(newState);
    }
  };

  toggle = () => this.setState({ visible: !this.state.visible });

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.originFileObj) {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
        previewTitle: file.name,
      });
      return;
    }

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ file, fileList, ...params }) => {
    const {
      getResponse,
      onChange,
      mapFileToServerObjectFunc = mapFileToServerObjectDefaultFunc,
    } = this.props;
    const latestFile = file;

    if (onChange && isEmpty(latestFile)) {
      onChange(null);
      return;
    }

    if (latestFile.status === "done" && latestFile.response && onChange) {
      onChange(getResponse(latestFile.response));
      this.setState({
        disabled: false,
      });
      return;
    }

    if (latestFile.status === "removed" && onChange) {
      onChange(fileList.map(mapFileToServerObjectFunc));
    }

    // uploading, done, error, removed
    this.setState({ fileList, disabled: latestFile.status === "uploading" });

    if (!isEmpty(latestFile)) {
      getResponse && getResponse(latestFile.response);
    }
  };

  handleRemove = (file) => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure to remove this image?",
        onOk: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      visible,
      disabled,
    } = this.state;
    let { maxUpload, accept } = this.props;
    let props = { action: this.props.action, listType: "picture-card" };

    const uploadButton = (
      <div>
        <FcUpload size={36} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Modal
          okText="Yes"
          cancelText="No"
          visible={visible}
          onCancel={this.toggle}
        >
          Are you sure to delete this image?
        </Modal>
        <Upload
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          accept={accept}
          withCredentials={true}
          disabled={disabled}
          {...props}
        >
          {fileList.length >= maxUpload ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
