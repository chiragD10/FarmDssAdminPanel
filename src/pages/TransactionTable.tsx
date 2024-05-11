import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { table } from 'console';

const SubscriptionTable: React.FC = () => {


  return (
    <table className="min-w-full leading-normal">
        <thead className='bg-xcodeoffwhite font-poppins drop-shadow-md'>
            <tr>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    ID
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Course Name/KB Name
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Expiry Date
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Activation Date
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Course ID
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Status
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Action
                </th>
                
            </tr>
        </thead>
        <tbody>
            
        </tbody>
    </table>
  );
};

export default SubscriptionTable;
