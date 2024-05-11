import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface File {
    id: number;
    name: string;
    mediafiles: any;
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
    filetype: string
}
const AddSubTopicFilesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const token = localStorage.getItem('authToken');
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [fileType, setFileType] = useState('Document');
    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleHindi, setTitleHindi] = useState('');
    const [titleMarathi, setTitleMarathi] = useState('');
    const [descriptionEnglish, setDescriptionEnglish] = useState('');
    const [descriptionHindi, setDescriptionHindi] = useState('');
    const [descriptionMarathi, setDescriptionMarathi] = useState('');
    const { subtopicId } = useParams();
    const [subtopicsfiles, setSubTopicsFiles] = useState<any>([])
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const base_url = process.env.REACT_APP_API_URI

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        const fetchSubTopicsFiles = async () => {
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                try {
                    const response = await axios.post(base_url+'/kbank/crops/topics/subtopics/files/', { id: subtopicId }, config);
                    setSubTopicsFiles(response.data.subtopics.subtopics);
                } catch (error) {
                    console.error('Error fetching crops:', error);
                }
            }
        };

        fetchSubTopicsFiles();
    }, [token]);
    const handleAddSubTopic = () => {
        setShowModal(true);
    };
    useEffect(() => {
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
    }, []);

    const handleAddSubTopicFile = () => {
        setShowModal(true);
    };

    const SubTopicFiles = new Array(30).fill({

    });
    const handleSelectMultipleFiles = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFiles = Array.from(event.target.selectedOptions).map(option => option.value);
        setSelectedFiles(selectedFiles);
    };


    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(Number(event.target.value));
    };
    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            subtopic_id: subtopicId,
            title_english: titleEnglish,
            title_hindi: titleHindi,
            title_marathi: titleMarathi,
            description_english: descriptionEnglish,
            description_hindi: descriptionHindi,
            description_marathi: descriptionMarathi,
            lesson: subtopicId !== undefined ? subtopicId : undefined,
            mediafiles: selectedFiles.map(id => parseInt(id)),
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
        try {
            const response = await axios.post(base_url+'/kbank/crops/topics/subtopics/files/add/', payload, config);
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
            console.error(error);

        }
    };

    const handleSubSubTopicFileClick = (SubTopicFileId: any) => {
        navigate(`/add-subtopic/id:${SubTopicFileId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodebblue font-poppins font-semibold mt-4'>Files</div>
            <div>
                <button
                    onClick={handleAddSubTopicFile}
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12"
                    style={{ position: 'absolute', top: '10px', right: '100px' }}
                >
                    Add File
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
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6-1 1 7 7 7-7-1-1-6 6z" /></svg>
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
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">
                                ID
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                File
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Title (English)
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                Language
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                File Type
                            </th>
                            <th className="border px-4 py-2 text-gray-400">
                                File Link
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {subtopicsfiles.subtopicfiles && subtopicsfiles.subtopicfiles.map((subtopicfile: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <p className="text-gray-900 whitespace-no-wrap">{subtopicfile.subtopic_id}</p>
                                </td>
                                <td className="border px-4 py-2">
                                    {subtopicfile.mediafiles.map((mediafile: any, index: number) => (
                                        <div key={index}>
                                            <a href={mediafile.url} target="_blank" rel="noopener noreferrer">{mediafile.name}</a>
                                        </div>
                                    ))}
                                </td>
                                <td className="border px-4 py-2">
                                    {subtopicfile.title.english}
                                </td>
                                <td className="border px-4 py-2">
                                    English
                                </td>
                                <td className="border px-4 py-2">
                                    {subtopicfile.mediafiles[0].filetype}
                                </td>
                                <td className="border px-4 py-2">
                                    <a href={subtopicfile.mediafiles[0].url} target="_blank" rel="noopener noreferrer">File Link</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Files</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">File Type</label>
                                <select
                                    className=" mt-1 border border-gray-300 bg-white px-4 py-[10px] rounded w-full"
                                    value={fileType}
                                    onChange={(e) => setFileType(e.target.value)}
                                    name="fileType"
                                    required
                                >
                                    <option value="Document">Document</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Video">Video</option>
                                </select>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File topic (English)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Brand Name"
                                        type="text"
                                        value={titleEnglish}
                                        onChange={(e) => setTitleEnglish(e.target.value)}
                                        name="titleEnglish"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File topic (Hindi)</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                        placeholder="Company Name"
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
                                        placeholder="Dosage"
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
                                    className="mt-1 block w-full border border-gray-300 py-2 px-3 bg-white rounded shadow-sm focus:outline-none"
                                    required
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
                                    className="px-4 py-2 text-xcodegold border border-xcodegold rounded "
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

export default AddSubTopicFilesPage;
