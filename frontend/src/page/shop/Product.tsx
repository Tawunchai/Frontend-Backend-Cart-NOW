import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from "../../context/shop_context";
import { createCart, deleteCart, getAllCart } from "../../services/http";
import { CartInterface } from "../../interface/ICart";
import { CourseInterface } from "../../interface/ICourse";

interface ProductProps {
  data: CourseInterface;
}

export const Product: React.FC<ProductProps> = (props) => {
  const { ID, Name, Title, Price, ProfilePicture } = props.data;

  const courseID = ID ?? -1;
  const coursePrice = Price ?? 0;

  const [cartItemAmount, setCartItemAmount] = useState<number>(0);
  const shopContext = useContext(ShopContext);

  useEffect(() => {
    const checkCart = async () => {
      try {
        const cartData = await getAllCart();
        const isInCart = cartData.some(item => item.CourseID === courseID);
        setCartItemAmount(isInCart ? 1 : 0);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    checkCart();
  }, [courseID]);

  if (!shopContext) {
    return null; // or a fallback UI
  }

  const { addToCart, removeFromCart, cartItems } = shopContext;

  const handleToggleCart = async () => {
    if (cartItemAmount > 0) {
      // Remove from cart
      removeFromCart(courseID);

      try {
        await deleteCart(courseID); // Call the delete API
        console.log('Cart item removed successfully');
      } catch (error) {
        console.error('Failed to remove cart item:', error);
      }
    } else {
      // Add to cart
      addToCart(courseID);

      const cartData: CartInterface = {
        CreateTime: new Date().toISOString(),
        Price: coursePrice,
        State: 'Pending',
        UserID: 1,
        CourseID: courseID,
      };

      try {
        await createCart(cartData);
        console.log('Cart created successfully');
      } catch (error) {
        console.error('Failed to create cart:', error);
      }
    }

    setCartItemAmount(cartItemAmount > 0 ? 0 : 1);
  };

  return (
    <div className="product">
      <img src= {ProfilePicture} alt="" />
      <h2>{Name}</h2>
      <h3>{Title}</h3>
      <p>Price: ${Price}</p>
      <button onClick={handleToggleCart}>
        {cartItemAmount > 0 ? 'Remove From Cart' : 'Add To Cart'}
      </button>
    </div>
  );
};
