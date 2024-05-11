import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import axios from "axios";
interface Wallet {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    wallet: number,
    created_at: Date
}
  
interface Props {
    startDate: Date;
    endDate: Date;
    itemsPerPage: number;
}
  
const Wallet: React.FC<Props> = ({ startDate, endDate, itemsPerPage }) => {
    const [showModal, setShowModal] = useState(false)
    const [walletId, setWalletId] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [change, setChange] = useState<number>(0);
    const [updatedBalance, setUpdatedBalance] = useState(walletBalance)
    const [wallets, setWallets] = useState<Wallet[]>()
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;

   
    useEffect(() => {
        const fetchWallets = async() => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/users/farmer/wallet/all', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log(response)
                    setWallets(response.data.data)
                    console.log(wallets)
                    
                } catch (error) {
                    console.error('Error fetching wallets', error);
                }
            }
        }
        fetchWallets()
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        const formData = new FormData(event.currentTarget);
    
        const payload = {
            'id' : walletId,
            'wallet' :  change
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
            await axios.post(`/users/farmer/wallet/update`, payload, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to set trasaction id", error);
        }
    };


    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setShowModal(false);
        }
    };

  return (
    <div>
    <table className="min-w-full leading-normal">
      <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
        <tr>
          <th className="border px-4 py-2 text-gray-400 text-sm">
                ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                User
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Email ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Date
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Txn. ID
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Mobile
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Balance
            </th>
            <th className="border px-4 py-2 text-gray-400 text-sm">
                Add Money
            </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(wallets) && wallets.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, wallets.length)).map((wallet) => (
          <tr key={wallet.id}>
            <td className="border px-4 py-2 text-gray-500">{wallet.id}</td>
            <td className="border px-4 py-2 text-gray-500">{wallet.first_name + " " + wallet.last_name}</td>
            <td className="border px-4 py-2 text-gray-500">{wallet.email}</td>
            <td className="border px-4 py-2 text-gray-500">{wallet.created_at.toLocaleString()}</td>
            <td className="border px-4 py-2 text-gray-500"></td>
            <td className="border px-4 py-2 text-gray-500">{wallet.phone}</td>
            <td className="border px-4 py-2 text-gray-500">{wallet.wallet}</td>
            <td className="border px-4 py-2 text-gray-500 flex justify-center items-center">
                <button className="bg-xcodegold text-white rounded p-1"
                    onClick={() => {
                        setWalletId(wallet.id)
                        setWalletBalance(wallet.wallet)
                        setUpdatedBalance(wallet.wallet + change)
                        setShowModal(true)
                    }}>
                    Load Balance
                </button>
            </td>

          </tr>
        ))}
      </tbody>
      {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10" onClick={handleClickOutside}>
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div className="text-xcodebblue font-poppins text-semibold text-xl">Load Balance</div>
                            <div className="text-xcodebblue font-poppins text-semibold text-base">User Name: </div>
                            <div className="text-xcodebblue font-poppins text-semibold text-base">Mobile Number: </div>
                            <div className="flex flex-col">
                                <label className="font-poppins text-xl text-semibold text-xcodebblue">Enter Amount</label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">Rs.</span>
                                    </div>
                                    <input type="value" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="1000.00"
                                        onChange={(event) => {
                                            // setChange(parseFloat(event.target.value))
                                            setChange(parseFloat(event.target.value));
                                            setUpdatedBalance(parseFloat(event.target.value) + walletBalance)
                                        }}
                                    />
                                    
                                </div>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <div className="flex flex-col border rounded justify-center items-center">
                                    <div className="font-poppins text-xcodebblue text-lg text-extrabold p-4">Current Balance</div>
                                    <div className="font-poppins text-xcodebblue text-3xl text-bold p-4">Rs. {walletBalance}</div>
                                </div>
                                <div className="flex flex-col border rounded justify-center items-center">
                                    <div className="font-poppins text-xcodebblue text-lg text-extrabold p-4">Updated Balance</div>
                                    <div className="font-poppins text-green-600 text-3xl text-bold p-4">Rs. {updatedBalance}</div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Remarks</span>
                                <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="" name="remarks"  />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded w-full h-full">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </table>
    <Pagination
        entries={wallets ? wallets.length : 0}
        ataTime={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Wallet;
