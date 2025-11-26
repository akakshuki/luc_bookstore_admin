import { pathOr, propOr } from "ramda";
import { createFileName } from "../../utils/utils";

const NOOP = () => {};

class CustomUploadAdapter {
  constructor(loader, config) {
    this.loader = loader;

    this.getUploadURL = propOr(NOOP, "getUploadURL", config);
    this.onUploadDone = propOr(NOOP, "onUploadDone", config);
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", this.getUploadURL(), true);
    xhr.responseType = "json";
    xhr.withCredentials = false;
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: this.onUploadDone(response),
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("name", createFileName(file.name));
    this.xhr.send(data);
  }
}

function CustomUploadAdapterPlugin(editor) {
  const config = pathOr({}, ["config", "_config", "customUploadImage"], editor);
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader, config);
  };
}

export { CustomUploadAdapterPlugin };
