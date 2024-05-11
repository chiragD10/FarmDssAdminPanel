import axios from "axios";
import { useState, useEffect } from "react";
interface Props {
    startDate: Date;
    endDate: Date;
    itemsPerPage: number;
}
  
const Referral: React.FC<Props> = ({ startDate, endDate, itemsPerPage }) => {

    const [referrals, setReferrals] = useState<any>([])
    const [showModal, setShowModal] = useState(false);
    const [referral, setreferral] = useState(0);
    const base_url = process.env.REACT_APP_API_URI;

    useEffect(() => {
        const fetchReferrals = async() => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/referrals/referral/transaction/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setReferrals(response.data.data)
                    console.log(referral)
                    
                } catch (error) {
                    console.error('Error fetching referrals', error);
                }
            }
        }
        fetchReferrals()
    }, [])

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setShowModal(false);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedReferral = parseInt(formData.get('referral_amount') as string);
        setreferral(updatedReferral);
        setShowModal(false);
    };
  return (
    <div>
        <div className="px-4 py-2 text-white rounded border mt-24 mr-12" style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <div className="flex flex-col justify-center items-center">
                <div className="font-poppins text-xcodebblue text-lg text-extrabold p-1">Current Referral Amount</div>
                <div className="font-poppins text-xcodebblue text-3xl text-bold p-1">Rs. {referral}</div>
                <div className="font-poppins text-xcodebblue text-sm text-bold p-1">Each referral code will recieve Rs. 100 in your user's wallet</div>
                <button className="bg-xcodegold text-white rounded px-4 py-2" onClick={() => {setShowModal(true)}}>Update Amount</button>
            </div>
        </div>
    <table className="min-w-full leading-normal">
      <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
        <tr>
          <th className="border px-4 py-2 text-gray-400 text-sm">
                ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Name
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Referral User Name
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Date
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Mobile
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Ref. User Mobile
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Amount
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Email ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Ref. Email ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Description
            </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(referrals) && referrals.slice(0, itemsPerPage).map((ref) => (
          <tr key={ref.id}>
            <td className="border px-4 py-2 text-gray-500">{ref.id}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.referral_name}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.ref_username}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.date.toLocaleString()}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.mobile}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.ref_mobile}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.amount}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.email}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.ref_email}</td>
            <td className="border px-4 py-2 text-gray-500">{ref.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10" onClick={handleClickOutside}>
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form className='space-y-4 flex flex-col' onSubmit={handleSubmit}>
                            <label className="text-xl text-xcodebblue text-semibold font-poppins">Update Referral Amount</label>
                            <input className="border border-gray-300 px-4 py-2 rounded" type="number" placeholder="" name="referral_amount" required />
                            <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded">Update Referral Amount</button>
                        </form>
                    </div>
                </div>
            )}
    </div>
  );
};

export default Referral;
