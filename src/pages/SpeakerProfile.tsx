import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import WebinarTable from './WebinarTable';
import CoursesTable from './CoursesTable';



function truncateText(text: string): string {
    let truncatedText = '';
    let totalChars = 0;
    // for (let i = 0; i < text.length; i++) {
    //     truncatedText += text[i];
    //     totalChars++;
      
    //     if (totalChars % 25 === 0) { // Check if 25 characters have been added
    //         truncatedText += '\n';
    //     }
    // }
    return truncatedText;
}

const SpeakerProfile: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const location = useLocation()
    console.log(location)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tableType, setTableType] = useState<"Webinars" | "Courses">("Webinars")
    const token = localStorage.getItem('authToken');
    const base_url = process.env.REACT_APP_API_URI;


    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handleTableType = (type: 'Webinars' | 'Courses') => {
        setTableType(type);
    };


  return (

    <div className='container mx-auto p-4'>
        <div className='text-xcodebblue font-poppins font-semibold mb-4 mt-4'>User Profile</div>
        <div className='grid grid-cols-2 gap-x-8'>
    <div className='flex flex-col justify-center'>
        <img 
            className='p-4 rounded-full' 
            src={location.state.user.profile_image} 
            alt="Profile" 
            style={{ width: '500px', height: '500px', objectFit: 'cover', borderRadius: '50%' }} 
        />
        <button className='bg-xcodegold text-white px-4 py-2 rounded mt-4'>
            Edit Data
        </button>
    </div>
    <div className='flex flex-col'>
        <div className='p-8'>Speaker Name:
            <div className='font-medium'>{location.state.user.username}</div>
        </div>
        <div className='p-8'>Education:
            <div className='font-medium'>{location.state.user.education_english}</div>
        </div>
        <div className='p-8'>Description:
            <div className='font-medium'>{location.state.user.description_english}</div>
        </div>
    </div>
</div>

        <div className="flex justify-between items-center mb-4">
            <div>
                <button onClick={() => handleTableType('Webinars')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${tableType === 'Webinars' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Webinars</button>
                <button onClick={() => handleTableType('Courses')} className={`px-4 py-2 bg-xcodewhite font-poppins font-semibold ${tableType === 'Courses' ? 'text-xcodegold underline underline-offset-8' : 'text-xcodegrey'}`}>Courses</button>
            </div>
        </div>

        <div className='overflow-x-auto'>
            {tableType === "Courses" ? <CoursesTable id={location.state.user.id}/> : <WebinarTable id={location.state.user.id}/>}
        </div>
        
    </div>
  );
};

export default SpeakerProfile;
