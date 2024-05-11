import { useState } from "react";
import Pagination from "./Pagination";
interface Payment {
    id: number;
    username: string;
    course_name: string;
    transaction_id: string;
    email: string;
    amount: number;
    wallet_amount: number;
    razorpay_id: string;
    mobile: string;
    final_amount: number;
    payment_for: string;
    payment_type: string;
    expiry_date: Date;
    offer_amount: number;
    date: Date;
    offer_code: string;
}
  
interface Props {
    payments: Payment[];
    filterByType: string;
    startDate: Date;
    endDate: Date;
    itemsPerPage: number;
}
  
const OnlinePaymentsTable: React.FC<Props> = ({ payments, filterByType, startDate, endDate, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const filteredPayments: Payment[] = payments.filter((payment) => {
      return payment.payment_for === filterByType;
  });
  console.log(filteredPayments)
  return (
    <div>
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
                Course Name
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Transaction ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Email ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Course Amt.
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Wallet Amt.
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                RazorPay ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Mobile
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Amount
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Payment Type
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Expiry Date
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Offer Amt.
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Date
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Offer ID
            </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(filteredPayments) && filteredPayments.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, filteredPayments.length)).filter((payment) => {
          return (payment.payment_for === filterByType);
        }).map((payment) => (
          <tr key={payment.id}>
            <td className="border px-4 py-2 text-gray-500">{payment.id}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.username}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.course_name}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.transaction_id}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.email}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.amount}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.wallet_amount}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.razorpay_id}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.mobile}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.final_amount}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.payment_type}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.expiry_date.toLocaleString()}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.offer_amount}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.date.toLocaleString()}</td>
            <td className="border px-4 py-2 text-gray-500">{payment.offer_code}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination entries={filteredPayments.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
    </div>
  );
};

export default OnlinePaymentsTable;
