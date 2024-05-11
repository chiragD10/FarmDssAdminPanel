import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link} from 'react-router-dom';
import { FaShare, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import exportFromJSON from 'export-from-json';
import Pagination from './Pagination';
import EditModalCourses from './EditModalCourses';
import Share from './Share';
interface Webinar {
    id: number;
    topic_english: string;
    expiry_date: string;
}
interface Course {
    title_english:string;
    title_hindi:string;
    title_marathi:string;
    description_english:string;
    description_hindi:string;
    description_marathi:string;
    course_category_english:string;
    course_category_hindi:string;
    course_category_marathi:string;
    thumbnail: string;
    price: string;
    rating: string;
    crop_category: string;
    duration: string;
    pages: string;
    creator: string;
    referral_amount: string;
    go_live: boolean;
    webinar: number[];
    language:string;
    publish_date:Date;
}
interface Instructor {
    id: number;
    username: string;
}
interface Catagory {
    category: {
        id : number,
        english:string;
        hindi:string;
        marathi:string;
    };
}

const CoursesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [showShare, setShowShare] = useState(false)
    const [shareLink, setShareLink] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    const showEditModal = (course: any) => {
        setEditModalVisible(true);
        setCourse(course);
    };
    const [course, setCourse] = useState<any>()
    const [cId, setcId] = useState(0)
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const token = localStorage.getItem('authToken');
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [expiryDate, setExpiryDate] = useState('');
    const [catagories, setCatagories] = useState<any[]>([])
    const [files, setFiles] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { courseId } = useParams();
    const [crops, setCrops] = useState<any[]>([]);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
    const base_url = process.env.REACT_APP_API_URI
    const handleAddCourse = () => {
        setShowModal(true);
    };
    useEffect(() => {
        const getCurrentDateTimeLocal = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = `${now.getMonth() + 1}`.padStart(2, '0');
            const day = `${now.getDate()}`.padStart(2, '0');
            const hours = `${now.getHours()}`.padStart(2, '0');
            const minutes = `${now.getMinutes()}`.padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setExpiryDate(getCurrentDateTimeLocal());
    }, []);
    useEffect(() => {
        const fetchWebinars = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get(base_url+'/webinars/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setWebinars(response.data.webinars);
                } catch (error) {
                    console.error('Error fetching webinars:', error);
                }
            }
        };

        fetchWebinars();
    }, []);

    useEffect(() => {
        const fetchFiles = async () => {
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
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            }
        };

        fetchFiles();
    }, [token]);
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
    useEffect(() => {
        const fetchInstructors = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(base_url+'/users/creator/all/', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setInstructors(response.data.data.user);
            } catch (error) {
                console.error('Failed to fetch instructors:', error);
            }
        };

        fetchInstructors();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(base_url+'/courses/category/', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                setCatagories(response.data.category);
                // console.log(response.data.category)
                // console.log(categories)
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchCourses = async () => {
            if (token) {
                try {
                    const response = await axios.get(base_url+'/courses/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCourses(response.data.data);
                    console.log(courses)
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }
        };

        fetchCourses();
    }, [token]);


    const handleToggleChange = async (checked: boolean, courseId: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: courseId,
            intent: 'Course',
        };
    
        try {
            const response = await axios.post(base_url+'/courses/course/go_live/', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setCourses(prevCourses => prevCourses.map(course => {
                if (course.id === courseId) {
                    return { ...course, go_live: checked };
                }
                return course;
            }));
        } catch (error) {
            console.error('Error updating go live status:', error);
        }
    };
        
    const handleDeleteTopic = async (courseId: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: courseId
        };
        if (token) {
            try {
                await axios.post(base_url+'/courses/course/delete', body, config);
                try {
                    const response1 = await axios.get(base_url+'/courses/all/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCourses(response1.data.data);
                    console.log(courses)
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            } catch (error) {
                console.error('Error deleting topics', error);
            }
        }
    };

    function zoomScreenshot(url: string){
        setViewScreenshot(true);
        setimgUrl(url)
    };
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
        setViewScreenshot(!viewScreenshot);
        }
    };
    
    const handleSortClick = (key: string) => {
        if (key === sortKey) {
            setSortOrder(!sortOrder);
        } else {
            setSortKey(key);
            setSortOrder(true); // Default to ascending order when changing sort key
        }
    };

    const sortedArray = [...courses].sort((a, b) => {
        // Sorting logic based on sort key and sort order
        if (sortOrder) {
            // Ascending order
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            // Descending order
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            title: formData.get('title_english'),
            description: formData.get('description_english'),
            price: formData.get('price'),
            creator: formData.get('creator'),
            category: formData.get('category'),
            crop_category: formData.get('crop_category'),
            course_type: formData.get('course_type'),
            language: formData.get('language'),
            webinar: formData.get('webinar'),
            thumbnail: formData.get('thumbnail'),
            expiry_date: formData.get('expiry_date')
        };
        const token = localStorage.getItem('authToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        try {
            const response = await axios.post(base_url+'/courses/course/add/', formData, config);
            console.log('Course added successfully:', response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding course:', error);
        }

        if (token) {
            try {
                const response = await axios.get(base_url+'/courses/all/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCourses(response.data.data);
                console.log(courses)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        try {
            const response = await axios.get(base_url+'/courses/category', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setCatagories(response.data.category);
            // console.log(response.data.category)
            // console.log(categories)
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
        try {
            const response = await axios.get(base_url+'/users/creator/all/', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setInstructors(response.data.data.user);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
        }
        if (token) {
            try {
                const response = await axios.get(base_url+'/webinars/all/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setWebinars(response.data.webinars);
            } catch (error) {
                console.error('Error fetching webinars:', error);
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileDataUrl = reader.result as string;
                localStorage.setItem('uploadedFile', fileDataUrl);
                console.log('File stored in local storage:', fileDataUrl);
            };
            reader.readAsDataURL(file);
        }
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
    const handleOpenTextInNewWindow = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
        e.preventDefault(); // Prevents the default action of the anchor tag
        window.open('', '_blank')?.document.write(text); // Opens a new window and writes the text to it
    };
    const handleDownloadCSV = () => {
        const filename = 'courses'
        const filteredData = courses.map((course: Course) => {
            const { 
                    title_english,
                    title_hindi,
                    title_marathi,
                    description_english,
                    description_hindi,
                    description_marathi,
                    course_category_english,
                    course_category_hindi,
                    course_category_marathi,
                    thumbnail,
                    price,
                    rating,
                    crop_category,
                    duration,
                    pages,
                    creator,
                    referral_amount,
                    go_live,
                    webinar,
                    language,
                    publish_date
                
        } = course;
            return {         
                title_english,
                    title_hindi,
                    title_marathi,
                    description_english,
                    description_hindi,
                    description_marathi,
                    course_category_english,
                    course_category_hindi,
                    course_category_marathi,
                    thumbnail,
                    price,
                    rating,
                    crop_category,
                    duration,
                    pages,
                    creator,
                    referral_amount,
                    go_live,
                    webinar,
                    language,
                    publish_date
            };
        });
        
        const exportType = exportFromJSON.types.csv
        exportFromJSON({data:filteredData, fileName:filename, exportType})
    };
    // const handleCourseClick = (courseId: any, course_name: string) => {
    //     navigate(`/add-lesson/${courseId}`, { replace: true, state: { courseId, course_name } });
    // };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
            <div className='text-xcodegold font-poppins font-semibold'>Courses</div>
                <div className='space-x-2'>
                    <button onClick={handleDownloadCSV} className="px-4 py-2 bg-xcodegold text-white rounded">Download CSV</button>
                    <button onClick={handleAddCourse} className="px-4 py-2 bg-xcodegold text-white rounded">Add Course</button>
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

            <div className="overflow-x-auto">
                <table >
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('id')}}>
                                ID
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" >
                                Image
                            </th>

                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal">
                                Video URL
                            </th>
                            
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('course_category_english')}}>
                                Course Category
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('crop_category')}} >
                                Crop Category
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('title_english')}}>
                                Title English
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('title_hindi')}}>
                                Title Hindi
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('title_marathi')}}>
                                Title Marathi
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('description_english')}}>
                                Description English
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('language')}}>
                                Language
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal">
                                Webinar Linked
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('price')}}>
                                Subsription Amount
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('referral_amount')}}>
                                Referral Amount
                            </th>

                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('go_live')}}>
                                Status
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal">
                                Action
                            </th>
                            <th className="border px-4 py-2 text-xcodegrey font-poppins font-normal" onClick={() => {handleSortClick('publish_date')}}>
                                Created/Updated Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(sortedArray) && sortedArray.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, courses.length)).map((course) => (
                            <tr key={course[sortKey]}>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.id}</td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <img src={course.thumbnail} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(course.thumbnail)} />
                                </td>
                                
                                <td className="border px-4 py-2">
                                    <a href={course.intro_video.filetype === "Youtube" ? course.intro_video.yt_link : course.intro_video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                        View File
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.course_category.english}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">{course.crop_category}</td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                    <Link to={`/add-lesson/${course.id}`}
                                    state={course.title.english}>
                                        {course.title.english}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                    <Link to={`/add-lesson/${course.id}`}
                                    state={course.title.hindi}>
                                        {course.title.hindi}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                    <Link to={`/add-lesson/${course.id}`}
                                    state={course.title.marathi}>
                                        {course.title.marathi}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2 text-gray-500">
                                    <a href="#" onClick={(e) => handleOpenTextInNewWindow(e, course.description_english)}>
                                        {truncateText(course.title_english,10)}
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-gray-900">{course.language}</td>
                                <td className="border px-4 py-2 text-gray-900">{course.webinar}</td>
                                <td className="border px-4 py-2 text-gray-900">{course.price}</td>
                                <td className="border px-4 py-2 text-gray-900">{course.referral_amount}</td>
                                <td className="border px-4 py-2 text-gray-900">
                                    {/* <input
                                        type="checkbox"
                                        id={`live-${course.id}`}
                                        checked={course.go_live}
                                        onChange={(e) => handleToggleChange(e.target.checked, course.id)}
                                    /> */}
                                    <label htmlFor="toggle-switch">
                                        <input type="checkbox" id="toggle-switch"
                                        checked={course.go_live}
                                        onChange={(e) => handleToggleChange(e.target.checked, course.id)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                                    </label>
                                </td>
                                <td className="flex justify-center items-center gap-4 border px-4 py-6 text-gray-900">
                                <MdDeleteForever 
                                    className="cursor-pointer text-gray-600 hover:text-gray-900" 
                                    title="Delete"
                                    onClick={() => handleDeleteTopic(course.id)}
                                />
                                    <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" title="Edit" onClick={() => {
                                        setCourse(course)
                                        setcId(course.id)
                                        setEditModalVisible(true)
                                    }} />
                                    <FaShare className="cursor-pointer text-gray-600 hover:text-gray-900"
                                        onClick={() => {
                                            setShowShare(true)
                                            setShareLink(`https://farmdss.com/course_overview/${course.id}?referral_id=1234`)
                                        }}
                                        title="Share" />
                                </td>
                                <td className="border px-4 py-2 text-gray-900">{new Date(course.publish_date).toLocaleString()}</td>                
                               
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
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Course</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                                    <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in English" type="text" name="title_english" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (Hindi)</label>
                                    <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in Hindi" type="text" name="title_hindi" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (Marathi)</label>
                                    <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in Marathi" type="text" name="title_marathi" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                                    <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in English" name="description_english" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Hindi)</label>
                                    <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in Hindi" name="description_hindi" required/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Marathi)</label>
                                    <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in Marathi" name="description_marathi" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Price" type="number" name="price" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Category</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="course_category" required>
                                        <option value="">Select Category</option>
                                        {catagories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name.english}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Crop Category</label>
                                    <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Crop Category" type="text" name="crop_category" />
                                </div> */}
                                <div>
                                <label className="block text-sm font-medium text-gray-700">Crop Category</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="crop_category">
                                        <option value="">Select Crop</option>
                                        {crops.map((crop) => (
                                            <option key={crop.name.english} value={crop.name.english}>{crop.name.english}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Type</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="course_type" required>
                                        <option value="">Select Type</option>
                                        <option value="Free">Free</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Youtube">Youtube</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="language" required>
                                        <option value="">Select Language</option>
                                        <option value="English">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="Marathi">Marathi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Webinar ID</label>
                                    <select
                                        className="border border-gray-300 px-4 py-2 rounded"
                                        name="webinar"
                                    >
                                        <option value="">Select Webinar</option>
                                        {webinars.map((webinar) => (
                                            <option key={webinar.id} value={webinar.id}>{webinar.topic_english}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instructor</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="creator" required>
                                        <option value="">Select Instructor</option>
                                        {instructors.map((instructor) => (
                                            <option key={instructor.id} value={instructor.id}>{instructor.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Referral Amount</label>
                                    <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Referral Amount" type="number" name="referral_amount" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                    <input id="file-upload" type="file" className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" name="thumbnail" accept="image/*" required/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Expiry Date" type="number" name="expiry_days" required />
                                </div>
                            </div>
                            <div>
                                    <label className="block text-sm font-medium text-gray-700">Intro Video</label>
                                    <select className="border border-gray-300 px-4 py-2 rounded" name="intro_video" required>
                                        <option value="">Intro Video</option>
                                        {files.map((file, index) => (
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
            {showShare && <Share setShowShare={setShowShare} shareLink={shareLink}></Share>}
            {editModalVisible && <EditModalCourses catagories={catagories} webinars={webinars} files={files} crops={crops} instructors={instructors} course={course} setEditModalVisible={setEditModalVisible} editModalVisible={editModalVisible} />}
            <Pagination entries={courses.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
        </div>
    );
};

export default CoursesPage;
