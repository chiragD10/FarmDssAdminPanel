import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
interface Offer {
    id : number,
    offer_name : string
    offer_code : string,
    discount : number,
    minimum_order : number,
    maximum_order : number,
    maximum_discount : number,
    user_id : number,
    date : Date,
    active_till : Date,
    allowed_per_user : number,
    active : boolean
}
const Offers: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [offers, setOffers] = useState<any[]>([])
    const token = localStorage.getItem('authToken');
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;

    useEffect(() => {
        const fetchOffers = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/offers/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setOffers(response.data.data);
                } catch (error) {
                    console.error('Error fetching webinars:', error);
                }
            }
        };

        fetchOffers();
    }, []);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handleAddOffer = (event: any) => {
        setShowModal(true) ;
    }
    const handleCancelClick = (event: any) => {
        setShowModal(false) ;
    }
    const handleToggleChange = async (checked: boolean, offerId: number) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: offerId,
            intent: 'Offer',
        };

        try {
            const response = await axios.put(base_url+'/offers/offer/live', body, config);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    
        const payload = {
            //id: parseInt(formData.get('id') as string),
            offer_name: formData.get('offer_name') as string,
            offer_code: formData.get('offer_code') as string,
            discount: parseFloat(formData.get('discount') as string),
            minimum_order: parseFloat(formData.get('minimum_order') as string),
            maximum_order: parseFloat(formData.get('maximum_order') as string),
            maximum_discount: parseFloat(formData.get('maximum_discount') as string),
            user_id: parseInt(formData.get('user_id') as string),
            date: formData.get('date') as string, 
            active_till: formData.get('active_till') as string, 
            allowed_per_user: parseInt(formData.get('allowed_per_user') as string),
            active: false 
        };
    
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        };
    
        if (!token) {
            console.error("Token is not available. Make sure you're logged in.");
            return;
        }
    
        try {
            await axios.post(base_url+`/offers/offer/add/`, payload, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create offer:", error);
        }
        if (token) {
            try {
                const response = await axios.get(base_url+'/offers/all/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setOffers(response.data.data);
            } catch (error) {
                console.error('Error fetching webinars:', error);
            }
        }
    };
    


  return (
    <div className='container mx-auto p-4'>
        <div className='text-xcodegold font-poppins font-semibold'>Offers</div>
        <button
            onClick={handleAddOffer}
            className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
            Add Offer
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

        <div className='overflow-x-auto'>
            <table className="min-w-full leading-normal">
                <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                    <tr>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            ID
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Offer Name
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Offer Code
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Discount %
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Live
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Minimum Order
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Maximum Order
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Maximum Discount
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Module Type
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Module IDs
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            User IDs
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(offers) && offers.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, offers.length)).map((offer) => (
                        <tr key={offer.id}>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.id}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.offer_name}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.offer_code}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.discount}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                <label htmlFor="toggle-switch">
                                    <input type="checkbox" id="toggle-switch"
                                    checked={offer.active}
                                    onChange={(e) => handleToggleChange(e.target.checked, offer.id)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                </label>
                            </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.minimum_order}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.maximum_order}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.maximum_discount}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.module_type}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.module_ids}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{offer.user_ids}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(offer.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Pagination entries={offers.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
        {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Offer</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Offer Name</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Offer Name"
                                        type="text"
                                        name="offer_name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="discount percent"
                                        type="number"
                                        step=".01"
                                        name="discount"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Allowed per User</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Number of times"
                                        type="number"
                                        name="allowed_per_user"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minimum Purchase Amount</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="minimum purchase amount"
                                        type="number"
                                        name="minimum_order"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Maximum Purchase Amount</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="minimum purchase amount"
                                        type="number"
                                        name="maximum_order"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minimum Discount</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="maximum discount"
                                        type="number"
                                        step=".01"
                                        name="maximum_discount"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Module Type</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="module_type" required>
                                        <option value="webinar">webinar</option>
                                        <option value="course">course</option>
                                        <option value="kbank">kbank</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Active Till</label>
                                    <input
                                        className="border border-gray-300 px-4 py-2 rounded"
                                        type="datetime-local"
                                        name="active_till"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        className="border border-gray-300 px-4 py-2 rounded"
                                        type="datetime-local"
                                        name="date"
                                        required
                                    />
                                </div>
                               
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Module IDs</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Module Ids (all if empty)"
                                        type="text"
                                        name="module_ids"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User IDs</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="User IDs (all if empty)"
                                        type="text"
                                        name="user_ids"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Offer Code</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="offer code"
                                        type="text"
                                        name="offer_code"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    className="px-4 py-2 text-xcodegold rounded border border-xcodegold"
                                >
                                    Cancel
                                </button>
                                
                                <div className="flex gap-4 items-center">
                                    <input className="px-4 py-2 bg-xcodegold text-white rounded" type="submit" value="Submit"></input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </div>
  );
};

export default Offers;
