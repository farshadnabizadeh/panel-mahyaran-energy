import React, { useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const NetworkComponent = () => {
    const [selection, setSelection] = useState(null);

    const data = [
        {
            expanded: true,
            type: 'person',
            data: {
                image: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Amy Elsner',
                title: 'CEO'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                        name: 'Anna Fali',
                        title: 'CMO'
                    },
                    children: [
                        { label: 'Sales' },
                        { label: 'Marketing' }
                    ]
                },
                {
                    expanded: true,
                    type: 'person',
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png',
                        name: 'Stephen Shaw',
                        title: 'CTO'
                    },
                    children: [
                        { label: 'Development' },
                        { label: 'UI/UX Design' }
                    ]
                }
            ]
        }
    ];

    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-col items-center p-2 rounded-md shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <img
                        alt={node.data.name}
                        src={node.data.image}
                        className="mb-2 w-12 h-12 rounded-full object-cover"
                    />
                    <span className="font-bold text-sm text-gray-800">{node.data.name}</span>
                    <span className="text-xs text-gray-500">{node.data.title}</span>
                </div>
            );
        }

        return (
            <span className="text-sm font-medium text-gray-700">{node.label}</span>
        );
    };

    return (
        <div className="card overflow-x-auto p-4 bg-gray-50 rounded-lg">
            <OrganizationChart
                value={data}
                selectionMode="multiple"
                selection={selection}
                onSelectionChange={(e) => setSelection(e.data)}
                nodeTemplate={nodeTemplate}
            />
        </div>
    );
};

export default NetworkComponent;
