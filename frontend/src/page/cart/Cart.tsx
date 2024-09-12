import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Card } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
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
          const course = await getCourseById(cart.CourseID!);
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
      render: (text) => (
        <img alt="course" src={text} style={{ width: "150px" }} />
      ),
    },
    {
      title: "Delete",
      key: "Manage",
      render: (_, record) => (
        <Button
          onClick={() => handleDelete(record.CourseID!)}
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
      <div className="cart-payment">
        <Row gutter={16}>
          {/* Cart Course Section */}
          <Col span={12}>
            <div className="cart-course">
              <h2>
                <ShoppingOutlined /> Cart Course
              </h2>
              <Divider />
              <Card>
                <Table
                  rowKey="CourseID"
                  columns={columns}
                  dataSource={cartItems}
                  pagination={{ pageSize: 2 }} // Limit to 2 courses per page
                />
              </Card>
            </div>
          </Col>

          {/* Order Summary Section */}
          <Col span={12}>
            <div className="cart-order">
              <h2><FileDoneOutlined /> Order Summary</h2>
              <Divider />
              <Card>
                <p>ITEMS 3 Total: $590</p>
                <p>Item1: name1</p>
                <p>Item2: name2</p>
                <p>Item3: name3</p>
              </Card>
            </div><br />
            <Button>CHECKOUT</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Cart;
