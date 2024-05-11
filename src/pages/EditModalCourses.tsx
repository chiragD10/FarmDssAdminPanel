import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Props {
    catagories: any;
    crops: any;
    files: any;
    webinars: any;
    instructors: any;
    course: any;
    editModalVisible: boolean;
    setEditModalVisible: (show: boolean) => void;
}

const EditModalCourses: React.FC<Props> = ({ catagories, crops, webinars, instructors, files, course: initialCourse, editModalVisible, setEditModalVisible }) => {
    const [editedCourse, setEditedCourse] = useState(initialCourse);
    console.log(editedCourse)
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;

    useEffect(() => {
        setEditedCourse(initialCourse);
    }, [initialCourse]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedCourse((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const coverImageInput = event.currentTarget.querySelector('input[name="cover_image"]') as HTMLInputElement | null;

        if (coverImageInput && !coverImageInput.files?.length) {
            formData.delete('cover_image');
            console.log("cover_image field deleted from formData");
        } else if (coverImageInput === null) {
            console.error("cover_image input element not found");
        } else {
            console.log("cover_image field remains in formData");
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        if (!token) {
            console.error("Token is not available. Make sure you're logged in.");
            return;
        }

        try {
            await axios.post(base_url + `/webinars/webinar/update`, formData, config);
            setEditModalVisible(false);
        } catch (error) {
            console.error("Failed to edit course:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Course</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                            <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in English" type="text" name="title_english" value={editedCourse.title_english} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title (Hindi)</label>
                            <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in Hindi" type="text" name="title_hindi" value={editedCourse.title_hindi} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title (Marathi)</label>
                            <input className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Title in Marathi" type="text" name="title_marathi"value={editedCourse.title_marathi} onChange={handleInputChange}  required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                            <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in English" name="description_english" value={editedCourse.description_english} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (Hindi)</label>
                            <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in Hindi" name="description_hindi" value={editedCourse.description_hindi} onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (Marathi)</label>
                            <textarea className="mt-1 border border-gray-300 px-4 py-2 rounded" placeholder="Description in Marathi" name="description_marathi" value={editedCourse.description_marathi} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Price" type="number" name="price" value={editedCourse.price} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Category</label>
                            <select className="border border-gray-300 px-4 py-2 rounded" name="course_category" value={editedCourse.course_category_english} onChange={handleInputChange} required>
                                {catagories.map((category: any) => (
                                    <option key={category.id} value={category.id}>{category.name.english}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Crop Category</label>
                            <select className="border border-gray-300 px-4 py-2 rounded" name="crop_category" value={editedCourse.crop_category} onChange={handleInputChange}>
                                {crops.map((crop: any) => (
                                    <option key={crop.name.english} value={crop.name.english}>{crop.name.english}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Type</label>
                            <select className="border border-gray-300 px-4 py-2 rounded" name="course_type" value={editedCourse.course_type} onChange={handleInputChange} required>
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                                <option value="Youtube">Youtube</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Language</label>
                            <select className="border border-gray-300 px-4 py-2 rounded" name="language" value={editedCourse.language} onChange={handleInputChange} required>
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
                                value={editedCourse.webinar}
                                onChange={handleInputChange}
                            >
                                {webinars.map((webinar: any) => (
                                    <option key={webinar.id} value={webinar.id}>{webinar.topic_english}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instructor</label>
                            <select className="border border-gray-300 px-4 py-2 rounded" name="creator" value={editedCourse.creator} onChange={handleInputChange} required>
                                {instructors.map((instructor: any) => (
                                    <option key={instructor.id} value={instructor.id}>{instructor.username}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Referral Amount</label>
                            <input className="border border-gray-300 px-4 py-2 rounded" placeholder="Referral Amount" type="number" name="referral_amount" value={editedCourse.referral_amount} onChange={handleInputChange}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                            <input id="file-upload" type="file" className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" name="thumbnail" accept="image/*" required/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Expiry Date</span>
                            <input
                                className="border border-gray-300 px-4 py-2 rounded"
                                type="datetime-local"
                                placeholder="Expiry Date"
                                name="expiry_date"
                                value={new Date(editedCourse.publish_date).toISOString().slice(0, 16)}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={() => setEditModalVisible(false)}
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
    );
};

export default EditModalCourses;
