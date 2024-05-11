import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
interface Props{
    creators: any;
    webinarId: number;
    webinar: any;
    editModalVisible: boolean;
    setEditModalVisible: (show: boolean) => void;
}

const EditModal: React.FC<Props> = ({ creators, webinarId, webinar: initialWebinar, editModalVisible, setEditModalVisible }) => {
    const [editedWebinar, setEditedWebinar] = useState(initialWebinar);
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;

    useEffect(() => {
        setEditedWebinar(initialWebinar);
    }, [initialWebinar]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedWebinar((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        formData.append('id', webinarId.toString());
    
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
            console.error("Failed to edit webinar:", error);
        }
    };
    
    
    return (
        <div>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full flex justify-center items-center z-10">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <h3 className="text-lg font-semibold leading-6 text-xcodebblue font-poppins font-semibold mb-4">Edit Webinar topic - Live</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (English)</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" name="topic_english" value={editedWebinar.topic_english} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (Hindi)</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" name="topic_hindi" value={editedWebinar.topic_hindi} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Topic (Marathi)</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Topic (Marathi)" name="topic_marathi" value={editedWebinar.topic_marathi} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (English)</span>
                                <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (English)" name="description_english" value={editedWebinar.description_english} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (Hindi)</span>
                                <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (Hindi)" name="description_hindi" value={editedWebinar.description_hindi} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Description (Marathi)</span>
                                <textarea className="border border-gray-300 px-4 py-2 rounded" placeholder="Description (Marathi)" name="description_marathi" value={editedWebinar.description_marathi} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Cover Image (Max 10 MB)</span>
                                <input id="file-upload" type="file" className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white" name='cover_image' accept="image/*" onChange={handleInputChange} />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Referral Amount</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Amount" name="referral_amount" value={editedWebinar.referral_amount} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Subscription Amount</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Amount" name="amount" value={editedWebinar.amount} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Webinar Link</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Link" name="link" value={editedWebinar.link} onChange={handleInputChange} required />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Live Date</span>
                                <input
                                    className="border border-gray-300 px-4 py-2 rounded"
                                    type="datetime-local"
                                    placeholder="Publish Date"
                                    name="publish_date"
                                    value={new Date(editedWebinar.publish_date).toISOString().slice(0, 16)}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Assign Speaker</span>
                                <select className="border border-gray-300 px-4 py-2 rounded" name="speaker" value={editedWebinar.speaker} onChange={handleInputChange} required>
                                    {/* <option value="">Select Speaker</option> */}
                                    {creators.map((creator: any) => (
                                        <option key={creator.id} value={creator.id}>{creator.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Select Language</span>
                                <select className="border border-gray-300 px-4 py-2 rounded" name="language" value={editedWebinar.language} onChange={handleInputChange} required>
                                    {/* <option value="">Select Language</option> */}
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Marathi">Marathi</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium leading-6 text-xcodebblue font-poppins font-semibold mb-2'>Add Relevant Courses</span>
                                <input className="border border-gray-300 px-4 py-2 rounded" type="text" placeholder="Add Courses ID" name="related_courses" value={editedWebinar.related_courses} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button type="button" className="px-4 py-2 text-xcodegold rounded border border-xcodegold" onClick={() => setEditModalVisible(false)}>Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-xcodegold text-white rounded">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
