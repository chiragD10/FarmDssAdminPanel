import React, { useState, useEffect } from 'react';
import getParams from 'react-router-dom'
import axios from 'axios';
import { table } from 'console';

interface Props{
    id: number;
};
const CoursesTable: React.FC<Props> = ({id}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const token = localStorage.getItem('authToken');
  const base_url = process.env.REACT_APP_API_URI;

  useEffect(() => {
    const fetchCourses = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            creator_id: id
        };
        if (token) {
            try {
                // const response = await axios.post(base_url+'/courses/course/creator/', config, body);
                const response = await axios.post(base_url+'/courses/course/creator/', body, config);
                // console.log(response.data.message);
                setCourses(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    };

    fetchCourses();
}, [token]);

  return (
    <table className="min-w-full leading-normal">
        <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
            <tr>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    ID
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Title
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Language
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Amount
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Crrated Date Time
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Number Of User Subscribed
                </th>
                
            </tr>
        </thead>
        <tbody>
                        {Array.isArray(courses) && courses.map((course) => (
                            <tr key={course.id}>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.id}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.title.english}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.language}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.price}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(course.created_date).toLocaleString()}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.subscriber_no}</td>
                                
                            </tr>
                        ))}
                    </tbody>
            
    </table>
    // {/* <Pagination entries={courses.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination> */}
    
  );
};

export default CoursesTable;
