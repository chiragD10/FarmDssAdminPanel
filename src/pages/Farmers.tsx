import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import exportFromJSON from 'export-from-json';

const Farmers: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate,setStartDate] = useState('');;
    const [endDate,setEndDate] = useState('');

    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/users/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setUsers(response.data.data);
                    // console.log(response.data.data)
                } catch (error) {
                    console.error('Error fetching webinars:', error);
                }
            }
        };

        fetchUsers();
    }, []);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleDownloadCSV = () => {
        const f = users
        const filename = 'farmers'
        const exportType = exportFromJSON.types.csv
        exportFromJSON({data:f, fileName:filename, exportType})
    };
    const handleStartDate = (event: any) => {
        setStartDate(event.target.value);
    };
    const handleEndDate = (event: any) => {
        setEndDate(event.target.value);
    };
    const saveDates = () => {
        const startDate1=new Date(startDate);
        console.log("Start Date:", startDate1);
        const endDate1=new Date(endDate);
        console.log("End Date:", endDate1);
        const today = new Date();
        console.log("today Date:", today);
        console.log(filteredusers);
    };
    const filteredusers = users.filter((user) => {
        if(!startDate || !endDate)return true;
        const usercreated = new Date(user.created_at);
        const userlastseen = new Date(user.last_seen)
        const startDate1=new Date(startDate);
        const endDate1=new Date(endDate);
        if (usercreated>startDate1 && usercreated<endDate1) {
            return true;
        }
        return false;
    })
  return (
    <div className='container mx-auto p-4'>
        <div className='text-xcodegold font-poppins font-semibold'>All Users</div>

        <div className='grid grid-cols-3 py-4'>
            <select className="border border-gray-300 px-4 py-2 rounded" name="language" required>
                <option value="all_users">All Users</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
            </select>
        </div>

        <div className='grid grid-cols-6'>
            <input
                className="border border-gray-300 px-4 py-2 rounded mr-4"
                type="datetime-local"
                placeholder="Publish Date"
                name="publish_date"
                // value={startDate}
                onChange={handleStartDate}
                required
            />
            <input
                className="border border-gray-300 px-4 py-2 rounded mr-4"
                type="datetime-local"
                placeholder="Publish Date"
                name="publish_date"
                // value={endDate}
                onChange={handleEndDate}
                required
            />
            <button
                className="px-4 py-2 bg-xcodegold text-white rounded"
                style={{ top: '10px', right: '10px' }}
                onClick={saveDates}
            >
                Add Filter
            </button>
        </div>

        <div className='flex justify-between'>
            <div className='flex'>
                <div className="flex justify-between items-center mt-4 mb-4">
                    <div className="relative inline-block">
                        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
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
            <button
            onClick={handleDownloadCSV}
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
            >
                Download CSV
            </button>
        </div>

        <div className='overflow-x-auto'>
            <table className="min-w-full leading-normal">
                <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                    <tr>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            ID
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Username
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Email
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Phone Number
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            State
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Pincode
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Date Created
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Last Seen
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Profile
                        </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredusers) && filteredusers.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage , filteredusers.length)).map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.id}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.username}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.email}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.phone}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.country}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">1234</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(user.created_at).toLocaleString()}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(user.last_seen).toLocaleString()}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => {
                                        navigate(`/farmer/${user.id}`, {replace: true, state:{user}})
                                    }}
                                    value={user.id}
                                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none"
                                >
                                    View Profile
                                </button>
                            </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Pagination entries={filteredusers.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
        
    </div>
  );
};

export default Farmers;
