import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface Props{
    id: number;
};

const WebinarPage: React.FC = () => {
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [webinars, setWebinars] = useState<any[]>([]);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;
    useEffect(() => {
        const fetchWebinars = async () => {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            try {
                const response = await axios.get(base_url+'/webinars/all/', config);
                setWebinars(response.data.webinars);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
            }
        };

        fetchWebinars();
    }, [token]);


    const handleAddWebinar = () => {
        navigate('/add-webinar');
    };

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    function zoomScreenshot(url: string){
        setViewScreenshot(true);
        setimgUrl(url)
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setViewScreenshot(!viewScreenshot);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddWebinar}
                className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-24 mr-12"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
                Add Webinar
            </button>

            <div className='flex'>
                <div className="flex justify-between items-center mt-4 mb-4">
                    <div className="relative inline-block">
                        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z"/></svg>
                        </div>
                    </div>
                </div>
                <div className='mt-8 ml-2 font-poppins'>
                    Entries
                </div>
            </div>

            {/* <div className="flex justify-between items-center mt-16 mb-4">
                <div>
                    <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                    <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div> */}

            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">
                                ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Cover Image
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Title (English)
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Description (English)
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Speaker
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Language
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Date & Time
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Subscription Amount
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Referral Amount
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Link
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Course ID
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {webinars.slice(0, itemsPerPage).map((webinar) => (
                            <tr key={webinar.id}>
                                <td className="border px-4 py-2 text-gray-900">{webinar.id}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                <img src={webinar.cover_image} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(webinar.cover_image)}/>
                            </td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.topic_english}</td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.description_english}</td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.speaker}</td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.language}</td>
                                <td className="border px-4 py-2 text-gray-900">{new Date(webinar.publish_date).toLocaleString()}</td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.amount}</td>
                                <td className="border px-4 py-2 text-gray-900">{webinar.referral_amount}</td>
                                <td className="border px-4 py-2 text-gray-900">
                                    <a href={webinar.link} target="_blank" rel="noopener noreferrer">Link</a>
                                </td>
                                <td className="border px-4 py-2 text-gray-900">{/* Course ID */}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                {viewScreenshot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center items-center z-10" onClick={handleClickOutside}>
        <div className="bg-white p-8 rounded-lg shadow-xl">
            <img className='object-cover w-80 h-80' src={String(imgUrl)} alt="" />
        </div>
    </div>
      )}
            </div>
        </div>
    );
};

export default WebinarPage;
