import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
interface File {
    id: number | string;
    name: string;
    mediafiles: MediaFile;
    title: {
        english: string;
        hindi: string;
        marathi: string;
    };
    description: {
        english: string;
        hindi: string;
        marathi: string;
    };
    demo: boolean;
    go_live: boolean
    created_at: Date
}

interface MediaFile {
    url: string;
    filetype: string;
    name: string;
    duration: string;
    pages: number;
    yt_link: string;
}

const AddFilesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [fileType, setFileType] = useState('Document');
    const [files, setFiles] = useState<File[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleHindi, setTitleHindi] = useState('');
    const [titleMarathi, setTitleMarathi] = useState('');
    const [descriptionEnglish, setDescriptionEnglish] = useState('');
    const [descriptionHindi, setDescriptionHindi] = useState('');
    const [descriptionMarathi, setDescriptionMarathi] = useState('');
    const [lessonfiles, setLessonFiles] = useState<File[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)
    const token = localStorage.getItem('authToken');
    const { courseId } = useParams();
    const lesson_Id = location.state.lesson_id
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const base_url = process.env.REACT_APP_API_URI;
    useEffect(() => {
        // const fetchFiles = async () => {
        //     try {
        //         const response = await fetch(base_url+'/files/all', {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,
        //             },
        //         });
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         const data = await response.json();
        //         setFiles(data.files);
        //         console.log("all/files")
        //         console.log(data.files)
        //     } catch (error) {
        //         console.error('Error fetching files:', error);
        //     }
        // };
        const fetchFiles = async () => {
            // const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    
                    const response = await axios.get(base_url+'/files/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setFiles(response.data.files);
                    console.log(files)
                    console.log(response)
                    // console.log(response.data.data)
                    // console.log(response.data.message)
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            }
        };

        fetchFiles();
    }, [token]);

    useEffect(() => {
        const fetchLessonFiles = async () => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };
            if (token && lesson_Id) {
                try {
                    const response = await axios.post(base_url+`/courses/course/lesson/files/`, { id: lesson_Id }, config);
                    setLessonFiles(response.data.data.lessonfiles || []);
                    // console.log("/courses/course/lesson/files/")
                    // console.log(lessonfiles)
                } catch (error) {
                    console.error('Error fetching lesson files:', error);
                }
            }
            if (courseId && token) {
                try {
                    const response = await axios.post(base_url+`/course/files/id`, { id: courseId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log(response)
                } catch (error) {
                    console.error('Error updating course data:', error);
                }
            }
        };
        fetchLessonFiles();
    }, [lesson_Id, token]);

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectMultipleFiles = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFiles = Array.from(event.target.selectedOptions).map(option => option.value);
        setSelectedFiles(selectedFiles);
    };

    const handleAddFile = () => {
        setShowModal(true);
    };

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const lessonId: number | undefined = lesson_Id ? parseInt(lesson_Id) : undefined;
        const mediaFileId: number | undefined = selectedFile ? parseInt(selectedFile) : undefined;
        const payload = {
            file_type:fileType,
            lesson_id: lessonId,
            title_english: titleEnglish,
            title_hindi: titleHindi,
            title_marathi: titleMarathi,
            description_english: descriptionEnglish,
            description_hindi: descriptionHindi,
            description_marathi: descriptionMarathi,
            lessons: lessonId !== undefined ? lessonId : undefined, 
            mediafiles: selectedFiles.map(id => parseInt(id)),
        };
        

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        };
        try {
            const response = await axios.post(base_url+'/courses/course/lesson/files/add/', payload, config);
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
        if (courseId && token) {
            try {
                const response = await axios.post(base_url+`/course/files/id`, { id: courseId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response)
            } catch (error) {
                console.error('Error updating course data:', error);
            }
        }
        if (token && lesson_Id) {
            try {
                const response = await axios.post(base_url+`/courses/course/lesson/files/`, { id: lesson_Id }, config);
                setLessonFiles(response.data.data.lessonfiles || []);
                // console.log("/courses/course/lesson/files/")
                // console.log(lessonfiles)
            } catch (error) {
                console.error('Error fetching lesson files:', error);
            }
        }
    };

    const handleToggleChange = async (id: string | number) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: id,
            intent: 'File',
        };

        try {
            const response = await axios.post(base_url+'/courses/course/go_live/', body, config);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
        if (courseId && token) {
            try {
                const response = await axios.post(base_url+`/course/files/id`, { id: courseId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response)
            } catch (error) {
                console.error('Error updating course data:', error);
            }
        }
        if (token && lesson_Id) {
            try {
                const response = await axios.post(base_url+`/courses/course/lesson/files/`, { id: lesson_Id }, config);
                setLessonFiles(response.data.data.lessonfiles || []);
                // console.log("/courses/course/lesson/files/")
                // console.log(lessonfiles)
            } catch (error) {
                console.error('Error fetching lesson files:', error);
            }
        }
    };

    const handleToggleChange2 = async (id: string | number) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: id,
            intent: 'LessonFile',
        };

        try {
            const response = await axios.post(base_url+'/courses/course/go_live/', body, config);
            console.log(response.data.message);
            
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
        if (token && lesson_Id) {
            try {
                const response = await axios.post(base_url+`/courses/course/lesson/files/`, { id: lesson_Id }, config);
                setLessonFiles(response.data.data.lessonfiles || []);
                // console.log("/courses/course/lesson/files/")
                // console.log(lessonfiles)
            } catch (error) {
                console.error('Error fetching lesson files:', error);
            }
        }
    };


    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodegold font-poppins font-semibold mt-4'>{location.state.course_name} &gt; {location.state.lesson_name}</div>
            <button
                onClick={handleAddFile}
                className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
                Add File
            </button>

            <div className='flex'>
                <div className="flex justify-between items-center mt-4 mb-4">
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
                <div className='mt-8 ml-2 font-poppins'>
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

            <div className="overflow-x-auto mt-10">
                <table className="min-w-full leading-normal">
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">ID</th>
                            <th className="border px-4 py-2 text-gray-400">File Type</th>
                            <th className="border px-4 py-2 text-gray-400">Media File Name</th>
                            <th className="border px-4 py-2 text-gray-400">Short Description (EN)</th>
                            <th className="border px-4 py-2 text-gray-400">URL</th>
                            <th className="border px-4 py-2 text-gray-400">Duration/Pages</th>
                            <th className="border px-4 py-2 text-gray-400">Demo</th>
                            <th className="border px-4 py-2 text-gray-400">Status</th>
                            <th className="border px-4 py-2 text-gray-400">Action</th>
                            <th className="border px-4 py-2 text-gray-400">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessonfiles.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, lessonfiles.length)).map((lessonfile, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{lessonfile.id}</td>
                                <td className="border px-4 py-2">{lessonfile.mediafiles.filetype}</td>
                                <td className="border px-4 py-2">{lessonfile.mediafiles.name}</td>
                                <td className="border px-4 py-2">{lessonfile.description.english}</td>
                                <td className="border px-4 py-2">
                                        <a href={lessonfile.mediafiles.filetype === "Youtube" ? lessonfile.mediafiles.yt_link : lessonfile.mediafiles.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            View File
                                        </a>
                                     </td>
                                <td className="border px-4 py-2">{lessonfile.mediafiles.filetype === "Document" ? lessonfile.mediafiles.pages : lessonfile.mediafiles.duration}</td>
                                <td>
                                    <label htmlFor="toggle-switch"></label>
                                    <input 
                                        type="checkbox" 
                                        id='toggle-switch' 
                                        checked={lessonfile.demo} 
                                        onChange={() => handleToggleChange(lessonfile.id)} 
                                        className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'
                                    />
                                </td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                    <label htmlFor="toggle-switch">
                                        <input type="checkbox"  checked={lessonfile.go_live} 
                                        onChange={() => handleToggleChange2(lessonfile.id)}
                                                id='toggle-switch' className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                    </label>
                                </td>
                                <td className="border px-4 py-6 flex justify-center items-center gap-4">
                                    {/* <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <path d="M5.72002 0.416194H24.1756C27.1048 0.416194 29.4794 2.79079 29.4794 5.72002V24.1755C29.4794 27.1047 27.1048 29.4794 24.1756 29.4794H5.72002C2.7908 29.4794 0.416194 27.1047 0.416194 24.1755V5.72002C0.416194 2.79079 2.79079 0.416194 5.72002 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                                        <path d="M19.1867 14.2387H13.2351V11.2429C13.2351 10.1411 14.2057 9.24503 15.3993 9.24503C16.5929 9.24503 17.5635 10.1411 17.5635 11.2429C17.5635 11.5186 17.8054 11.7424 18.1046 11.7424C18.4038 11.7424 18.6456 11.5186 18.6456 11.2429C18.6456 9.59016 17.1896 8.24609 15.3993 8.24609C13.609 8.24609 12.153 9.59016 12.153 11.2429V14.2387H11.6119C10.4211 14.2387 9.98877 15.1347 9.98877 15.7371V21.7307C9.98877 22.83 10.9594 23.2291 11.6119 23.2291H19.1867C20.3775 23.2291 20.8098 22.333 20.8098 21.7307V15.7371C20.8098 14.6378 19.8392 14.2387 19.1867 14.2387ZM19.7277 21.7247C19.7212 21.9555 19.6228 22.2302 19.1867 22.2302H11.6184C11.3685 22.2242 11.0709 22.1333 11.0709 21.7307V15.7431C11.0774 15.5123 11.1764 15.2376 11.6119 15.2376H19.1802C19.4301 15.2436 19.7277 15.335 19.7277 15.7371V21.7247ZM18.6456 18.7334C18.6456 19.0096 18.4038 19.2329 18.1046 19.2329H12.694C12.3954 19.2329 12.153 19.0096 12.153 18.7334C12.153 18.4572 12.3954 18.2339 12.694 18.2339H18.1046C18.4038 18.2339 18.6456 18.4572 18.6456 18.7334Z" fill="#2C3149" /></svg> */}
                                    <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <path d="M5.7708 0.416194H24.2264C27.1556 0.416194 29.5302 2.79079 29.5302 5.72002V24.1755C29.5302 27.1047 27.1556 29.4794 24.2264 29.4794H5.7708C2.84158 29.4794 0.466976 27.1047 0.466976 24.1755V5.72002C0.466976 2.79079 2.84157 0.416194 5.7708 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                                        <path d="M9.40729 17.1036L8.44458 21.0644L12.4052 20.1016L20.5635 11.9433C21.3917 11.1151 21.3917 9.77361 20.5635 8.94538C19.7353 8.11716 18.3939 8.11716 17.5656 8.94538L9.40729 17.1036Z" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M17.4172 10.8828L19.0489 12.5144" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.81372 19.5547L9.94986 20.6979" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.74 21.0625H21.1869" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" /></svg>
                                    {/* <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <path d="M5.82457 0.416194H24.2801C27.2093 0.416194 29.5839 2.79079 29.5839 5.72002V24.1755C29.5839 27.1047 27.2093 29.4794 24.2801 29.4794H5.82457C2.89535 29.4794 0.520687 27.1047 0.520687 24.1755V5.72002C0.520687 2.7908 2.89534 0.416194 5.82457 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                                        <path d="M13.4539 10.5391H20.9025" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.52441 10.5391H11.9579" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M19.8586 10.5391V19.3934C19.8586 20.1675 19.2929 20.7944 18.5945 20.7944H11.8696C11.1711 20.7944 10.6055 20.1675 10.6055 19.3934V10.5391" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M17.5557 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12.9092 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.2373 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.2158 8.19141C16.1891 8.19141 16.9792 9.0669 16.9792 10.1457V10.545H13.4556V10.1457C13.4556 9.0669 14.2456 8.19141 15.2189 8.19141H15.2158Z" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" /></svg> */}
                                    
                                </td>
                                <td className="border px-4 py-2">{new Date(lessonfile.created_at).toLocaleString()}</td>
                            </tr>
                            // lessonfile.mediafiles.map((media: any, mediaIndex: any) => (
                            //     <tr key={`${index}-${mediaIndex}`}>
                            //         <td className="border px-4 py-2">{media.id}</td>
                            //         <td className="border px-4 py-2">{media.filetype}</td>
                            //         <td className="border px-4 py-2">{media.filetype === 'Video' || media.filetype === 'Audio' ? media.duration : `${media.pages} pages`}</td>
                            //         <td className="border px-4 py-2">
                            //             <input
                            //                 type="checkbox"
                            //                 checked={media.demo}
                            //                 onChange={() => handleToggleChange(!lessonfile.demo)}
                            //             />
                            //         </td>
                            //         <td className="border px-4 py-2">
                            //             <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            //                 View File
                            //             </a>
                            //         </td>
                            //         <td className="border px-4 py-2">{media.filetype === 'video' ? media.duration : `${media.pages} page(s)`}</td>
                            //         {/* <td className="border px-4 py-2">
                            //             <input
                            //                 type="checkbox"
                            //                 checked={media.demo}
                            //                 onChange={() => handleToggleChange(!media.demo,media.id)} 
                            //             />
                            //         </td> */}
                            //         <td className="border px-4 py-2">
                            //             <label htmlFor="toggle-switch">
                            //                 <input type="checkbox" id="toggle-switch"
                            //                     checked={media.demo}
                            //                     onChange={() => handleToggleChange(!media.demo)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative' />
                            //             </label>
                            //         </td>
                            //         <td className="border px-4 py-6 flex justify-center items-center gap-4">
                            //             <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            //                 <path d="M5.72002 0.416194H24.1756C27.1048 0.416194 29.4794 2.79079 29.4794 5.72002V24.1755C29.4794 27.1047 27.1048 29.4794 24.1756 29.4794H5.72002C2.7908 29.4794 0.416194 27.1047 0.416194 24.1755V5.72002C0.416194 2.79079 2.79079 0.416194 5.72002 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                            //                 <path d="M19.1867 14.2387H13.2351V11.2429C13.2351 10.1411 14.2057 9.24503 15.3993 9.24503C16.5929 9.24503 17.5635 10.1411 17.5635 11.2429C17.5635 11.5186 17.8054 11.7424 18.1046 11.7424C18.4038 11.7424 18.6456 11.5186 18.6456 11.2429C18.6456 9.59016 17.1896 8.24609 15.3993 8.24609C13.609 8.24609 12.153 9.59016 12.153 11.2429V14.2387H11.6119C10.4211 14.2387 9.98877 15.1347 9.98877 15.7371V21.7307C9.98877 22.83 10.9594 23.2291 11.6119 23.2291H19.1867C20.3775 23.2291 20.8098 22.333 20.8098 21.7307V15.7371C20.8098 14.6378 19.8392 14.2387 19.1867 14.2387ZM19.7277 21.7247C19.7212 21.9555 19.6228 22.2302 19.1867 22.2302H11.6184C11.3685 22.2242 11.0709 22.1333 11.0709 21.7307V15.7431C11.0774 15.5123 11.1764 15.2376 11.6119 15.2376H19.1802C19.4301 15.2436 19.7277 15.335 19.7277 15.7371V21.7247ZM18.6456 18.7334C18.6456 19.0096 18.4038 19.2329 18.1046 19.2329H12.694C12.3954 19.2329 12.153 19.0096 12.153 18.7334C12.153 18.4572 12.3954 18.2339 12.694 18.2339H18.1046C18.4038 18.2339 18.6456 18.4572 18.6456 18.7334Z" fill="#2C3149" /></svg>
                            //             <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            //                 <path d="M5.7708 0.416194H24.2264C27.1556 0.416194 29.5302 2.79079 29.5302 5.72002V24.1755C29.5302 27.1047 27.1556 29.4794 24.2264 29.4794H5.7708C2.84158 29.4794 0.466976 27.1047 0.466976 24.1755V5.72002C0.466976 2.79079 2.84157 0.416194 5.7708 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                            //                 <path d="M9.40729 17.1036L8.44458 21.0644L12.4052 20.1016L20.5635 11.9433C21.3917 11.1151 21.3917 9.77361 20.5635 8.94538C19.7353 8.11716 18.3939 8.11716 17.5656 8.94538L9.40729 17.1036Z" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M17.4172 10.8828L19.0489 12.5144" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M8.81372 19.5547L9.94986 20.6979" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M13.74 21.0625H21.1869" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            //             <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            //                 <path d="M5.82457 0.416194H24.2801C27.2093 0.416194 29.5839 2.79079 29.5839 5.72002V24.1755C29.5839 27.1047 27.2093 29.4794 24.2801 29.4794H5.82457C2.89535 29.4794 0.520687 27.1047 0.520687 24.1755V5.72002C0.520687 2.7908 2.89534 0.416194 5.82457 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389" />
                            //                 <path d="M13.4539 10.5391H20.9025" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M9.52441 10.5391H11.9579" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M19.8586 10.5391V19.3934C19.8586 20.1675 19.2929 20.7944 18.5945 20.7944H11.8696C11.1711 20.7944 10.6055 20.1675 10.6055 19.3934V10.5391" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M17.5557 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M12.9092 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M15.2373 13.1445V18.1916" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" />
                            //                 <path d="M15.2158 8.19141C16.1891 8.19141 16.9792 9.0669 16.9792 10.1457V10.545H13.4556V10.1457C13.4556 9.0669 14.2456 8.19141 15.2189 8.19141H15.2158Z" stroke="#E72323" stroke-width="0.914307" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            //             {/* <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" title="Edit" />
                            //             <MdDeleteForever className="cursor-pointer text-gray-600 hover:text-gray-900" title="Delete" /> */}
                            //         </td>
                            //     </tr>
                            // ))
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add File</h3>
                            <h3 className="text-md font-medium leading-6 text-gray-900 mb-4">File Type</h3>
                            <select
                                className=" mt-1 border border-gray-300 bg-white px-4 py-[10px] rounded w-full"
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                                name="fileType"
                            >
                                <option value="Document">Document</option>
                                <option value="Audio">Audio</option>
                                <option value="Video">Video</option>
                                <option value="Video">Youtube</option>
                            </select>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File topic (English)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="file type"
                                        type="text"
                                        value={titleEnglish}
                                        onChange={(e) => setTitleEnglish(e.target.value)}
                                        name="titleEnglish"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File topic (Hindi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="file type"
                                        type="text"
                                        value={titleHindi}
                                        onChange={(e) => setTitleHindi(e.target.value)}
                                        name="titleHindi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File topic (Marathi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="file type"
                                        type="text"
                                        value={titleMarathi}
                                        onChange={(e) => setTitleMarathi(e.target.value)}
                                        name="titleMarathi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description"
                                        value={descriptionEnglish}
                                        onChange={(e) => setDescriptionEnglish(e.target.value)}
                                        name="descriptionEnglish"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Hindi)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description"
                                        value={descriptionHindi}
                                        onChange={(e) => setDescriptionHindi(e.target.value)}
                                        name="descriptionHindi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Marathi)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description"
                                        value={descriptionMarathi}
                                        onChange={(e) => setDescriptionMarathi(e.target.value)}
                                        name="descriptionMarathi"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-medium leading-6 text-gray-900 mb-4">Select File</h3>
                                <select
                                    multiple
                                    value={selectedFiles}
                                    onChange={handleSelectMultipleFiles}
                                    className="mt-1 block w-full border border-gray-300 py-2 px-3 bg-white rounded shadow-sm focus:outline-none" required
                                >
                                    {filteredFiles.map((file, index) => (
                                        <option key={index} value={file.id}>
                                            {file.id} - {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                                <div className="flex gap-4 items-center">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Pagination entries={lessonfiles.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>

        </div>
    );
};

export default AddFilesPage;
