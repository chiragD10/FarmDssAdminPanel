import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import exportFromJSON from 'export-from-json';
import Pagination from './Pagination';
import EditModal from './EditModal';
import { FaShare, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import Share from './Share';
interface Creator {
    id: number;
    username: string;
}
const WebinarPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [showShare, setShowShare] = useState(false)
    const [shareLink, setShareLink] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    const showEditModal = (webinar: any) => {
        setEditModalVisible(true);
        setWeb(webinar);
    };
    const [web, setWeb] = useState<any>()
    const [webId, setWebId] = useState(0)
    const [webinarType, setWebinarType] = useState<'previous' | 'upcoming'>('previous');
    const [goLive, setGoLive] = useState(false);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [liveDate, setLiveDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;
    useEffect(() => {
        const fetchCreators = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url + '/users/creator/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCreators(response.data.data.user || []);
                } catch (error) {
                    console.error('Error fetching creators:', error);
                }
            }
        };
        fetchCreators();
    }, []);
    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = `${now.getMonth() + 1}`.padStart(2, '0');
        const day = `${now.getDate()}`.padStart(2, '0');
        const hours = `${now.getHours()}`.padStart(2, '0');
        const minutes = `${now.getMinutes()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [webinars, setWebinars] = useState<any[]>([]);
    useEffect(() => {
        const fetchWebinars = async () => {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            try {
                const response = await axios.get(base_url + '/webinars/all/', config);
                setWebinars(response.data.webinars);
                console.log(response.data.webinars);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
            }
        };

        fetchWebinars();
    }, [token]);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    function truncateText(text: string, numChars: number): string {
        let truncatedText = '';
        let totalChars = 0;
        for (let i = 0; i < text.length; i++) {
            truncatedText += text[i];
            totalChars++;
            if (totalChars === numChars) {
                break; // Stop adding characters once numChars is reached
            }
            if (totalChars % 25 === 0) { // Check if 25 characters have been added
                truncatedText += '\n';
            }
        }
        if (text.length > numChars) {
            truncatedText += '...';
        }
        return truncatedText;
    };
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                alert("image size greater than 10 MB")
                setImage(null)
            }
            else {
                setImage(file); // Update the selected image
                console.log(file.size); // Log the size for debugging
            }
        }
    };

    const handleToggleWebinarType = (type: 'previous' | 'upcoming') => {
        setWebinarType(type);
    };

    const handleAddWebinarClick = () => {
        setShowModal(true);
    };
    const handleOpenTextInNewWindow = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
        e.preventDefault(); // Prevents the default action of the anchor tag
        window.open('', '_blank')?.document.write(text); // Opens a new window and writes the text to it
    };

    
    

    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (image) formData.append('cover_image', image);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        if (!token) {
            console.error("Token is not available. Make sure you're logged in.");
            return;
        }

        try {

            await axios.post(base_url + `/webinars/create_webinar/`, formData, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create webinar:", error);
        }
        
        try {
            const response = await axios.get(base_url + '/webinars/all/', config);
            setWebinars(response.data.webinars);
            console.log(response.data.webinars);
        } catch (error) {
            console.error("Failed to fetch webinars:", error);
        }
    };
    const filteredWebinars = webinars.filter((webinar) => {
        const webinarDate = new Date(webinar.publish_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (webinarType === 'previous') {
            return webinarDate < today;
        } else if (webinarType === 'upcoming') {
            return webinarDate >= today;
        }
        return true;
    });
    const handleSortClick = (key: string) => {
        if (key === sortKey) {
            setSortOrder(!sortOrder);
        } else {
            setSortKey(key);
            setSortOrder(true); // Default to ascending order when changing sort key
        }
    };

    const sortedArray = [...filteredWebinars].sort((a, b) => {
        // Sorting logic based on sort key and sort order
        if (sortOrder) {
            // Ascending order
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            // Descending order
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });
    const handleGoLiveChange = async (isLive: boolean, webinarId: number) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        const body = {
            id: webinarId
        };

        try {
            const response = await axios.post(base_url + `/webinars/webinar/go_live/`, body, config);
            console.log('Go live status updated:', response.data);
            const updatedWebinars = webinars.map(webinar =>
                webinar.id === webinarId ? { ...webinar, go_live: isLive } : webinar
            );
            setWebinars(updatedWebinars);
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };
    const handleDownloadCSV = () => {
        const f = webinars
        const filename = 'webinars'
        const exportType = exportFromJSON.types.csv
        exportFromJSON({ data: f, fileName: filename, exportType })
    };
    function zoomScreenshot(url: string) {
        setViewScreenshot(true);
        setimgUrl(url)
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setViewScreenshot(!viewScreenshot);
        }
    };

    return (

        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={() => handleToggleWebinarType('previous')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${webinarType === 'previous' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Previous</button>
                    <button onClick={() => handleToggleWebinarType('upcoming')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${webinarType === 'upcoming' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Upcoming</button>
                </div>
                <div className='space-x-2'>
                    <button onClick={handleDownloadCSV} className="px-4 py-2 bg-xcodegold text-white rounded">Download CSV</button>
                    <button onClick={handleAddWebinarClick} className="px-4 py-2 bg-xcodegold text-white rounded">Add Webinar</button>
                </div>
            </div>
            <div className='flex'>
                <div className="flex justify-between items-center mt-4 mb-4">
                    <div className="relative inline-block">
                        <select onClick={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
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
                <div className='mt-8 ml-2 font-poppins'>
                    Entries
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold leading-6 text-xcodebblue font-poppins font-semibold mb-4">Add Webinar topic - Live</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (English)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (English)" name="topic_english" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (Hindi)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (Hindi)" name="topic_hindi" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (Marathi)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (Marathi)" name="topic_marathi" required />
                                </div>

                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (English)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="description_english" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (Hindi)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="description_hindi" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (Marathi)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="description_marathi" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cover Image (Max 10 MB)
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white"
                                        name="image"
                                        accept="image/*"
                                    />
                                    {image && (
                                        <div>
                                            <p>File Size: {Math.round(image.size / 1024)} KB</p>
                                        </div>
                                    )}
                                </div>
                                <div></div>
                                <div></div>

                                <div className='flex'>
                                    <div className='flex flex-col py-2 mr-4'>
                                        <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Referral Amount</span>
                                        <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Amount" name="referral_amount" required />
                                    </div>
                                    <div className='flex flex-col py-2'>
                                        <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Subscription Amount</span>
                                        <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Amount" name="amount" required />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Link</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Link" name="link" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Live Date</span>
                                    <input
                                        className="border border-gray-300 px-4 py-2 rounded"
                                        type="datetime-local"
                                        placeholder="Publish Date"
                                        name="publish_date"
                                        value={liveDate}
                                        onChange={(e) => setLiveDate(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* <input className="border border-gray-300 px-4 py-2 rounded" type="url" placeholder="Webinar Link" name="link" required />
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Amount" name="amount" required />
                                <select className="border border-gray-300 px-4 py-2 rounded" name="speaker" required>
                                    <option value="">Select Speaker</option>
                                    {Array.isArray(creators) && creators.map((creator) => (
                                        <option key={creator.id} value={creator.id}>{creator.username}</option>
                                    ))}
                                </select> */}

                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Assign Speaker</span>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="speaker" required>
                                        <option value="">Select Speaker</option>
                                        {Array.isArray(creators) && creators.map((creator) => (
                                            <option key={creator.id} value={creator.id}>{creator.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Select Language</span>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="language" required>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Marathi">Marathi</option>
                                    </select>
                                </div>
                                <div></div>

                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Add Relevant Courses</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Add Courses ID" name="related_courses" required />
                                </div>

                                {/* <input
                                    className="border border-gray-300 px-4 py-2 rounded"
                                    type="datetime-local"
                                    placeholder="Publish Date"
                                    name="publish_date"
                                    value={getCurrentDateTimeLocal()}
                                    required
                                />
                                <select className="border border-gray-300 px-4 py-2 rounded" name="language" required>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                </select>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Referral Amount" name="referral_amount" /> */}
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleCancelClick} className="px-4 py-2 text-xcodegold rounded border border-xcodegold">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('id')}}>
                                ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" >
                                Cover Image
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('topic_english')}}>
                                Title (English)
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('description_english')}}>
                                Description (English)
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Speaker
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Language
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Date & Time
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('amount')}}>
                                Subscription Amount
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('referral_amount')}}>
                                Referral Amount
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Link
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Course ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">Status</th>
                            <th className="border px-4 py-2 text-gray-400 text-sm">
                                Action
                            </th>
                            <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('created_at')}}>
                                Created/Updated Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(sortedArray) && sortedArray.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, filteredWebinars.length)).map((webinar) => (
                            <tr key={webinar[sortKey]}>
                                <td className="border px-4 py-2 text-gray-500">{webinar.id}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <img src={webinar.cover_image} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(webinar.cover_image)} />
                                </td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.topic_english}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <a href="#" onClick={(e) => handleOpenTextInNewWindow(e, webinar.description_english)}>
                                        {truncateText(webinar.description_english, 30)}
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.speaker}</td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.language}</td>
                                <td className="border px-4 py-2 text-gray-500">{new Date(webinar.publish_date).toLocaleString()}</td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.amount}</td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.referral_amount}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <a href={webinar.link} target="_blank" rel="noopener noreferrer">Link</a>
                                </td>
                                <td className="border px-4 py-2 text-gray-500">{webinar.related_courses}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <label htmlFor="toggle-switch">
                                        <input type="checkbox" checked={webinar.go_live}
                                            onChange={(e) => handleGoLiveChange(e.target.checked, webinar.id)} id='toggle-switch' className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative' />
                                    </label>
                                    {/* <input
                                        type="checkbox" id='toggle'
                                        checked={webinar.go_live}
                                        onChange={(e) => handleGoLiveChange(e.target.checked, webinar.id)}
                                    /> */}
                                </td>
                                <td className="flex justify-center items-center gap-4 border px-4 py-6 text-gray-900">
                                    <MdDeleteForever
                                        className="cursor-pointer text-gray-600 hover:text-gray-900"
                                        title="Delete"
                                    />
                                    <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900"
                                        title="Edit" 
                                        onClick={() => {
                                            setWeb(webinar)
                                            showEditModal(true)
                                            setWebId(webinar.id)
                                            }}/>
                                    <FaShare className="cursor-pointer text-gray-600 hover:text-gray-900"
                                        onClick={() => {
                                            setShowShare(true)
                                            setShareLink(`https://farmdss.com/webinar_details/${webinar.id}?referral_id=1234`)
                                        }}
                                        title="Share" />
                                </td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(webinar.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>


                </table>
                {viewScreenshot && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center items-center z-10" onClick={handleClickOutside}>
                        <div className="bg-white p-8 rounded-lg shadow-xl">
                            <img className='object-cover w-80 h-80' src={String(imgUrl)} alt="" />
                        </div>
                    </div>
                )}
                { showShare && <Share setShowShare={setShowShare} shareLink={shareLink}/> }
                { editModalVisible && <EditModal creators={creators} webinarId={webId} webinar={web} editModalVisible={editModalVisible} setEditModalVisible={setEditModalVisible}></EditModal>}
                <Pagination entries={webinars.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
            </div>
        </div>
    );
};

export default WebinarPage;
