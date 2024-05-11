import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import SubscriptionTable from './SubscriptionTable';
import TransactionTable from './TransactionTable';

const FarmerProfile: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const location = useLocation()
    console.log(location)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tableType, setTableType] = useState<"Subscriptions" | "Transactions">("Subscriptions")
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;


    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handleTableType = (type: 'Transactions' | 'Subscriptions') => {
        setTableType(type);
    };


  return (
    <div className='container mx-auto p-4'>
        <div className='text-xcodebblue font-poppins font-semibold mb-4 mt-4'>User Profile</div>
        <div className='text-xcodebblue font-poppins font-semibold border border-xcodegrey mb-4'>
            <div className='grid grid-flow-col-dense grid-cols-4 grid-rows-2 p-4'>
                <div>Username: {location.state.user.username}</div>
                <div>DOB: {location.state.user.dob}</div>
                <div>Mobile: {location.state.user.phone}</div>
                <div>Email: {location.state.user.email}</div>
                <div></div>
                <div></div>
                <div>Wallet: {location.state.user.wallet}</div>
            </div>
            <div className='grid grid-flow-col-dense grid-cols-3 grid-rows-4 p-4 mb-8'>
                <div>Address:</div>
                <div>Village: {location.state.user.address.village}</div>
                <div>Tehsil: {location.state.user.address.tehsil}</div>
                <div>Country: {location.state.user.address.country}</div>
                <div>District: {location.state.user.address.district}</div>
                <div>Pincode: {location.state.user.address.pincode}</div>
                <div>State: {location.state.user.address.state}</div>
            </div>
        </div>
        <div className="flex justify-between items-center mb-4">
            <div>
                <button onClick={() => handleTableType('Transactions')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${tableType === 'Transactions' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Transactions</button>
                <button onClick={() => handleTableType('Subscriptions')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${tableType === 'Subscriptions' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Subscriptions</button>
            </div>
        </div>

        <div className='overflow-x-auto'>
            {tableType === "Subscriptions" ? <SubscriptionTable/> : <TransactionTable/>}
        </div>
        
    </div>
  );
};

export default FarmerProfile;
