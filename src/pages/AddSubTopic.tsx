import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaShare, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Pagination from './Pagination';

const AddSubTopicsPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [englishTitle, setEnglishTitle] = useState('');
    const [hindiTitle, setHindiTitle] = useState('');
    const [marathiTitle, setMarathiTitle] = useState('');
    const [englishDescription, setEnglishDescription] = useState('');
    const [hindiDescription, setHindiDescription] = useState('');
    const [marathiDescription, setMarathiDescription] = useState('');
    const { topicId } = useParams();
    const [subtopics, setSubTopics] = useState<any>([])
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;


    const token = localStorage.getItem('authToken');
    function stripHtml(html: any) {
        var temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }
    useEffect(() => {
        const fetchSubTopics = async () => {
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                try {
                    const response = await axios.post(base_url+'/kbank/crops/topics/subtopics/', { id: topicId }, config);
                    setSubTopics(response.data.subtopics.subtopics);
                } catch (error) {
                    console.error('Error fetching crops:', error);
                }
            }
        };

        fetchSubTopics();
    }, [token]);
    const handleAddSubTopic = () => {
        setShowModal(true);
    };

    const SubTopics = new Array(30).fill({

    });


    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(base_url+'/kbank/crops/topics/subtopics/add/', {
                topic_id: topicId,
                title_english: englishTitle,
                title_hindi:hindiTitle,
                title_marathi:marathiTitle,
                description_english: englishDescription,
                description_hindi:hindiDescription,
                description_marathi:marathiDescription
                
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Subtopic added successfully:', response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add subtopic:', error);
        }
    };
    const handleTechnicalNameListClick = (SubTopicId: any) => {
        navigate(`/technical-list/${SubTopicId}`);
    };
    const handleAddSubTopicFile = (SubTopicId: any) => {
        navigate(`/add-subtopic-file/${SubTopicId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodebblue font-poppins font-semibold mt-4'>{location.state.crop_name} &gt; {location.state.topic_name}</div>
            <div className='flex gap-4 pt-4'>
                <button
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-36 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '330px' }}
                >
                    Sample CSV
                </button>
                <button
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-36 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '180px' }}
                >
                    Upload CSV
                </button>
                <button
                    onClick={handleAddSubTopic}
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-36 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    Add SubTopic
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
                                SubTopic Title
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-xcodewhite font-poppins'>
                        {subtopics.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, subtopics.length)).map((subtopic: any, index: any) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <p className="text-gray-900 whitespace-no-wrap">{subtopic.id}</p>
                                </td>
                                <td className="border px-4 py-2">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        <Link to={`/technical-list/${subtopic.id}`} state={{crop_name: location.state.crop_name, topic_name: location.state.topic_name, subtopic_name: subtopic.title.english}}>{subtopic.title.english}</Link>
                                    </p>
                                </td>
                                <td className="border px-4 py-2 flex justify-center items-center gap-4">
                                    <button
                                        className='px-2 py-2 bg-xcodegold text-white rounded focus:outline-none'
                                        onClick={() => handleTechnicalNameListClick(subtopic.id)}
                                    >
                                        Technical Name List
                                    </button>
                                    <FaEye className="cursor-pointer text-xcodegold text-3xl" title="View" onClick={() => handleAddSubTopicFile(subtopic.id)} />
                                    <FaShare className="cursor-pointer text-xcodegold text-3xl" title="Share" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination entries={subtopics.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add SubTopic</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SubTopic Title (English)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Subtopic Title (English)"
                                        type="text"
                                        value={englishTitle}
                                        onChange={(e) => setEnglishTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SubTopic Title (Hindi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Subtopic Title (Hindi)"
                                        type="text"
                                        value={hindiTitle}
                                        onChange={(e) => setHindiTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SubTopic Title (Marathi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Subtopic Title (Marathi)"
                                        type="text"
                                        value={marathiTitle}
                                        onChange={(e) => setMarathiTitle(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 h-48 overflow-hidden quill">
                                <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={englishDescription}
                                    onChange={setEnglishDescription}
                                    
                                    placeholder="Add Content"
                                    className="mt-2 text-sm text-gray-700 rounded"
    
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                    }}
                                    style={{
                                        height: '120px',
                                        width: '100%',
                                    }}
                                />
                            </div>
                            <div className="mt-4 h-48 overflow-hidden quill">
                                <label className="block text-sm font-medium text-gray-700">Description (Hindi)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={hindiDescription}
                                    onChange={setHindiDescription}
                                    placeholder="Add Content"
                                    className="mt-2 text-sm text-gray-700 rounded"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                    }}
                                    style={{
                                        height: '120px',
                                        width: '100%',
                                    }}
                                />
                            </div>
                            <div className="mt-4 h-48 overflow-hidden quill">
                                <label className="block text-sm font-medium text-gray-700">Description (Marathi)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={marathiDescription}
                                    onChange={setMarathiDescription}
                                    placeholder="Add Content"
                                    className="mt-2 text-sm text-gray-700 rounded"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                    }}
                                    style={{
                                        height: '120px',
                                        width: '100%',
                                    }}
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    className="px-4 py-2 text-xcodegold border border-xcodegold rounded"
                                >
                                    Cancel
                                </button>
                                <div className="flex gap-4 items-center">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-xcodegold text-white rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddSubTopicsPage;
