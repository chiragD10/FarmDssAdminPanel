import React, { useState, useEffect } from 'react';
import axios from 'axios';
import exportFromJSON from 'export-from-json';

interface Files {
    id: number;
    url: string;
    yt_link: string;
    uploaded_at: Date;
    filetype: string;
    name: string;
    duration: string;
    pages: number;

}

const FilesPage: React.FC = () => {
    const [itemsPerPage, setItemsPerPage] = useState(1000);
    const [showModal, setShowModal] = useState(false);
    const [fileType, setFileType] = useState('Document');
    const [file, setFile] = useState<File | null>(null);
    const [duration, setDuration] = useState('');
    const [name, setName] = useState('');
    const [pages, setPages] = useState('');
    const [files, setFiles] = useState<Files[]>([]);
    const [yt_link, setYt_link] = useState("")
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('authToken');
    const [time, setTime] = useState("");
    const [sortKey, setSortKey] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
    const base_url = process.env.REACT_APP_API_URI;

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
                    console.log(response.data)
                    console.log(response.data.data)
                    // console.log(response.data.message)
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            }
        };
        fetchFiles();
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
        //     } catch (error) {
        //         console.error('Error fetching files:', error);
        //     }
        // };

        // fetchFiles();
    }, []);
    const handleDownloadCSV = () => {
        const f = files
        const filename = 'files'
        const exportType = exportFromJSON.types.csv
        exportFromJSON({data:f, fileName:filename, exportType})
    };

    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('filetype', fileType);
        formData.append('name', name);

        if (file) {
            formData.append('url', file);
        }
        formData.append('duration', duration);
        formData.append('pages', pages);
        formData.append('yt_link', yt_link)


        try {
            const response = await fetch(base_url+'/files/upload/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('File uploaded successfully:', jsonResponse);
                setShowModal(false);
            } else {
                const errorResponse = await response.json();
                console.error('Failed to upload file:', errorResponse);
            }
        } catch (error) {
            console.error('Error uploading file:', error);

        }
        finally {
            setLoading(false); 
          }
        if (token) {
            try {
                
                const response = await axios.get(base_url+'/files/all/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setFiles(response.data.files);
                console.log(files)
                console.log(response.data)
                console.log(response.data.data)
                // console.log(response.data.message)
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        }
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

    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodegold font-poppins font-semibold'>Files</div>
            <div className='flex justify-between'>
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
            <div className='space-x-2'>
                <button
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                onClick={() => setShowModal(true)}
                > 
                   Add File
                </button>
                <button
                onClick={handleDownloadCSV}
                className="h-12 px-4 py-2 bg-xcodegold text-white rounded"
                >
                    Download CSV
                </button>

            </div>
        </div>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">ID</th>
                            <th className="border px-4 py-2 text-gray-400">File Type</th>
                            <th className="border px-4 py-2 text-gray-400">Name</th>
                            <th className="border px-4 py-2 text-gray-400">Link</th>
                            <th className="border px-4 py-2 text-gray-400">Duration / Pages</th>
                            <th className="border px-4 py-2 text-gray-400">Uploaded At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(files) && files.slice(0, itemsPerPage).map((file, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{file.id}</td>
                                <td className="border px-4 py-2">{file.filetype}</td>
                                <td className="border px-4 py-2">{file.name}</td>
                                <td className="border px-4 py-2">
                                    <a href={file.filetype === "Youtube" ? file.yt_link : file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                        View File
                                    </a>
                                </td>
                                
                                <td className="border px-4 py-2">{file.filetype === "Document" ? file.pages : file.duration}</td>
                                <td className="border px-4 py-2">{new Date(file.uploaded_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                    {loading && <div className="loader">Loading...</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add File</h3>
                            <div className='flex justify-between gap-6'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">File Name</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded w-full"
                                        placeholder="Name"
                                        type="text"
                                        name="filename"
                                       
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div >
                                    <label className="block text-sm font-medium text-gray-700">File Type</label>
                                    <select
                                        className=" mt-1 border border-gray-300 bg-white px-4 py-[10px] rounded w-full"
                                
                                        onChange={(e) => setFileType(e.target.value)}
                                        name="fileType"
                                    >
                                        <option value="Document">Document</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Video">Video</option>
                                        <option value="Youtube">Youtube</option>
                                    </select>
                                </div>
                            </div>
                            {fileType === 'Document' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pages</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded w-full"
                                        placeholder="Number of pages"
                                        type="number"
                                        name="pages"
                                        onChange={(e) => setPages(e.target.value)}
                                    />
                                </div>
                            )}

                            {fileType !== 'Document' && fileType && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded w-full"
                                        type="text"
                                        placeholder="Duration (e.g., 1:30:00)"
                                       
                                        onChange={(e) => setDuration(e.target.value)}
                                        name="duration"
                                    />

                                </div>

                            )}

                            {fileType === 'Youtube' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">YT Link</label>
                                    <input
                                        className="mt-1 border border-gray-300 px-4 py-2 rounded w-full"
                                        placeholder="Youtube Link"
                                        type="string"
                                        name="yt_link"
                                     
                                        onChange={(e) => setYt_link(e.target.value)}
                                    />
                                </div>
                            )}  

                            {fileType !== 'Youtube' && (
                                <div className="mt-4">
                                    
                                    <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xcodegold file:text-white"
                                    // name="image"
                                    // accept="image/*"
                                    />
                                    {/* {fileName && <div className="mt-2 text-sm text-gray-600">File: {fileName}</div>} */}
                                </div>
                            )}

                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button" disabled={loading}
                                    onClick={handleCancelClick}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={loading}
                                    className="px-4 py -2 bg-green-500 text-white rounded hover:bg-green-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilesPage;
