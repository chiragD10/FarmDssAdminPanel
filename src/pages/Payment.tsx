import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { FaAngleLeft, FaAngleRight, FaPlus } from 'react-icons/fa';
import OnlinePaymentsTable from './OnlinePaymentsTable';
import OfflinePaymentsTable from './OfflinePaymentsTable';
import Referral from './Referral';
import Wallet from './Wallet';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<any[]>([])
    const [offlinePayments, setOfflinePayments] = useState<any[]>([])
    const [courseId, setcourseId] = useState(0);
    const [filterByType, setfilterByType] = useState("webinar");
    const [startDate, setstartdate] = useState<Date>(new Date(0))
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;
    function getCurrentDate(){

        const currDate = new Date().toLocaleDateString()
        
        return currDate;
    }
    const [endDate, setendDate] = useState<Date>(new Date())
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/payments/online/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setPayments(response.data.data);
                    console.log(payments)
                    // console.log(response.data)
                    console.log(response.data.data)
                    // console.log(response.data.message)
                } catch (error) {
                    console.error('Error fetching creators:', error);
                }
            }
        };
        fetchPayments();

        const fetchOfflinePayments = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/payments/offline/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setOfflinePayments(response.data.data);
                    console.log(offlinePayments)
                    console.log(response.data.data)
                } catch (error) {
                    console.error('Error fetching creators:', error);
                }
            }
        };
        fetchOfflinePayments();

    }, [])

    const handleAddPayment = () => {
        navigate('/add-payment');
    };

    // const payments = new Array(30).fill(null);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    function renderComponent() {
        if(filterByType === "offline"){
            
            return <OfflinePaymentsTable payments={offlinePayments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage} currentPage={currentPage}/>
        }
        else if(filterByType === "referrals") {
            return <Referral startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/>
        }
        else if(filterByType === "wallet") {
            return <Wallet startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/>
        }
        else {
            return <OnlinePaymentsTable payments={payments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/>
        }
    }

    return (
        <div className="container mx-auto">
            <div className='text-xcodebblue font-poppins font-semibold mt-12 mb-4'>Payments</div>
            
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between mb-2">
                    <select
                        className="border border-gray-300 rounded py-2 px-4 text-gray-700 appearance-none w-1/3"
                        onChange={(e => {
                            setfilterByType(e.target.value)
                        })}
                        name="paymentHistoryType"
                        id="paymentHistoryType"
                    >
                        <option value="webinar">Webinar Payment History</option>
                        <option value="course">Course Payment History</option>
                        <option value="kbank">Knowledge Bank Payment History</option>
                        <option value="offline">Offline Payment History</option>
                        <option value="referrals">Referrals Commissions</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>

                <div className="flex flex-row space-x-2">
                    <input
                        type="date"
                        onChange={(event) => setstartdate(new Date(event.target.value))}
                        className="w-44 h-12 border border-gray-300 rounded py-2 px-4 text-gray-700"
                        placeholder="From Date"
                    />

                    <input
                        type="date"
                        onChange={(event) => setendDate(new Date(event.target.value))}
                        className="w-44 h-12 border border-gray-300 rounded py-2 px-4 text-gray-700"
                        placeholder="To Date"
                    />

                    <input
                        type="text"
                        className="w-44 h-12 border border-gray-300 rounded py-2 px-4 text-gray-700"
                        placeholder="Course ID"
                    />

                    <button
                        className="w-44 h-12 bg-xcodegold text-white rounded py-2 px-6"
                    >
                        Filter Data
                    </button>
                </div>
            </div>


            <div className='flex justify-between'>
                <div className='flex'>
                    <div className="flex justify-between items-center mt-4 mb-4">
                        <div className="relative inline-block">
                            <select onChange={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
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
                    <div className='mt-8 ml-4 font-poppins'>
                        Entries
                    </div>
                </div>
                <button
                    className="w-44 h-12 px-4 py-2 mt-4 bg-xcodegold text-white rounded focus:outline-none"
                >
                    Download CSV
                </button>
            </div>

            <div className='overflow-x-auto'>
                {renderComponent()}
                {/* {filterByType == "referral" ? <Referral payments={payments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/> : (filterByType === "offline" ? <OfflinePaymentsTable payments={payments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/> : <OnlinePaymentsTable payments={payments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/>)} */}
                {/* {filterByType === "offline" ? <OfflinePaymentsTable payments={offlinePayments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/> :  <OnlinePaymentsTable payments={payments} filterByType={filterByType} startDate={startDate} endDate={endDate} itemsPerPage={itemsPerPage}/>} */}
            </div>

            {/* <Pagination entries={payments.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination> */}
        </div>
    );
};

export default PaymentPage;
