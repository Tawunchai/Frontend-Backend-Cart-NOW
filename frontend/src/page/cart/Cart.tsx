import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, message, Card, Divider } from "antd";
import {
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
      title: "Course",
      dataIndex: "ProfilePicture",
      key: "ProfilePicture",
      render: (text) => (
        <img
          alt="course"
          src={text}
          style={{ width: "150px", height: "150px" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text) => (
        <span
          style={{ color: "#808080", fontWeight: "bolder", fontSize: "15px" }}
        >
          {text || "No Title"}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (text) => (
        <span style={{ color: "#D3AC2B", fontWeight: "bold" }}>
          ${text?.toFixed(2) || "0.00"}
        </span>
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
          <Col span={12}>
            <div className="cart-course">
              <h1>
                <ShoppingOutlined /> Cart Course
              </h1>
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
              <h1>
                <FileDoneOutlined /> Order Summary
              </h1>
              <Divider />
              <Card>
                {cartItems.length === 0 ? (
                  <p>Your cart is empty. Keep shopping to find a course!</p>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#363434",
                      }}
                    >
                      ITEMS {cartItems.length} :
                    </p>
                    {cartItems.slice(0, 3).map((item, index) => (
                      <p
                        style={{ fontSize: "16px", fontFamily: "initial" }}
                        key={item.CourseID}
                      >
                        {`${index + 1}. ${item.Title || "No Title"}`}
                      </p>
                    ))}
                    {cartItems.length > 3 && (
                      <p
                        style={{
                          fontSize: "16px",
                          fontFamily: "initial",
                          fontStyle: "normal",
                        }}
                      >
                        Other Courses...
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#D3AC2B",
                      }}
                    >
                      TOTAL : $
                      {cartItems
                        .reduce((total, item) => total + (item.Price || 0), 0)
                        .toFixed(2)}
                    </p>
                  </>
                )}
              </Card>
            </div>
            <br />
            <Button
              style={{
                width: "300px",
                height: "55px",
                backgroundColor: "#4E6799",
                fontSize: "22px",
                color: "white",
                fontWeight: "bolder",
              }}
            >
              CHECKOUT
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Cart;
