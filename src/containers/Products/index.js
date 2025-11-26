import React, { useEffect, useState } from "react";
import { Table, Button, Checkbox } from "antd";

import Link from "components/Link";
import { PRODUCT_UPDATE, PRODUCT_ADD } from "config/urls";
import { QUERY_PRODUCTS, DELETE_PRODUCT } from "api";
import { generateActionColumns } from "components/Table";
import { openConfirm } from "components/Form";
const Products = () => {
  let [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  let reload = async () => {
    setLoading(true);
    let data = await QUERY_PRODUCTS(null, { page: page, limit: 10 });
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
        <Link to={PRODUCT_UPDATE} params={{ id: text }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={PRODUCT_UPDATE} params={{ id: record.id }}>
          {text}
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
          src={process.env.REACT_APP_BACKEND_URL + "/" + text}
          alt={record?.name}
        />
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Show To Home",
      dataIndex: "showToHome",
      key: "showToHome",
      render: (text, record) => <Checkbox disabled defaultChecked={text} />,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => text?.name,
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
              to: PRODUCT_UPDATE,
              params: { id: record?.id },
            },
            {
              inner: (
                <Button
                  size={"small"}
                  type={"danger"}
                  onClick={() => {
                    openConfirm({
                      title: "Do you want delete product?",
                      action: async () => {
                        await DELETE_PRODUCT(record?.id);
                        let data = await QUERY_PRODUCTS(null, {
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
        <h1 className={"page-title"}>Products</h1>
        <Link to={PRODUCT_ADD}>
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

export default Products;
