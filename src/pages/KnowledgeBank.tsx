import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Pagination from './Pagination'

const KnowledgeBankPage: React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('authToken');
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showModal, setShowModal] = useState(false)
    const [nameEnglish, setNameEnglish] = useState('');
    const [nameHindi, setNameHindi] = useState('');
    const [nameMarathi, setNameMarathi] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [crops, setCrops] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;
    const handleAddKnowledgeBankClick = () => {
        setShowModal(true)
    }
    useEffect(() => {
        const fetchCrops = async () => {
            if (token) {
                try {
                    const response = await axios.get(base_url+'/kbank/crops/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCrops(response.data.crops.crops);
                } catch (error) {
                    console.error('Error fetching crops:', error);
                }
            }
        };

        fetchCrops();
    }, [token]);


    const toggleKnowledgeBankStatus = async (cropId: string, checked: boolean) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: cropId,
            intent: 'crop',
        };
    
        try {
            const response = await axios.post(base_url+'/kbank/go_live', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setCrops(aand => aand.map(crop => {
                if (crop.id === cropId) {
                    return { ...crop, go_live: checked };
                }
                return crop;
            }));
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
        if (token) {
            try {
                const response = await axios.get(base_url+'/kbank/crops/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCrops(response.data.crops.crops);
            } catch (error) {
                console.error('Error fetching crops:', error);
            }
        }
    };

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value))
    }
    const handleCancelClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // formData.append('name_english', nameEnglish);
        // formData.append('name_hindi', nameHindi);
        // formData.append('name_marathi', nameMarathi);
        // formData.append('price', price);
        // if (image) formData.append('image', image);
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        try {
            const response = await axios.post(base_url+'/kbank/crops/add/', formData, config);
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding crop:', error);
        }
    };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setImage(file);
    };

    const handleCropClick = (cropId: any, crop_name: string) => {
        navigate(`/add-topic/${cropId}`, {replace: true, state: {cropId, crop_name}})
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='text-xcodebblue font-poppins font-semibold mt-4'>Crops</div>
            <button
                onClick={handleAddKnowledgeBankClick}
                className='px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12'
                style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
                Add Crop
            </button>

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
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z"/></svg>
                        </div>
                    </div>
                </div>
                <div className='mt-6 ml-2 font-poppins'>
                    Entries
                </div>
            </div>

            {/* <div className='flex justify-between items-center mt-16 mb-4'>
                <div>
                    <label htmlFor='itemsPerPage' className='mr-2'>
                        Items per page:
                    </label>
                    <select
                        id='itemsPerPage'
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                    </select>
                </div>
            </div> */}

            <div className='overflow-x-auto'>
                <table className='min-w-full leading-normal'>
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className='border px-4 py-2 text-gray-400'>ID</th>
                            <th className='border px-4 py-2 text-gray-400'>Image</th>
                            <th className='border px-4 py-2 text-gray-400'>Name</th>
                            <th className='border px-4 py-2 text-gray-400'>Price</th>
                            <th className='border px-4 py-2 text-gray-400'>Action</th>
                            <th className='border px-4 py-2 text-gray-400'>Visibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops
                            .slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, crops.length))
                            .map((crop, index) => (
                                <tr key={index}>
                                    <td className='border px-4 py-2 text-gray-900 whitespace-no-wrap'>
                                        {crop.id}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        <img className='w-10 h-10 rounded-full' src={crop.image} alt={`Crop ${crop.id}`} />
                                    </td>
                                    <td className='border px-4 py-2'>
                                        <Link to={`/add-topic/${crop.id}`} state={{crop_name: crop.name.english}}>{crop.name.english}</Link>
                                    </td>
                                    <td className='border px-4 py-2'>
                                        + {crop.price.toFixed(2)}
                                    </td>
                                    <td className='border px-4 py-2 text-center'>
                                        <button
                                            className='px-2 py-2 bg-xcodegold text-white rounded focus:outline-none'
                                            onClick={() => handleCropClick(crop.id, crop.name.english)}
                                        >
                                            Knowledge Bank
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2 text-gray-900">
                                        {/* <input
                                            type="checkbox"
                                            id={`live-${course.id}`}
                                            checked={course.go_live}
                                            onCange={(e) => handleToggleChange(e.target.checked, course.id)}
                                        /> */}
                                        <label htmlFor="toggle-switch">
                                            <input type="checkbox" id="toggle-switch"
                                            checked={crop.go_live}
                                            onChange={(e) => toggleKnowledgeBankStatus(crop.id, e.target.checked)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                        </label>
                                    </td>
                                    {/* <td className='border px-4 py-2'>
                                        <div className='flex justify-center items-center'>
                                            <label
                                                htmlFor={`toggle${index}`}
                                                className='inline-flex items-center cursor-pointer'
                                            >
                                                <span className='relative'>
                                                    <span className='block w-10 h-6 bg-gray-200 rounded-full shadow-inner'></span>
                                                    <span
                                                        className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out ${knowledgebank.isActive
                                                            ? 'bg-green-400 transform translate-x-full'
                                                            : 'bg-orange-400'
                                                            }`}
                                                    ></span>
                                                </span>
                                                <input
                                                    id={`toggle${index}`}
                                                    type='checkbox'
                                                    className='absolute opacity-0 w-0 h-0'
                                                    // checked={knowledgebank.isActive}
                                                    onChange={() => toggleKnowledgeBankStatus()}
                                                />
                                            </label>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <Pagination entries={crops.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
            {showModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10'>
                    <div className='bg-white p-8 rounded-lg shadow-xl'>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <h3 className='text-lg font-medium leading-6 text-gray-900 mb-4'>
                                Add Crop
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Crop Name (English)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={nameEnglish}
                                        onChange={(e) => setNameEnglish(e.target.value)}
                                        name='name_english'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Crop Name (Hindi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={nameHindi}
                                        onChange={(e) => setNameHindi(e.target.value)}
                                        name='name_hindi'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Crop Name (Marathi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={nameMarathi}
                                        onChange={(e) => setNameMarathi(e.target.value)}
                                        name='name_marathi'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        KB Price
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Amount'
                                        type='number'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        name='price'
                                        required
                                    />
                                </div>
                            </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cover Image 
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white"
                                        name="image"
                                        accept="image/*"
                                        required
                                    />
                                </div>

                            <div className='flex justify-between'>
                                <button
                                    type='button'
                                    onClick={handleCancelClick}
                                    className='px-4 py-2 text-xcodegold border border-xcodegold rounded'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-xcodegold text-white rounded'
                                >
                                    Add Crop
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}

export default KnowledgeBankPage
