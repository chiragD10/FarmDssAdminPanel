import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';

const AddTopicsPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { cropId } = useParams();
    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleHindi, setTitleHindi] = useState('');
    const [titleMarthi, setTitleMarathi] = useState('');
    const [order, setOrder] = useState('');
    const [paid, setPaid] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [topics, setTopics] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;
    const location = useLocation();
    const handleAddTopic = () => {
        setShowModal(true);
    };

    useEffect(() => {
        const fetchTopics = async () => {
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                try {
                    const response = await axios.post(base_url+'/kbank/crops/topics/', { id: cropId }, config);
                    setTopics(response.data.topics.topics);
                    console.log(topics)
                } catch (error) {
                    console.error('Error fetching crops:', error);
                }
            }
        };

        fetchTopics();
    }, [token]);


    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };


    const toggleTopicStatus = async (topicId: string, checked: boolean) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: cropId,
            intent: 'topic_paid',
        };
    
        try {
            const response = await axios.post(base_url+'/kbank/go_live', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setTopics(topics => topics.map(topic => {
                if (topic.id === topicId) {
                    return { ...topic, paid: checked };
                }
                return topic;
            }));
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const payload = {
            crop_id: cropId,
            title_english: titleEnglish,
            title_hindi: titleHindi,
            title_marathi: titleMarthi,
            order: parseInt(order, 10),
            paid: paid ? "True" : "False", 
            image: image,
        };
    
        try {
            const response = await axios.post(base_url+'/kbank/crops/topics/add/', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add topic:', error);
        }
        if (token) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };
            try {
                const response = await axios.post(base_url+'/kbank/crops/topics/', { id: cropId }, config);
                setTopics(response.data.topics.topics);
                console.log(topics)
            } catch (error) {
                console.error('Error fetching crops:', error);
            }
        }
    };
    
    const handleCancelClick = () => {
        setShowModal(false)
    }


    const handleFileUpload = (event: any) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                alert("image size greater than 10 MB")
                setImage(null)
            }
            else{
                setImage(file); // Update the selected image
                console.log(file.size); // Log the size for debugging
            }
        }
    };

    const handleSubTopicClick = (TopicId: any, crop_name: string, topic_name: string) => {
        navigate(`/add-subtopic/${TopicId}`, {replace: true, state: {TopicId, crop_name,topic_name}});
        
    };

    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodebblue font-poppins font-semibold mt-4'>{location.state.crop_name}</div>
            <div>
                <button
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '130px' }}
                >
                    Upload CSV
                </button>
                <button
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    Add Topic
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
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z"/></svg>
                        </div>
                    </div>
                </div>
                <div className='mt-6 ml-2 font-poppins'>
                    Entries
                </div>
            </div>

            {/* <div className="flex justify-between items-center mt-16 mb-4">
                <div>
                    <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                    <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div> */}

            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">
                                ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Topic Title
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Paid
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Views
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Share
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, topics.length)).map((topic: any) => (
                            <tr key={topic.id}>
                                <td className="border px-4 py-2">{topic.id}</td>
                                <td className="border px-4 py-2">
                                    <Link to={`/add-subtopic/${topic.id}`} state={{crop_name: location.state.crop_name, topic_name: topic.title.english}}>{topic.title.english}</Link>
                                </td>
                                {/* <td className="border px-4 py-2">{topic.paid ? 'Yes' : 'No'}</td> */}
                                <td className="border px-4 py-2 text-gray-900">
                                        {/* <input
                                            type="checkbox"
                                            id={`live-${course.id}`}
                                            checked={course.go_live}
                                            onCange={(e) => handleToggleChange(e.target.checked, course.id)}
                                        /> */}
                                        <label htmlFor="toggle-switch">
                                            <input type="checkbox" id="toggle-switch"
                                            checked={topic.paid}
                                            onChange={(e) => toggleTopicStatus(topic.id, e.target.checked)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative' required/>
                                        </label>
                                    </td>
                                    <td className="border px-4 py-2">{topic.views}</td>
                                <td className="border px-4 py-2">
                                    <button className="px-2 py-2 bg-xcodegold text-white rounded focus:outline-none">Share</button>
                                </td>
                                <td className="border px-4 py-2">
                                    <button className="px-2 py-2 bg-xcodegold text-white rounded focus:outline-none" onClick={() => handleSubTopicClick(topic.id, location.state.crop_name, topic.title.english)}>Sub Topic</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <Pagination entries={topics.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
            </div>
            {showModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10'>
                    <div className='bg-white p-8 rounded-lg shadow-xl'>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <h3 className='text-lg font-medium leading-6 text-xcodebblue font-poppins mb-4'>
                                Add Topic
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Topic Title (English)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={titleEnglish}
                                        onChange={(e) => setTitleEnglish(e.target.value)}
                                        name='nameEnglish'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                    Topic Title (Hindi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={titleHindi}
                                        onChange={(e) => setTitleHindi(e.target.value)}
                                        name='nameHindi'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Topic Title (Marathi)
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Add Crop Name'
                                        type='text'
                                        value={titleMarthi}
                                        onChange={(e) => setTitleMarathi(e.target.value)}
                                        name='nameMarathi'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>
                                        Order of Topic ID
                                    </label>
                                    <input
                                        className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                        placeholder='Amount'
                                        type='number'
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        name='price'
                                        required
                                    />
                                </div>
                                <div>
                                <label  className='block text-sm font-medium text-gray-700'>
                                    Paid
                                </label>
                                <label htmlFor="toggle-switch">
                                    <input type="checkbox" id="toggle-switch"
                                    // checked={knowledgebank.isActive}
                                    onChange={() => setPaid(!paid)}
                                    className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative' required/>
                                </label>
                                </div>
                            </div>
                            <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                    Upload Image (Max 10 MB)
                                    </label>
                                    <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white"
                                    name="image"
                                    accept="image/*"
                                    required
                                    />
                                    {image && (
                                        <div>
                                        <p>File Size: {Math.round(image.size / 1024)} KB</p>
                                        </div>
                                    )}
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
                                    onClick={handleSubmit}
                                >
                                    Add Topic
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AddTopicsPage;
