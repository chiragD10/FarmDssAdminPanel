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
                    Subscription ID
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Course ID
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Transaction Description
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Amount
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Transaction Time
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Date & Time
                </th>
                <th className="border px-4 py-2 text-gray-400 text-sm">
                    Remarks
                </th>
                
            </tr>
        </thead>
        <tbody>
            
        </tbody>
    </table>
  );
};

export default SubscriptionTable;
