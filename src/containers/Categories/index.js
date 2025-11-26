import React, { useEffect, useState } from "react";
import { Table, Button, Checkbox } from "antd";
import moment from "moment";

import Link from "components/Link";
import { CATEGORY_ADD, CATEGORY_UPDATE } from "config/urls";
import { QUERY_CATEGORIES, DELETE_CATEGORY } from "api";
import { openConfirm } from "components/Form";
import { generateActionColumns } from "components/Table";
import { DATE_FORMAT } from "utils/constant";
const Categories = () => {
  let [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // TODO:Lấy data
  let reload = async () => {
    setLoading(true);
    let res = await QUERY_CATEGORIES(null, { page: page, limit: 10 });
    // let data = fakeData;
    console.log(res);
    setResponse(res);
    setLoading(false);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={CATEGORY_UPDATE} params={{ id: text }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={CATEGORY_UPDATE} params={{ id: record.id }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Display To User",
      dataIndex: "displayToUser",
      key: "displayToUser",
      render: (text, record) => <Checkbox disabled defaultChecked={text} />,
    },
    {
      title: "Show To Footer",
      dataIndex: "showToFooter",
      key: "showToFooter",
      render: (text, record) => <Checkbox disabled defaultChecked={text} />,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => moment(text).format(DATE_FORMAT),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text, record) => moment(text).format(DATE_FORMAT),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return generateActionColumns({
          actions: [
            {
              inner: (
                <Button size={"small"} type={"ghost"}>
                  View
                </Button>
              ),
              to: CATEGORY_UPDATE,
              params: { id: record.id },
            },
            {
              inner: (
                <Button
                  size={"small"}
                  type={"danger"}
                  onClick={() => {
                    openConfirm({
                      title: "Do you want delete category?",
                      action: async () => {
                        await DELETE_CATEGORY(record?.id);
                        let data = await QUERY_CATEGORIES(null, {
                          page: page,
                          limit: 10,
                        });
                        setResponse(data);
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              ),
              to: "#",
              params: { id: record.id },
              onClick: async (event) => {
                event.preventDefault();
                // handleDelete({
                //   t,
                //   deleteAction: DELETE_INGREDIENTS,
                //   params: { id: record.ID },
                //   reload,
                // });
              },
            },
          ],
        });
      },
    },
  ];

  useEffect(() => {
    (async () => {
      await reload();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div className={"flex-between"}>
        <h1 className={"page-title"}>Categories</h1>
        <Link to={CATEGORY_ADD}>
          <Button type="primary">Add</Button>
        </Link>
      </div>
      <Table
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={response?.data}
        pagination={{
          total: response?.total,
          pageSize: response?.limit,
          current: page,
          onChange: (value) => setPage(value),
        }}
      />
    </div>
  );
};

export default Categories;
