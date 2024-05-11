import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';

interface TechnicalName {
    id: number;
    color: string;
    name: {
        english: string;
        hindi?: string;
        marathi?: string;
    };
    category: string;
    group: string;
}

const TechnicalNameListPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { subtopicId } = useParams();
    const [titleEnglish, setTitleEnglish] = useState('Pomegranate');
    const [technicalNameEnglish, setTechnicalNameEnglish] = useState('');
    const [technicalNameHindi, setTechnicalNameHindi] = useState('');
    const [technicalNameMarathi, setTechnicalNameMarathi] = useState('');
    const [category, setCategory] = useState('Biological');
    const [group, setGroup] = useState('Avermectins, Milbemycins');
    const [color, setColor] = useState('green');
    const [modeOfAction, setModeOfAction] = useState('Systemic');
    const [phi, setPhi] = useState('');
    const [isSafeForHoneyBees, setIsSafeForHoneyBees] = useState(false);
    const [mrl, setMrl] = useState('');
    const [technicalNames, setTechnicalNames] = useState<TechnicalName[]>([]);
    const base_url = process.env.REACT_APP_API_URI;

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
    };

    const handleAddTechnicalNameClick = () => {
        setShowModal(true);
    };
    const handleProductFileClick = (id: number) => {
        setShowProduct(true);
    };
    const handleCancelClick = () => {
        setShowModal(false);
        setShowProduct(false);
    };
    const handleSubmitTechnicalName = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            subtopic_id: subtopicId,
            name_english: technicalNameEnglish,
            name_hindi: technicalNameHindi,
            name_marathi: technicalNameMarathi,
            category: category,
            phi: phi,
            safe: isSafeForHoneyBees,
            group: group,
            color: color,
            mode_of_action: modeOfAction,
            mrl: mrl,
        };

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(base_url+'/kbank/crops/technicalnames/add/', payload, config);
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
        }
    };
    useEffect(() => {
        const fetchTechnicalNames = async () => {
            if (token && subtopicId) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    const response = await axios.post(base_url+`/kbank/crops/subtopic/technicalnames/id`, { id: subtopicId }, config);
                    setTechnicalNames(response.data.technicalnamelist.technicalnamelist);
                } catch (error) {
                    console.error('Error fetching technical names:', error);
                }
            }
        };

        fetchTechnicalNames();
    }, [token, subtopicId]);
    const handleProductClick = (id:any) => {
        navigate(`/add-product/${id}`);
    };
    const location = useLocation()
    return (
        <div className="container mx-auto p-4">
            <div className='text-xcodebblue font-poppins font-semibold mt-4'>{location.state.crop_name} &gt; {location.state.topic_name} &gt; {location.state.subtopic_name}</div>
            <div>
                <button
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12 mr-52"
                    style={{ position: 'absolute', top: '10px', right: '130px' }}
                >
                    Upload CSV
                </button>
                <button
                    onClick={handleAddTechnicalNameClick}
                    className="px-4 py-2 bg-xcodegold text-white rounded focus:outline-none mt-32 mr-12 mr-32"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    Add Technical Name
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
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
                        <tr>
                            <th className="border px-4 py-2 text-gray-400">ID</th>
                            <th className="border px-4 py-2 text-gray-400">Color</th>
                            <th className="border px-4 py-2 text-gray-400">Technical Name</th>
                            <th className="border px-4 py-2 text-gray-400">Category</th>
                            <th className="border px-4 py-2 text-gray-400">Group</th>
                            <th className="border px-4 py-2 text-gray-400">Linked With</th>
                            <th className="border px-4 py-2 text-gray-400">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicalNames.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage - 1, technicalNames.length)).map((technicalName) => (
                            <tr key={technicalName.id}>
                                <td className="border px-4 py-2">{technicalName.id}</td>
                                <td className="border px-4 py-2">{technicalName.color}</td>
                                <td className="border px-4 py-2">
                                    <Link to={`/add-product/${technicalName.id}`} state={{crop_name: location.state.crop_name, topic_name: location.state.topic_name, subtopic_name: location.state.subtopic_name, technicalName: technicalName.name.english}}>{technicalName.name.english}</Link>
                                </td>
                                <td className="border px-4 py-2">{technicalName.category}</td>
                                <td className="border px-4 py-2">{technicalName.group}</td>
                                <td className="border px-4 py-2">{/* Linked With Data */}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className='px-2 py-2 bg-xcodegold text-white rounded focus:outline-none'
                                        onClick={() => handleProductClick(technicalName.id)}
                                        >
                                        Add Product Name
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination entries={technicalNames.length} ataTime={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
            {showModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10'>
                    <div className='bg-white p-8 rounded-lg shadow-xl'>
                        <form onSubmit={handleSubmitTechnicalName} className='grid grid-cols-3 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Technical Name (English)
                                </label>
                                <input
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    type='text'
                                    value={technicalNameEnglish}
                                    onChange={(e) => setTechnicalNameEnglish(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Technical Name (Hindi)
                                </label>
                                <input
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    type='text'
                                    value={technicalNameHindi}
                                    onChange={(e) => setTechnicalNameHindi(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Technical Name (Marathi)
                                </label>
                                <input
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    type='text'
                                    value={technicalNameMarathi}
                                    onChange={(e) => setTechnicalNameMarathi(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Category
                                </label>
                                <select
                                    className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                    value={category}
                                    onChange={(e => {
                                        setCategory(e.target.value)
                                    })}
                                >
                                    <option value="Biological">Biological</option>
                                    <option value="Organic">Organic</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Chemical">Chemical</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Group
                                </label>
                                <select
                                    className="mt-1 border border-gray-300 px-4 py-2 rounded"
                                    value={group}
                                    onChange={(e => {
                                        setGroup(e.target.value)
                                    })}
                                >
                                    <option value="Avermectins, Milbemycins">Avermectins, Milbemycins</option>
                                    <option value="Benzimidazole and Dithiocarbamate">Benzimidazole and Dithiocarbamate</option>
                                    <option value="Benzimidazoles">Benzimidazoles</option>
                                    <option value="Bifenazate">Bifenazate</option>
                                    <option value="Botanicals">Botanicals</option>
                                    <option value="Buprofezin">Buprofezin</option>
                                    <option value="Carbamate">Carbamate</option>
                                    <option value="Chloronitriles">Chloronitriles</option>
                                    <option value="Cinnamic acid amides">Cinnamic acid amides</option>
                                    <option value="Cyanoacetamideoxime + Dithiocarbamates">Cyanoacetamideoxime + Dithiocarbamates</option>
                                    <option value="Diamides">Diamides</option>
                                    <option value="Ethyl phosphonates">Ethyl phosphonates</option>
                                    <option value="Flonicamid group">Flonicamid group</option>
                                    <option value="Hexythiazox">Hexythiazox</option>
                                    <option value="Inorganic group + Hexopyranosyl">Inorganic group + Hexopyranosyl</option>
                                    <option value="Antibiotic">Antibiotic</option>
                                    <option value="Inorganic group">Inorganic group</option>
                                    <option value="Microbial">Microbial</option>
                                    <option value="Microorganism">Microorganism</option>
                                    <option value="Neonicotinoids">Neonicotinoids</option>
                                    <option value="Organophosphates + Neonicotinoids">Organophosphates + Neonicotinoids</option>
                                    <option value="Organophosphates + Pyrethroids Pyrethrins">Organophosphates + Pyrethroids Pyrethrins</option>
                                    <option value="Organophosphates">Organophosphates</option>
                                    <option value="Phenylpyrazoles">Phenylpyrazoles</option>
                                    <option value="Phosphorothiolates">Phosphorothiolates</option>
                                    <option value="Phthalimides">Phthalimides</option>
                                    <option value="Propargite">Propargite</option>
                                    <option value="Pyrethroids Pyrethrins">Pyrethroids Pyrethrins</option>
                                    <option value="Pyridinylethylbenzamide group">Pyridinylethylbenzamide group</option>
                                    <option value="Pyridinylmethyl benzamides + Ethyl phosponates">Pyridinylmethyl benzamides + Ethyl phosponates</option>
                                    <option value="Spinosyns">Spinosyns</option>
                                    <option value="Tetronic and Tetramic acid derivatives">Tetronic and Tetramic acid derivatives</option>
                                    <option value="Triazole + oximinoacetates">Triazole + oximinoacetates</option>
                                    <option value="Triazoles + Methoxyacrylates">Triazoles + Methoxyacrylates</option>
                                    <option value="Triazoles group + Benzimidazole group">Triazoles group + Benzimidazole group</option>
                                    <option value="Triazoles group">Triazoles group</option>
                                    <option value="Triazolobenzothiazole + Dithiocarbamate group">Triazolobenzothiazole + Dithiocarbamate group</option>
                                    <option value="Valinamide carbamates + Dithiocarbamates">Valinamide carbamates + Dithiocarbamates</option>

                                </select>

                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Color
                                </label>

                                <select
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                >
                                    <option value="green">Green</option>
                                    <option value="blue">Blue</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="red">Red</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Mrl
                                </label>
                                <input
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    type='text'
                                    value={mrl}
                                    onChange={(e) => setMrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Mode of Action
                                </label>
                                <select
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    value={modeOfAction}
                                    onChange={(e) => setModeOfAction(e.target.value)}
                                >
                                    <option value="Systemic">Systemic</option>
                                    <option value="Non Systemic">Non Systemic</option>
                                    <option value="Systemic + Non Systemic">Systemic + Non Systemic</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    PHI
                                </label>
                                <input
                                    className='mt-1 border border-gray-300 px-4 py-2 rounded'
                                    type='text'
                                    value={phi}
                                    onChange={(e) => setPhi(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Is Safe For Honey Bees
                                </label>
                                
                                <input type="checkbox" id="toggle-switch"
                                        checked={isSafeForHoneyBees}
                                        onChange={(e) => setIsSafeForHoneyBees(e.target.checked)} className='cursor-pointer h-6 w-12 rounded-full appearance-none bg-xcodedarkgrey border-2 border-grey checked:bg-xcodegold transition duration-200 relative'/>
                            </div>
                            <div className='flex justify-between'>
                                <button
                                    type='button'
                                    onClick={handleCancelClick}
                                    className='px-4 py-2 text-xcodegold border border-xcodegold rounded'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-xcodegold text-white rounded'
                                >
                                    Add Technical Name
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicalNameListPage;
