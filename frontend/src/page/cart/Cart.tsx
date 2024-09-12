import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message } from "antd";
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
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteCourseID, setDeleteCourseID] = useState<number | undefined>(undefined);

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

  const showModal = (courseID: number) => {
    setModalText(`คุณต้องการลบข้อมูลคอร์สที่มี ID "${courseID}" หรือไม่ ?`);
    setDeleteCourseID(courseID);
    setOpen(true);
  };

  const handleOk = async () => {
    if (deleteCourseID === undefined) return;

    setConfirmLoading(true);
    try {
      await deleteCart(deleteCourseID);
      setOpen(false);
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
      setOpen(false);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const columns: ColumnsType<CartWithCourse> = [
    {
      title: "ลำดับ",
      dataIndex: "CourseID",
      key: "CourseID",
    },
    {
      title: "ชื่อคอร์ส",
      dataIndex: "Title",
      key: "Title",
      render: (text) => text || "No Title",
    },
    {
      title: "ราคา",
      dataIndex: "Price",
      key: "Price",
      render: (text) => `$${text?.toFixed(2) || "0.00"}`,
    },
    {
      title: "รูปภาพ",
      dataIndex: "ProfilePicture",
      key: "ProfilePicture",
      render: (text) => <img alt="course" src={text} style={{ width: "100px", borderRadius: "15px" }} />,
    },
    {
      title: "จัดการ",
      key: "Manage",
      render: (_, record) => (
        <>
          <Button
            onClick={() => navigate(`/cart/edit/${record.CourseID}`)}
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}
          />
          <Button
            onClick={() => showModal(record.CourseID!)} // Ensure CourseID is defined
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลตะกร้า</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/cart/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มข้อมูลคอร์ส
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table rowKey="CourseID" columns={columns} dataSource={cartItems} />
      </div>
      <Modal
        title="ลบข้อมูล ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default Cart;
