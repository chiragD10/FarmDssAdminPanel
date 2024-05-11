import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaCalendarAlt, FaBell, FaCube, FaCopy, FaBroadcastTower, FaUser, FaShoppingBasket, FaChartLine, FaCreditCard, FaNewspaper, FaYoutube, FaShoppingBag, FaDesktop, FaChalkboardTeacher } from 'react-icons/fa';
import Logo from "../images/Logo.svg";

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-64 h-screen bg-xcodeoffwhite text-gray-400 fixed">
            <div className="flex items-center justify-start mt-10 ml-6 mb-10">
                <img src={Logo} alt="Logo" className="h-8" />
            </div>
            <nav className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
                <ul>
                <li className="group">
                        <Link to="/files" className={`flex items-center py-2 px-6 ${location.pathname === '/files' ? 'text-xcodegold' : ''}`}>
                            <FaDesktop className="mr-3" />
                            Files
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/dashboard" className={`flex items-center py-2 px-6 ${location.pathname === '/dashboard' ? 'text-xcodegold' : ''}`}>
                            <FaTachometerAlt className="mr-3" />
                            Dashboard
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/knowledge-bank" className={`flex items-center py-2 px-6 ${location.pathname === '/knowledge-bank' ? 'text-xcodegold' : ''}`}>
                            <FaBook className="mr-3" />
                            Knowledge Bank
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/schedule" className={`flex items-center py-2 px-6 ${location.pathname === '/schedule' ? 'text-xcodegold' : ''}`}>
                            <FaCalendarAlt className="mr-3" />
                            Schedule
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/module" className={`flex items-center py-2 px-6 ${location.pathname === '/module' ? 'text-xcodegold' : ''}`}>
                            <FaCube className="mr-3" />
                            Module
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/add-webinar" className={`flex items-center py-2 px-6 ${location.pathname === '/webinar' ? 'text-xcodegold' : ''}`}>
                            <FaBroadcastTower className="mr-3" />
                            Webinar
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/farmer" className={`flex items-center py-2 px-6 ${location.pathname === '/farmer' ? 'text-xcodegold' : ''}`}>
                            <FaUser className="mr-3" />
                            Farmer
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/buyer" className={`flex items-center py-2 px-6 ${location.pathname === '/buyer' ? 'text-xcodegold' : ''}`}>
                            <FaShoppingBasket className="mr-3" />
                            Buyer
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/agri-input-dealer" className={`flex items-center py-2 px-6 ${location.pathname === '/agri-input-dealer' ? 'text-xcodegold' : ''}`}>
                            <FaChartLine className="mr-3" />
                            Agri Input Dealer
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/agri-input-company" className={`flex items-center py-2 px-6 ${location.pathname === '/agri-input-company' ? 'text-xcodegold' : ''}`}>
                            <FaCreditCard className="mr-3" />
                            Agri Input Company
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/service-provider" className={`flex items-center py-2 px-6 ${location.pathname === '/service-provider' ? 'text-xcodegold' : ''}`}>
                            <FaNewspaper className="mr-3" />
                            Service Provider
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/payment" className={`flex items-center py-2 px-6 ${location.pathname === '/payment' ? 'text-xcodegold' : ''}`}>
                            <FaCreditCard className="mr-3" />
                            Payment
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/news" className={`flex items-center py-2 px-6 ${location.pathname === '/news' ? 'text-xcodegold' : ''}`}>
                            <FaNewspaper className="mr-3" />
                            News
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/youtube" className={`flex items-center py-2 px-6 ${location.pathname === '/youtube' ? 'text-xcodegold' : ''}`}>
                            <FaYoutube className="mr-3" />
                            BTGore Youtube
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/vendor" className={`flex items-center py-2 px-6 ${location.pathname === '/vendor' ? 'text-xcodegold' : ''}`}>
                            <FaShoppingBag className="mr-3" />
                            Vendor
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/courses" className={`flex items-center py-2 px-6 ${location.pathname === '/courses' ? 'text-xcodegold' : ''}`}>
                            <FaDesktop className="mr-3" />
                            Courses
                        </Link>
                    </li>
                    
                    <li className="group">
                        <Link to="/offers" className={`flex items-center py-2 px-6 ${location.pathname === '/offers' ? 'text-xcodegold' : ''}`}>
                            <FaBell className='mr-3'/>
                            Offers
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/creator" className={`flex items-center py-2 px-6 ${location.pathname === '/creator' ? 'text-xcodegold' : ''}`}>
                            <FaChalkboardTeacher className="mr-3" />
                            Speaker
                        </Link>
                    </li>
                    <li className="group">
                        <Link to="/catagory" className={`flex items-center py-2 px-6 ${location.pathname === '/catagory' ? 'text-xcodegold' : ''}`}>
                            <FaChalkboardTeacher className="mr-3" />
                            Course Catagory List
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
