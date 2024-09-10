import { CourseInterface } from "../../interface/ICourse";
import { CartInterface } from "../../interface/ICart";

const apiUrl = "http://localhost:8000";

export const getAllCourses = async (): Promise<CourseInterface[]> => {
  try {
    const response = await fetch(`${apiUrl}/courses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as CourseInterface[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const createCart = async (cart: CartInterface) => {
  try {
    const response = await fetch(`${apiUrl}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

export const deleteCart = async (courseID: number) => {
  try {
    const response = await fetch(`${apiUrl}/carts/course/${courseID}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
};

// New function to get all cart items
export const getAllCart = async (): Promise<CartInterface[]> => {
  try {
    const response = await fetch(`${apiUrl}/carts`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.carts as CartInterface[];
  } catch (error) {
    console.error("Error fetching carts:", error);
    throw error;
  }
};

// services/http.ts
export const getCourseById = async (id: number): Promise<CourseInterface> => {
  try {
    const response = await fetch(`${apiUrl}/courses/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as CourseInterface;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

