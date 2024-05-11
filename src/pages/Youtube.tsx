import React, { useState } from 'react';

const Youtube: React.FC = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        linkEnglish: '',
        linkHindi: '',
        linkMarathi: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(5);
    const base_url = process.env.REACT_APP_API_URI;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setEntries([...entries, formData]);
        setShowModal(false);
        setFormData({ id: '', title: '', linkEnglish: '', linkHindi: '', linkMarathi: '' });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mx-12 my-16">
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded fixed top-20 right-1"
            >
                Add New Entry
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl" style={{ width: '50%', margin: 'auto' }}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="ID"
                                className="border-2 p-2 rounded w-full"
                                required
                            />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="border-2 p-2 rounded w-full"
                                required
                            />
                            <input
                                type="text"
                                name="linkEnglish"
                                value={formData.linkEnglish}
                                onChange={handleChange}
                                placeholder="Link (English)"
                                className="border-2 p-2 rounded w-full"
                                required
                            />
                            <input
                                type="text"
                                name="linkHindi"
                                value={formData.linkHindi}
                                onChange={handleChange}
                                placeholder="Link (Hindi)"
                                className="border-2 p-2 rounded w-full"
                                required
                            />
                            <input
                                type="text"
                                name="linkMarathi"
                                value={formData.linkMarathi}
                                onChange={handleChange}
                                placeholder="Link (Marathi)"
                                className="border-2 p-2 rounded w-full"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">ID</th>
                            <th className="border px-4 py-2 text-gray-400">Title</th>
                            <th className="border px-4 py-2 text-gray-400">Link (English)</th>
                            <th className="border px-4 py-2 text-gray-400">Link (Hindi)</th>
                            <th className="border px-4 py-2 text-gray-400">Link (Marathi)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((entry, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{entry.id}</td>
                                <td className="border px-4 py-2">{entry.title}</td>
                                <td className="border px-4 py-2">
                                    <a href={entry.linkEnglish} target="_blank" rel="noopener noreferrer">
                                        {entry.linkEnglish}
                                    </a>
                                </td>
                                <td className="border px-4 py-2">
                                    <a href={entry.linkHindi} target="_blank" rel="noopener noreferrer">
                                        {entry.linkHindi}
                                    </a>
                                </td>
                                <td className="border px-4 py-2">
                                    <a href={entry.linkMarathi} target="_blank" rel="noopener noreferrer">
                                        {entry.linkMarathi}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                <ul className="flex list-none p-4">
                    {entriesPerPage < entries.length &&
                        [...Array(Math.ceil(entries.length / entriesPerPage))].map((_, index) => (
                            <li key={index} className="mr-2">
                                <button
                                    onClick={() => paginate(index + 1)}
                                    className={`px-3 py-1 rounded-full ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Youtube;
