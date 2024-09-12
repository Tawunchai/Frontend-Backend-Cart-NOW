import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, message, Card,Divider } from "antd";
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
              <h2>
                <FileDoneOutlined /> Order Summary
              </h2>
              <Divider />
              <Card>
                {cartItems.length === 0 ? (
                  <p>Your cart is empty. Keep shopping to find a course!</p>
                ) : (
                  <>
                    <p>
                      ITEMS {cartItems.length} :
                    </p>
                    {cartItems.map((item, index) => (
                      <p key={item.CourseID}>
                        {`${index + 1}. ${item.Title || "No Title"}`}
                      </p>
                    ))}
                    <p>
                      Total: $
                      {cartItems
                        .reduce((total, item) => total + (item.Price || 0), 0)
                        .toFixed(2)}
                    </p>
                  </>
                )}
              </Card>
            </div>
            <br />
            <Button style={{width: "200px",height:"40px",backgroundColor:"#4E6799",fontSize:"22px",color:"white"}}>CHECKOUT</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Cart;
