import React, { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";

import Link from "components/Link";
import { ORDER_UPDATE } from "config/urls";
import { QUERY_ORDERS, DELETE_ORDER } from "api";
import { generateActionColumns } from "components/Table";
import { openConfirm } from "components/Form";
import { ORDER_STATUS } from "utils/constant";

const Orders = () => {
  let [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  let reload = async () => {
    setLoading(true);
    let data = await QUERY_ORDERS(null, { page: page, limit: 10 });
    // let data = fakeData;
    console.log(data);
    setResponse(data);
    setLoading(false);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={ORDER_UPDATE} params={{ id: text }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={ORDER_UPDATE} params={{ id: record.id }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Tag
          color={ORDER_STATUS?.find((x) => x.value === record?.status).color}
        >
          {ORDER_STATUS?.find((x) => x.value === record?.status).label}
        </Tag>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Ward",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Order item quantity",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Total original price",
      dataIndex: "totalOriginalSalePrice",
      key: "totalOriginalSalePrice",
    },
    {
      title: "Total sale price",
      dataIndex: "totalSalePrice",
      key: "totalSalePrice",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
              to: ORDER_UPDATE,
              params: { id: record?.id },
            },
            {
              inner: (
                <Button
                  size={"small"}
                  type={"danger"}
                  onClick={() => {
                    openConfirm({
                      title: "Do you want delete this order?",
                      action: async () => {
                        await DELETE_ORDER(record?.id);
                        let data = await QUERY_ORDERS(null, {
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
              params: { id: record?.id },
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
        <h1 className={"page-title"}>Orders</h1>
        {/* <Link to={ORDER_ADD}>
          <Button type="primary">Add</Button>
        </Link> */}
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

export default Orders;
