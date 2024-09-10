// interface/ICart.ts
export interface CartInterface {
  CreateTime?: string;
  Price?: number;
  State?: string;
  UserID?: number;
  CourseID?: number;
}

export interface CartItemProps {
  data: {
    id: number;
    title: string;
    price: number;
    profile: string;
    productName: string;
  };
  onRemove: () => void;
}
