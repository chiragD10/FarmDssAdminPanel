import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { table } from 'console';

interface Props{
    id: number;
};

const WebinarTable:React.FC<Props> = ({id}) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [webinars, setWebinars] = useState<any[]>([]);
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;
  
    useEffect(() => {
      const fetchWebinars = async () => {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              }
          };
          const body = {
              id: id
          };
          if (token) {
              try {
                  // const response = await axios.post(base_url+'/courses/course/creator/', config, body);
                  const response = await axios.post(base_url+'/webinars/webinar/creator/', body, config);
                  // console.log(response.data.message);
                  setWebinars(response.data.webinars);
                  console.log(response.data.webinars)
              } catch (error) {
                  console.error('Error fetching categories:', error);
              }
          }
      };
  
      fetchWebinars();
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
                    Craeted Date Time
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Number Of User Subscribed
                </th>
                
            </tr>
        </thead>
        <tbody>
                        {Array.isArray(webinars) && webinars.map((webinar) => (
                            <tr key={webinar.id}>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{webinar.id}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{webinar.topic_english}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{webinar.language}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{webinar.amount}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(webinar.publish_date).toLocaleString()}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{webinar.subscriber_no}</td>
                                
                                
                            </tr>
                        ))}
                    </tbody>
    </table>
  );
};

export default WebinarTable;
