import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shop_context';
import { CartItem } from './CartItem';
import { getAllCart, deleteCart, getCourseById } from '../../services/http';
import { CartInterface } from '../../interface/ICart';
import { CourseInterface } from '../../interface/ICourse';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const Cart: React.FC = () => {
  const shopContext = useContext(ShopContext);
  const [cartItemsData, setCartItemsData] = useState<CartInterface[]>([]);
  const [courses, setCourses] = useState<{ [key: number]: CourseInterface }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getAllCart();
        setCartItemsData(cartData);

        // Fetch course details for each course ID in the cart
        const coursePromises = cartData.map(item => getCourseById(item.CourseID!));
        const coursesData = await Promise.all(coursePromises);

        // Map course data to their IDs
        const coursesMap = coursesData.reduce((acc, course) => {
          if (course.ID) {
            acc[course.ID] = course;
          }
          return acc;
        }, {} as { [key: number]: CourseInterface });

        setCourses(coursesMap);
      } catch (error) {
        console.error("Error fetching cart data or course details:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleRemove = async (courseID: number) => {
    try {
      await deleteCart(courseID); // Call the delete API
      shopContext?.removeFromCart(courseID); // Update context
      setCartItemsData(prev => prev.filter(item => item.CourseID !== courseID));
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  if (!shopContext) {
    return null; // or a fallback UI
  }

  const { getTotalCartAmount } = shopContext;

  // Calculate the total amount based on the latest course prices
  const totalAmount = cartItemsData.reduce((total, item) => {
    const course = courses[item.CourseID!];
    const price = course?.Price ?? 0; // Use nullish coalescing to default to 0 if price is undefined
    return total + price;
  }, 0);

  return (
    <div className='cart'>
      <div className='top-text'>
        <h1>Course Cart</h1>
      </div>
      <div className='cart-items'>
        {cartItemsData.map((item) => {
          const course = courses[item.CourseID!]; // Get course details
          if (course) {
            return (
              <CartItem
                key={item.CourseID}
                data={{
                  id: item.CourseID!,
                  title: course.Title || "No Title",
                  price: course.Price ?? 0, // Use nullish coalescing to default to 0 if price is undefined
                  profile: course.ProfilePicture || 'Course Image URL',
                  productName: course.Name || 'Product Name',
                }}
                onRemove={() => handleRemove(item.CourseID!)}
              />
            );
          }
          return null;
        })}
      </div>
      <div className='total'>
        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
      </div>
      <button className='checkout-button' onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
