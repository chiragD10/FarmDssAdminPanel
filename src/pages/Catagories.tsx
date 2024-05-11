import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { FaShare, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import exportFromJSON from 'export-from-json'
const Catagories: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [catagories, setCatagories] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true);

    useEffect(() => {
        const fetchCatagory = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/courses/category/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCatagories(response.data.category);
                    console.log(response)
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }
        };

        fetchCatagory();
    }, []);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handleAddCategory = (event: any) => {
        setShowModal(true) ;
    }
    const handleCancelClick = (event: any) => {
        setShowModal(false) ;
    }
    const handleDownloadCSV = () => {
        const f = catagories
        const filename = 'course catagories'
        const exportType = exportFromJSON.types.csv
        exportFromJSON({data:f, fileName:filename, exportType})
    };
    

    const handleSortClick = (key: string) => {
        console.log(key)
        if (key === sortKey) {
            setSortOrder(!sortOrder);
        } else {
            setSortKey(key);
            setSortOrder(true); // Default to ascending order when changing sort key
        }
    };

    const sortedArray = [...catagories].sort((a, b) => {
        // Sorting logic based on sort key and sort order
        if (sortOrder) {
            // Ascending order
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            // Descending order
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const togglecoursecategoryStatus = async (categoryId: number, checked: boolean) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: categoryId,
            intent: 'CourseCategory',
        };
    
        try {
            const response = await axios.post(base_url+'/courses/course/go_live/', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setCatagories(catagories => catagories.map(category_ => {
                if (category_.id === categoryId) {
                    return { ...category_, go_live: checked };
                }
                return category_;
            }));
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            course_categoty_english: formData.get('course_category_english') as string,
            course_categoty_hindi: formData.get('course_category_hindi') as string,
            course_categoty_marathi: formData.get('course_category_marathi') as string
        };
    
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
    
        if (!token) {
            console.error("Token is not available. Make sure you're logged in.");
            return;
        }
    
        try {
            await axios.post(base_url + `/courses/category/add`, payload, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create offer:", error);
        }
        if (token) {
            try {
                const response = await axios.get(base_url+'/courses/category/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCatagories(response.data.category);
                console.log(response)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setShowModal(false);
        }
    };
    
    
  return (
    <div className='container mx-auto p-4'>
        <div className='text-xcodegold font-poppins font-semibold'>Course Catagory List</div>
        <div className='flex justify-between'>
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
            <div className='space-x-2'>
                <button
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                onClick={() =>  setShowModal(true) }
                > 
                   Add Category
                </button>
                <button
                onClick={handleDownloadCSV}
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                >
                    Download CSV
                </button>

            </div>
        </div>
        <div className='overflow-x-auto'>
            <table className="min-w-full leading-normal">
                <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                    <tr>
                        <th className="border px-4 py-2 text-gray-400 text-sm"  onClick={() => {handleSortClick('id')}}>
                            ID
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('name.english')}}>
                            Category English
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('name.hindi')}}>
                            Category Hindi
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm"onClick={() => {handleSortClick('name.marathi')}}>
                            Category Marathi
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm"  onClick={() => {handleSortClick('go_live')}} >
                            Status
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" >
                            Action
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('created_at')}}>
                            Created/Updated Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(sortedArray) && sortedArray.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage , sortedArray.length)).map((category, index) => (
                        <tr key={category[sortKey]}>
                            <td className="border px-4 py-2">{category.id}</td>
                            <td className="border px-4 py-2">{category.name.english}</td>
                            <td className="border px-4 py-2">{category.name.hindi}</td>
                            <td className="border px-4 py-2">{category.name.marathi}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                <label htmlFor="toggle-switch">
                                            <input type="checkbox" id="toggle-switch"
                                            checked={category.go_live}
                                            onChange={(e) => togglecoursecategoryStatus(category.id, e.target.checked)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                        </label>
                            </td>
                            <td className="flex justify-center items-center gap-4 border px-4 py-6 text-gray-900">
                                <MdDeleteForever 
                                    className="cursor-pointer text-gray-600 hover:text-gray-900" 
                                    title="Delete"
                                    // onClick={() => handleDeleteTopic(course.id)}
                                />
                                    <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" title="Share" />
                                </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(category.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Pagination entries={catagories.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
        {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10" onClick={handleClickOutside}>
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Catagory(English)</label>
                                <input
                                    className="mt-4 border border-gray-300 px-4 py-2 rounded w-full"
                                    placeholder="course category english"
                                    type="text"
                                    name="course_category_english"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Catagory(Hindi)</label>
                                <input
                                    className="mt-4 border border-gray-300 px-4 py-2 rounded w-full"
                                    placeholder="course category hindi"
                                    type="text"
                                    name="course_category_hindi"
                                />
                            </div> 
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Catagory(Marathi)</label>
                                <input
                                    className="mt-4 border border-gray-300 px-4 py-2 rounded w-full"
                                    placeholder="course category marathi"
                                    type="text"
                                    name="course_category_marathi"
                                />
                            </div>  
                            <div className="flex justify-between">
                                <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded w-full h-full">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </div>
  );
};

export default Catagories;
