import React from 'react';
import { CartInterface } from '../../interface/ICart';

interface CartItemProps {
  data: {
    id: number;
    title: string;
    price: number;
    profile: string;
    productName: string;
  };
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ data, onRemove }) => {
  return (
    <div className='cart-item'>
      <img src={data.profile} alt={data.title} />
      <div className='item-details'>
        <h3>{data.productName}</h3>
        <p>{data.title}</p>
        <p>Price: ${data.price.toFixed(2)}</p>
        <button onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
};
