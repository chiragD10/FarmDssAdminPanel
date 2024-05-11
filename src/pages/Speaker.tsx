import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import exportFromJSON from 'export-from-json'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

interface Speaker {
    id: number;
    name_english: string;
    name_hindi: string;
    name_marathi: string;
    profile_image: string;
    education_english: string;
    education_hindi: string;
    education_marathi: string;
    description_english: string;
    description_hindi: string;
    description_marathi: string;
    created_date:Date;
    go_live:boolean;
}

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
}
const Speaker: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [speakers, setSpeakers] = useState<any[]>([])
    const [image, setSelectedImage] = useState<File | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const { user } = useParams();
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
    // const navigate = useNavigate();
    
    const base_url = process.env.REACT_APP_API_URI;
    
    const token = localStorage.getItem('authToken');
    function zoomScreenshot(url: string){
        setViewScreenshot(true);
        setimgUrl(url)
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setViewScreenshot(!viewScreenshot);
        }
    };
    

    useEffect(() => {
        const fetchUsers = async () => {
            // const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/users/creator/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setSpeakers(response.data.data.user);
                    console.log(response.data.data.user)
                } catch (error) {
                    console.error('Error fetching speakers:', error);
                }
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('first_name', 'Speaker')
        formData.append('last_name', 'User')
        // console.log(formData)
        const nameEnglishEntry = formData.get("name_english");
        if (nameEnglishEntry !== null) {
            const nameEnglish = nameEnglishEntry.toString();
            const username = nameEnglish.replace(/\s/g, '');
            formData.append('username', username);
        }

        formData.append('password', '12345')
        formData.append('email', 'agriacademia@gmail.com')
        formData.append('phone', '7057242921')
        if (image) formData.append('profile_image', image);
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
            console.log(formData)
            await axios.post(base_url+`/users/creator/add`, formData, config);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create instructor:", error);
        }
        if (token) {
            try {
                const response = await axios.get(base_url+'/users/creator/all/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSpeakers(response.data.data.user);
                console.log(response.data.data.user)
            } catch (error) {
                console.error('Error fetching speakers:', error);
            }
        }
    };

    
    const toggleCreatorStatus = async (speakerId: string, checked: boolean) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: speakerId,
            intent: 'creator',
        };
    
        try {
            const response = await axios.post(base_url+'/users/go_live', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setSpeakers(speakers => speakers.map(speaker => {
                if (speaker.id === speakerId) {
                    return { ...speaker, go_live: checked };
                }
                return speaker;
            }));
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                alert("image size greater than 10 MB")
                setSelectedImage(null)
            }
            else{
                setSelectedImage(file); // Update the selected image
                console.log(file.size); // Log the size for debugging
            }
        }
    };
   

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = (event: any) => {
        setShowModal(false)
    }
    const handleDownloadCSV = () => {
        const f = speakers

        const filteredData = speakers.map((speaker: Speaker) => {
            const { id,
            name_english,
            name_hindi,
            name_marathi,
            profile_image,
            education_english,
            education_hindi,
            education_marathi,
            description_english,
            description_hindi,
            description_marathi,
            created_date,
            go_live
        } = speaker;
            return {         
                name_english,
                name_hindi,
                name_marathi,
                profile_image,
                education_english,
                education_hindi,
                education_marathi,
                description_english,
                description_hindi,
                description_marathi,
                created_date,
                go_live};
        });
        
        const filename = 'Speakers'
        const exportType = exportFromJSON.types.csv
        exportFromJSON({data:filteredData, fileName:filename, exportType})
    };
    const handleSortClick = (key: string) => {
        if (key === sortKey) {
            setSortOrder(!sortOrder);
        } else {
            setSortKey(key);
            setSortOrder(true); // Default to ascending order when changing sort key
        }
    };

    const sortedArray = [...speakers].sort((a, b) => {
        // Sorting logic based on sort key and sort order
        if (sortOrder) {
            // Ascending order
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            // Descending order
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

  return (
    <div className='container mx-auto p-4'>
        <div className='text-xcodebblue font-poppins font-semibold'>Speaker Details</div>

        <div className='flex justify-between'>
            <div className='flex'>
                <div className="flex justify-between items-center mt-4 mb-4">
                    <div className="relative inline-block">
                        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="block appearance-none w-full bg-white border border-gray-300 px-2 py-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z"/></svg>
                        </div>
                    </div>
                </div>
                <div className='mt-8 ml-2 font-poppins'>
                    Entries
                </div>
            </div>
            <div className='space-x-2'>
                <button
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                onClick={() => setShowModal(true)}
                > 
                   Add Speaker
                </button>
                <button
                onClick={handleDownloadCSV}
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                >
                    Download CSV
                </button>

            </div>
        </div>

        <div className='overflow-x-auto'>
            <table className="min-w-full leading-normal">
                <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                    <tr>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('id')}}>
                            ID
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Image
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('name_english')}}>
                            Name
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('education_english')}}>
                            Education
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('created_date')}}>
                            Created Date
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Active
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm" onClick={() => {handleSortClick('description_english')}}>
                            Description
                        </th>
                        <th className="border px-4 py-2 text-gray-400 text-sm">
                            Profile
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(sortedArray) && sortedArray.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, sortedArray.length)).map((user) => (
                        <tr key={user[sortKey]}>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{user.id}</td>
                            <td className="border px-4 py-2 text-gray-500">
                                <img src={user.profile_image} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(user.profile_image)}/>
                            </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{truncateText(user.name_english,40)}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{truncateText(user.education_english,40)}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{new Date(user.created_date).toLocaleString()}</td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                            <label htmlFor="toggle-switch">
                                            <input type="checkbox" id="toggle-switch"
                                            checked={user.go_live}
                                            onChange={(e) => toggleCreatorStatus(user.id, e.target.checked)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                        </label>
                            </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                            <Link to={`/creator/${user.id}`}
                                    state={{user}}>
                                        {truncateText(user.description_english,40)}
                                    </Link>
                              </td>
                            <td className="border px-4 py-2">
                                <button
                                    value={user.id}
                                    className="px-4 py-2 bg-xcodegold text-white rounded ml-32"
                                >
                                    <Link to={`/creator/${user.id}`} state={user}>View Profile</Link>
                                </button>
                            </td>
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
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold leading-6 text-xcodebblue font-poppins font-semibold mb-4">Add Speaker</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Name (English)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (English)" name="name_english" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Name (Hindi)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (Hindi)" name="name_hindi" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Name (Marathi)</span>
                                    <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (Marathi)" name="name_marathi" required />
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

                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Education (English)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="education_english" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Education (Hindi)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="education_hindi" required />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Education (Marathi)</span>
                                    <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="education_marathi" required />
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
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleCancelClick} className="px-4 py-2 text-xcodegold rounded border border-xcodegold">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        <Pagination entries={speakers.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
        
    </div>
  );
};

export default Speaker;
