import React, { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";
import moment from "moment";

import Link from "components/Link";
import { USER_UPDATE, USER_ADD } from "config/urls";
import { QUERY_USERS } from "api";
import { GENDER, DATE_FORMAT } from "utils/constant";
import { generateActionColumns } from "components/Table";

const Users = () => {
  let [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  let reload = async () => {
    setLoading(true);
    let res = await QUERY_USERS(null, { page, limit: 10 });
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
        <Link to={USER_UPDATE} params={{ id: text }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={USER_UPDATE} params={{ id: record?.id }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text, record) => <Tag>{GENDER[text - 1]?.name}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (text, record) => moment(text).format(DATE_FORMAT),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    // {
    //   title: "Display To User",
    //   dataIndex: "displayToUser",
    //   key: "displayToUser",
    //   render: (text, record) => <Checkbox disabled defaultChecked={text} />,
    // },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (text, record) => (
        <div>
          {text?.map((role) => (
            <div key={role?.id}>
              <Tag>{role?.name}</Tag>
            </div>
          ))}
        </div>
      ),
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
              to: USER_UPDATE,
              params: { id: record?.id },
            },
            // {
            //   inner: (
            //     <Button size={"small"} type={"danger"}>
            //       Delete
            //     </Button>
            //   ),
            //   to: "#",
            //   params: { id: record?.id },
            //   onClick: async (event) => {
            //     event.preventDefault();
            //     handleDelete({
            //       t,
            //       deleteAction: DELETE_INGREDIENTS,
            //       params: { id: record.ID },
            //       reload,
            //     });
            //   },
            // },
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
        <h1 className={"page-title"}>Users</h1>
        <Link to={USER_ADD}>
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

export default Users;
