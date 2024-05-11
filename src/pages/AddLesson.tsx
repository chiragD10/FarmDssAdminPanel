import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import Pagination from './Pagination';

const AddLessonsPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { courseId } = useParams();
    const [lessons, setLessons] = useState<any[]>([]);
    const [viewScreenshot, setViewScreenshot] = useState<boolean>(false);
    const [imgUrl, setimgUrl] = useState<string>()
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;
    const [currentPage, setCurrentPage] = useState(1);

    const handleAddLesson = () => {
        setShowModal(true);
    };

    useEffect(() => {

        const fetchLessons = async () => {
            if (courseId && token) {
                try {
                    const response = await axios.post(base_url+`/courses/course/lesson/id/`, { id: courseId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log(response.data.data)
                    setLessons(response.data.data);
                } catch (error) {
                    console.error('Error fetching lessons:', error);
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


        fetchLessons();
    }, [courseId, token]);

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const token = localStorage.getItem('authToken');
        const payload = {
            course_id: courseId,
            title_english: formData.get('lessonTitleEnglish'),
            title_hindi: formData.get('lessonTitleHindi'),
            title_marathi: formData.get('lessonTitleMarathi'),
            description_english: formData.get('lessonDescriptionEnglish'),
            description_hindi: formData.get('lessonDescriptionHindi'),
            description_marathi: formData.get('lessonDescriptionMarathi'),
            primary_image: formData.get('thumbnail'),
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        try {
            const response = await axios.post(base_url+'/courses/course/lesson/add/', payload, config);
            console.log('Lesson added successfully:', response.data);
            setShowModal(false);
            // navigate(`/add-file/${courseId}`);
        } catch (error) {
            console.error('Error adding lesson:', error);
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
        

        if (courseId && token) {
            try {
                const response = await axios.post(base_url+`/courses/course/lesson/id/`, { id: courseId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data.data)
                setLessons(response.data.data);
            } catch (error) {
                console.error('Error fetching lessons:', error);
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

    const sortedArray = [...lessons].sort((a, b) => {
        // Sorting logic based on sort key and sort order
        if (sortOrder) {
            // Ascending order
            return a[sortKey] > b[sortKey] ? 1 : -1;
        } else {
            // Descending order
            return a[sortKey] < b[sortKey] ? 1 : -1;
        }
    });

    const handleToggleChange = async (checked: boolean, lessonId: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };
        const body = {
            id: lessonId,
            intent: 'Lesson',
        };

        try {
            const response = await axios.post(base_url+'/courses/course/go_live/', body, config);
            console.log(response.data.message);
    
            // Update the local state
            setLessons(prevLessons => prevLessons.map(lesson => {
                console.log('')
                if (lesson.id === lessonId) {
                    return { ...lesson, go_live: checked };
                }
                return lesson;
            }));
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
        if (courseId && token) {
            try {
                const response = await axios.post(base_url+`/courses/course/lesson/id/`, { id: courseId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data.data)
                setLessons(response.data.data);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        }
    };
    // const handleLessonClick = (lessonId: any, lesson_name: string) => {
    //     navigate(`/add-file/${lessonId}`, {replace: true, state:{courseId, lesson_name}});
    // };

    return (
        <div className="container mx-auto p-4 mt-4">
            <div className='text-xcodegold font-poppins font-semibold'>{location.state}</div>
            <button
                onClick={handleAddLesson}
                className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-20 mr-12"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
                Add Lesson
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
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z"/></svg>
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

            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">
                                ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Image
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Lesson Name
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Description
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Status
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Action
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Created/Updated date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(lessons) && lessons.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, lessons.length)).map((lesson, index) => (
                        <tr key={lesson.id}>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                {lesson.lesson_id}
                            </td>
                            <td className="border px-4 py-2 text-gray-500">
                                    <img src={lesson.primary_image} alt="" className="w-10 h-10" onClick={() => zoomScreenshot(lesson.primary_image)} />
                                </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium cursor-pointer" >
                                <Link to={`/add-file/${lesson.lesson_id,courseId}`}
                                state={{course_name: location.state, lesson_name: lesson.title.english, lesson_id: lesson.lesson_id}}>{lesson.title.english}</Link>
                            </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                                {lesson.description.english}
                            </td>
                            <td className="border px-4 py-2 text-xcodebblue font-poppins font-medium">
                            <label htmlFor="toggle-switch">
                                <input type="checkbox" id="toggle-switch"
                                checked={lesson.go_live}
                                onChange={(e) => handleToggleChange(e.target.checked, lesson.lesson_id)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                            </label>
                            {/* <input
                                        type="checkbox"
                                        id={`live-${lesson.lesson_id}`}
                                        checked={lesson.go_live}
                                        onChange={(e) => handleToggleChange(e.target.checked, lesson.lesson_id)}
                                    /> */}
                            </td>
                            
                            <td className="border px-4 py-6 flex justify-center items-center gap-4">

                            <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
<path d="M5.7708 0.416194H24.2264C27.1556 0.416194 29.5302 2.79079 29.5302 5.72002V24.1755C29.5302 27.1047 27.1556 29.4794 24.2264 29.4794H5.7708C2.84158 29.4794 0.466976 27.1047 0.466976 24.1755V5.72002C0.466976 2.79079 2.84157 0.416194 5.7708 0.416194Z" fill="#CA9B64" fill-opacity="0.1" stroke="#CA9B64" stroke-width="0.832389"/>
<path d="M9.40729 17.1036L8.44458 21.0644L12.4052 20.1016L20.5635 11.9433C21.3917 11.1151 21.3917 9.77361 20.5635 8.94538C19.7353 8.11716 18.3939 8.11716 17.5656 8.94538L9.40729 17.1036Z" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.4172 10.8828L19.0489 12.5144" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.81372 19.5547L9.94986 20.6979" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.74 21.0625H21.1869" stroke="#2C3149" stroke-width="0.99652" stroke-linecap="round" stroke-linejoin="round"/></svg>
                           
                                {/* <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" title="Edit" />
                                <MdDeleteForever className="cursor-pointer text-gray-600 hover:text-gray-900" title="Delete" /> */}
                            </td>
                            <td className="border px-4 py-2 text-gray-900">{new Date(lesson.created_at).toLocaleString()}</td>  
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
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Lesson</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Lesson title in English"
                                        type="text"
                                        name="lessonTitleEnglish"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (Hindi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Lesson title in Hindi"
                                        type="text"
                                        name="lessonTitleHindi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title (Marathi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Lesson title in Marathi"
                                        type="text"
                                        name="lessonTitleMarathi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description in English"
                                        name="lessonDescriptionEnglish"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Hindi)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description in Hindi"
                                        name="lessonDescriptionHindi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description (Marathi)</label>
                                    <textarea
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Description in Marathi"
                                        name="lessonDescriptionMarathi"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    className="px-4 py-2 text-xcodegold rounded border border-xcodegold"
                                >
                                    Cancel
                                </button>
                                <div className="flex gap-4 items-center">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cover Image 
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white"
                                        name="thumbnail"
                                        accept="image/*"
                                        required
                                    />
                                </div>
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

            <Pagination entries={lessons.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>

        </div>
    );
};

export default AddLessonsPage;
