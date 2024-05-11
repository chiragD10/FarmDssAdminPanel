import React from 'react';
import Buyer from "../images/BuyerGraph.svg";
import Farmer from "../images/FarmerGraph.svg";
import Service from "../images/ServiceGraph.svg";

const Dashboard: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-md mt-12 mx-12">
      {/* Card for Farmers */}
      <div className="flex items-center">
        <div className="flex flex-col mr-4">
          <h2 className="text-lg font-semibold">Farmers</h2>
          <p className="text-3xl font-bold">31721</p>
          <p className="text-sm text-yellow-500">+20% since last month</p>
        </div>
        <div className="border-l border-gray-300" />
        <img src={Farmer} alt="Farmer Graph" className="ml-4" />
      </div>

      {/* Vertical Divider */}
      <div className="border-l border-gray-300" /> 

      {/* Card for Buyers */}
      <div className="flex items-center">
        <div className="flex flex-col mr-4">
          <h2 className="text-lg font-semibold">Buyers</h2>
          <p className="text-3xl font-bold">786</p>
          <p className="text-sm text-blue-500">+20% since last month</p>
        </div>
        <div className="border-l border-gray-300" />
        <img src={Buyer} alt="Buyer Graph" className="ml-4" />
      </div>

      {/* Vertical Divider */}
      <div className="border-l border-gray-300" /> 

      {/* Card for Service Providers */}
      <div className="flex items-center">
        <div className="flex flex-col mr-4">
          <h2 className="text-lg font-semibold">Service Providers</h2>
          <p className="text-3xl font-bold">2095</p>
          <p className="text-sm text-green-500">-12% since last month</p>
        </div>
        <div className="border-l border-gray-300" />
        <img src={Service} alt="Service Graph" className="ml-4" />
      </div>
    </div>
  );
};

export default Dashboard;
