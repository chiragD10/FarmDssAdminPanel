import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { Url } from 'url';

interface Payment {
  activated_on: Date;
  amount: string;
  date: Date;
  id: number;
  mobile: string;
  module_name: string;
  payment_for: string;
  receipt_date: Date;
  screenshot: string;
  status: string;
  transaction_id: string;
  username: string;
}

interface Props {
    payments: Payment[];
    filterByType: string;
    startDate: Date;
    endDate: Date;
    itemsPerPage: number;
    currentPage: number
}

const OfflinePaymentsTable: React.FC<Props> = ({ payments, filterByType, startDate, endDate, itemsPerPage}) => {
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "approved" | "rejected">("pending");
    const [paymentId, setPaymentId] = useState<Number>(0);
    const [showModal, setShowModal] = useState(false)
    // const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;

    const handleApprovePayment = async (id: Number) => {
        const payload = {
            'id': id
        };
    
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        };
        // const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axios.post(base_url+'/payments/offline/approve/', payload, config);
                setPaymentStatus("approved")
                setPaymentId(id)
            } catch (error) {
                console.error('Error updatting payment status', error);
            }
        }
        
    };
    const handleRejectPayment = async (id: Number) => {
        const payload = {
            'id': id
        };
    
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        };
        // const token = localStorage.getItem('authToken')
        if (token) {
            try {
                const response = await axios.post(base_url+'/payments/offline/reject/', payload, config);
                setPaymentStatus("rejected")
            
            } catch (error) {
                console.error('Error updatting payment status', error);
            }
        }
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setViewScreenshot(!viewScreenshot);
        }
    };

    function zoomScreenshot(url: string){
        setViewScreenshot(true);
        setimgUrl(url)
    }

    const submitTransactionId = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    
        const payload = {
            'id' : paymentId,
            'transaction_id' : parseInt(formData.get('transaction_id') as string),
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
            await axios.post(base_url+`/payments/offline/transaction/`, payload, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to set trasaction id", error);
        }
    };

  return (
    <div>
      <table className="min-w-full leading-normal">
        <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
          <tr>
            <th className="border px-4 py-2 text-gray-400 text-sm">ID</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">User</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Date</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Module Type</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Module Name</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Mobile</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Amount</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Transaction ID</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Receipt Date</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Activated On</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Screenshot</th>
            <th className="border px-4 py-2 text-gray-400 text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(payments) && payments.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, payments.length)).map((payment) => (
            <tr key={payment.id}>
              <td className="border px-4 py-2 text-gray-500">{payment.id}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.username}</td>
              <td className="border px-4 py-2 text-gray-500">{new Date(payment.date).toLocaleString()}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.payment_for}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.module_name}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.mobile}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.amount}</td>
              <td className="border px-4 py-2 text-gray-500">{payment.transaction_id}</td>
              <td className="border px-4 py-2 text-gray-500">{new Date(payment.receipt_date).toLocaleString()}</td>
              <td className="border px-4 py-2 text-gray-500">{new Date(payment.activated_on).toLocaleString()}</td>
              <td className="border px-4 py-2 text-gray-500">
                <img src={payment.screenshot} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(payment.screenshot)}/>
              </td>
              <td className="border px-4 py-2 text-gray-500">
                {payment.status === "pending" ? <div className='flex space-x-1'>
                                                    <button className='p-2 bg-xcodegold text-white rounded' onClick={() => {
                                                        handleApprovePayment(payment.id)
                                                        setShowModal(true)
                                                    }}>
                                                        Approve
                                                    </button>
                                                    <button className='p-2 bg-red-500 text-white rounded' onClick={() => handleRejectPayment(payment.id)}>
                                                        Reject
                                                    </button>
                                                </div> : <div className='inset-0'>
                                                            <button className={`p-2 rounded ${payment.status === 'approved' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                                                {payment.status}
                                                            </button>
                                                        </div> 
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewScreenshot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <img className='object-center w-1/2 h-1/2' src={String(imgUrl)} alt="" />
            </div>
        </div>
      )}
      {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={submitTransactionId} className='space-y-4'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Add Transaction ID</label>
                                <input
                                    className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                    placeholder="Enter Transaction ID"
                                    type="text"
                                    name="transaction_id"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 items-center">
                                <input className="px-4 py-2 bg-xcodegold text-white rounded" type="submit" value="Submit"></input>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Pagination entries={payments.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
    </div>
  );
};

export default OfflinePaymentsTable;
