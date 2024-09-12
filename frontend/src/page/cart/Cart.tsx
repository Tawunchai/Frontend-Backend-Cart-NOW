import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllCart, deleteCart, getCourseById } from "../../services/http";
import { CartInterface } from "../../interface/ICart";
import { Link, useNavigate } from "react-router-dom";

interface CartWithCourse extends CartInterface {
  Title?: string;
  Price?: number;
  ProfilePicture?: string;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartWithCourse[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const navigate = useNavigate();

  const getCartItems = async () => {
    try {
      const carts = await getAllCart();
      const cartWithCourses: CartWithCourse[] = await Promise.all(
        carts.map(async (cart) => {
          const course = await getCourseById(cart.CourseID!); // Assuming CourseID is always provided
          return {
            ...cart,
            Title: course.Title,
            Price: course.Price,
            ProfilePicture: course.ProfilePicture,
          };
        })
      );
      setCartItems(cartWithCourses);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to fetch cart items!",
      });
    }
  };

  const handleDelete = async (courseID: number) => {
    setConfirmLoading(true);
    try {
      await deleteCart(courseID);
      messageApi.open({
        type: "success",
        content: "Removed item from cart successfully",
      });
      getCartItems();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to remove cart item",
      });
    }
    setConfirmLoading(false);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const columns: ColumnsType<CartWithCourse> = [
    {
      title: "ID",
      dataIndex: "CourseID",
      key: "CourseID",
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text) => text || "No Title",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (text) => `$${text?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Picture",
      dataIndex: "ProfilePicture",
      key: "ProfilePicture",
      render: (text) => <img alt="course" src={text} style={{ width: "150px" }} />,
    },
    {
      title: "Delete",
      key: "Manage",
      render: (_, record) => (
        <Button
          onClick={() => handleDelete(record.CourseID!)} // Call handleDelete directly
          style={{ marginLeft: 10 }}
          shape="circle"
          icon={<DeleteOutlined />}
          size={"large"}
          danger
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>Cart Course</h2>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table rowKey="CourseID" columns={columns} dataSource={cartItems} />
      </div>
    </>
  );
}

export default Cart;
