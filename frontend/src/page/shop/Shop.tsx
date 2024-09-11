import React, { useEffect, useState } from 'react';
import { getAllCourses } from '../../services/http'; 
import { Product } from './Product'; 
import { CourseInterface } from '../../interface/ICourse';

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="products-list">
      {courses.map((course) => (
        <Product
          key={course.ID}
          data={{
            ID: course.ID!,
            Name: course.Name || "No",
            Title: course.Title || 'ไม่มีชื่อ',
            Price: course.Price || 0,
            ProfilePicture: course.ProfilePicture || '', // Ensure Profile field is populated
          }}
        />
      ))}
    </div>
  );
};

export default CoursesList;
