import React, { useEffect, useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/vi";

import { CustomUploadAdapterPlugin } from "./CustomUpload";
import "./style.css";

import { SERVER_PUBLIC_FOLDER } from "api/configRequest";

DecoupledEditor.defaultConfig = {
  extraPlugins: [CustomUploadAdapterPlugin],
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
  },
  fontFamily: {
    options: [
      "default",
      "Ubuntu, Arial, sans-serif",
      "Ubuntu Mono, Courier New, Courier, monospace",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:alignLeft",
      "imageStyle:full",
      "imageStyle:alignCenter",
      "imageStyle:alignRight",
      "|",
      "imageTextAlternative",
    ],
    styles: ["full", "alignLeft", "alignCenter", "alignRight"],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

const defaultItems = [
  "heading",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "|",
  "fontFamily",
  "fontSize",
  "alignment",
  "fontColor",
  "fontBackgroundColor",
  "|",
  "link",
  "bulletedList",
  "numberedList",
  "blockQuote",
  "undo",
  "redo",
  "|",
  "insertTable",
];

export default function Index(props) {
  const {
    uploadFileType = "",
    showImageUpload = false,
    showMediaEmbed = false,
  } = props;
  const [value, setValue] = useState("");
  const editorRef = useRef();

  const mediaItems = [];

  if (showImageUpload) {
    mediaItems.push("imageUpload");
  }

  if (showMediaEmbed) {
    mediaItems.push("mediaEmbed");
  }

  useEffect(() => {
    if (!editorRef.current || !editorRef.current.editor) {
      return;
    }

    const currentValue = editorRef.current.editor.getData();
    const newValue = props.data || props.value;

    if (newValue !== currentValue) {
      setValue(newValue || "");
    }
  }, [props.data, props.value]);

  const handleGetUploadURL = () =>
    `${SERVER_PUBLIC_FOLDER}/${uploadFileType}/upload`;

  const handleUploadDone = (response) => {
    return `${SERVER_PUBLIC_FOLDER}/${response?.name}`;
  };

  return (
    <CKEditor
      ref={editorRef}
      editor={DecoupledEditor}
      data={value}
      onReady={(editor) => {
        editor.ui
          .getEditableElement()
          .parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
          );

        props.onInit && props.onInit(editor);
      }}
      config={{
        language: "vi",
        toolbar: {
          items: [...defaultItems, ...mediaItems],
        },
        customUploadImage: {
          getUploadURL: handleGetUploadURL,
          onUploadDone: handleUploadDone,
        },
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.onChange && props.onChange(data);
      }}
      onBlur={(event, editor) => {
        // console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        // console.log('Focus.', editor);
      }}
    />
  );
}
