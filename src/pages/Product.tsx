import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
interface BrandName {
    id: number;
    name: {
        english: string;
        hindi?: string;
        marathi?: string;
    };
    company: string;
    activity: string;
    description: {
        english: string;
        hindi?: string;
        marathi?: string;
    };
    dosage: {
        english: string;
        hindi?: string;
        marathi?: string;
    };
    customer_care_number: string;
}
const companyNames = [
    "Bayer Crop Science",
    "Dhanuka Agritech",
    "FMC India Pvt Ltd",
    "Adama India Pvt Ltd",
    "UNiversal Biocon Pvt Ltd",
    "Wolkus Technologies Solution Pvt Ltd",
    "ICL Group Ltd",
    "SK Biobiz Pvt Ltd",
    "Scient Chemicals Pvt Ltd",
    "Synergy Crop Solutions",
    "Delight Agro Industries",
    "Mahikaa Biologicals",
    "Pranam Agrotech",
    "Raccolto Agritech",
    "Vijaya Agro Industries",
    "Far East Offshore Heavy Engineering",
    "JivAgro Limited",
    "Nature Care Fertilizers Pvt Ltd"
];
const activityType = [
    "Spray",
    "Drip",
    "Drenching",
    "Soil Application",
    "Agronomical Practices",
    "Pasting"
];
export default function Product() {
    const { technicalnameId } = useParams();
    const [showProduct, setShowProduct] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [activityTypes, setActivityTypes] = useState('');
    const [priorityOrder, setPriorityOrder] = useState('');
    const [brandNameEnglish, setBrandNameEnglish] = useState('');
    const [brandNameHindi, setBrandNameHindi] = useState('');
    const [brandNameMarathi, setBrandNameMarathi] = useState('');
    const [dosageEnglish, setDosageEnglish] = useState('');
    const [dosageHindi, setDosageHindi] = useState('');
    const [dosageMarathi, setDosageMarathi] = useState('');
    const [descriptionEnglish, setDescriptionEnglish] = useState('');
    const [descriptionHindi, setDescriptionHindi] = useState('');
    const [descriptionMarathi, setDescriptionMarathi] = useState('');
    const [customerCareNumber, setCustomerCareNumber] = useState('');
    const token = localStorage.getItem('authToken');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [brandnames, setBrandNames] = useState<BrandName[]>([]);
    const base_url = process.env.REACT_APP_API_URI;
    const navigate = useNavigate();
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleProductClick = () => {
        setShowProduct(true);
    };
    const handleCancelClick = () => {
        setShowProduct(false);
    };
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = {
            technical_name_id: technicalnameId,
            name_english: brandNameEnglish,
            name_hindi: brandNameHindi,
            name_marathi: brandNameMarathi,
            company: companyName,
            activity: activityTypes,
            order: parseInt(priorityOrder, 10),
            dosage_english: dosageEnglish,
            dosage_hindi: dosageHindi,
            dosage_marathi: dosageMarathi,
            description_english: descriptionEnglish,
            description_hindi: descriptionHindi,
            description_marathi: descriptionMarathi,
            customer_care_number: customerCareNumber,
        };
        try {
            const response = await fetch(base_url+'/kbank/crops/technicalnames/brand/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);
            setShowProduct(false);
        } catch (error) {
            console.error('Failed to submit form: ', error);
        }
    };
    useEffect(() => {
        const fetchTechnicalNames = async () => {
            if (token && technicalnameId) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    const response = await axios.post(base_url+`/kbank/crops/technicalnames/brand/`, { id: technicalnameId }, config);
                    setBrandNames(response.data.brands.brands);
                    console.log(brandnames)
                } catch (error) {
                    console.error('Error fetching technical names:', error);
                }
            }
        };

        fetchTechnicalNames();
    }, [token, technicalnameId]);
    const handleProductFileClick = (id:any) => {
        navigate(`/add-product-file/${id}`);
    };
    const location = useLocation()
    return (
        <div>
            <div className="container mx-auto p-4">
                <div className='text-xcodebblue font-poppins font-semibold mt-4'>{location.state.crop_name} &gt; {location.state.topic_name} &gt; {location.state.subtopic_name} &gt; {location.state.technicalName}</div>
                <div>
                    <button
                        className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12 mr-44"
                        style={{ position: 'absolute', top: '10px', right: '130px' }}
                    >
                        Upload CSV
                    </button>
                    <button
                        onClick={handleProductClick}
                        className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12 mr-32"
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                    >
                        Add Product
                    </button>
                </div>

                <div className='flex'>
                    <div className="flex justify-between items-center mt-2 mb-4">
                        <div className="relative inline-block">
                            <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 ml-2 font-poppins'>
                        Entries
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                            <tr>
                                <th className="border px-4 py-2 text-gray-400">ID</th>
                                <th className="border px-4 py-2 text-gray-400">Brand Name</th>
                                <th className="border px-4 py-2 text-gray-400">Description</th>
                                <th className="border px-4 py-2 text-gray-400">Dosage</th>
                                <th className="border px-4 py-2 text-gray-400">Customer Care Number</th>
                                <th className="border px-4 py-2 text-gray-400">Company</th>
                                <th className="border px-4 py-2 text-gray-400">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brandnames.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, brandnames.length)).map((brand) => (
                                <tr key={brand.id}>
                                    <td className="border px-4 py-2">{brand.id}</td>
                                    <td className="border px-4 py-2">
                                        <Link to={`/add-product-file/${brand.id}`} state={{crop_name: location.state.crop_name, topic_name: location.state.topic_name, subtopic_name: location.state.subtopic_name, technicalName: location.state.technicalName, product_name: brand.name.english}}>{brand.name.english}</Link>
                                    </td>
                                    <td className="border px-4 py-2">{brand.description.english}</td>
                                    <td className="border px-4 py-2">{brand.dosage.english}</td>
                                    <td className="border px-4 py-2">{brand.customer_care_number}</td>
                                    <td className="border px-4 py-2">
                                        {brand.company}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        <button
                                            className='px-2 py-2 bg-xcodegold text-white rounded focus:outline-none'
                                            onClick={() => handleProductFileClick(brand.id)}
                                        >
                                            Add Brand File
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination entries={brandnames.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
                {showProduct && (
                    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10'>
                        <div className='bg-white p-8 rounded-lg shadow-xl'>
                            <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Company Name
                                    </label>
                                    <select
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded w-full'
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    >
                                        {companyNames.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Activity Types
                                    </label>
                                    <select
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded w-full'
                                        value={activityTypes}
                                        onChange={(e) => setActivityTypes(e.target.value)}
                                    >
                                        {activityType.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Priority Order
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={priorityOrder}
                                        onChange={(e) => setPriorityOrder(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Brand Name (English)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={brandNameEnglish}
                                        onChange={(e) => setBrandNameEnglish(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Brand Name (Hindi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={brandNameHindi}
                                        onChange={(e) => setBrandNameHindi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Brand Name (Marathi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={brandNameMarathi}
                                        onChange={(e) => setBrandNameMarathi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Dosage (English)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={dosageEnglish}
                                        onChange={(e) => setDosageEnglish(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Dosage (Marathi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={dosageMarathi}
                                        onChange={(e) => setDosageMarathi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Dosage (Hindi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={dosageHindi}
                                        onChange={(e) => setDosageHindi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Description (English)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={descriptionEnglish}
                                        onChange={(e) => setDescriptionEnglish(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Description (Hindi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={descriptionHindi}
                                        onChange={(e) => setDescriptionHindi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Description (Marathi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={descriptionMarathi}
                                        onChange={(e) => setDescriptionMarathi(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Customer Care Number
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        type='text'
                                        value={customerCareNumber}
                                        onChange={(e) => setCustomerCareNumber(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-between'>
                                    <button
                                        type='button'
                                        onClick={handleCancelClick}
                                        className='px-2 text-xcodegold border border-xcodegold rounded'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className='px-2 bg-xcodegold text-white rounded'
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

