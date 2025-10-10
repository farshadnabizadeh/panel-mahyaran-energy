import React, { useState } from 'react';

// 1. DATA STRUCTURE
// No changes here, but this data will now be used by our interactive components.
const orgData = {
  id: '1',
  name: 'Liana J. Smith',
  title: 'CEO & Co-Founder',
  department: 'Executive',
  email: 'liana.smith@example.com',
  phone: '123-456-7890',
  avatar: 'https://i.pravatar.cc/150?u=1',
  children: [
    {
      id: '2',
      name: 'Michael B. Jordan',
      title: 'VP of Engineering',
      department: 'Technology',
      email: 'michael.jordan@example.com',
      phone: '123-456-7891',
      avatar: 'https://i.pravatar.cc/150?u=2',
      children: [
        {
          id: '6',
          name: 'Samantha Carter',
          title: 'Lead Frontend Developer',
          department: 'Technology',
          email: 'samantha.carter@example.com',
          phone: '123-456-7892',
          avatar: 'https://i.pravatar.cc/150?u=6',
          children: [
            { id: '10', name: 'John Doe', title: 'Senior Frontend Developer', department: 'Technology', email: 'john.doe@example.com', phone: '123-456-7893', avatar: 'https://i.pravatar.cc/150?u=10', children: [] },
            { id: '11', name: 'Jane Roe', title: 'Junior Frontend Developer', department: 'Technology', email: 'jane.roe@example.com', phone: '123-456-7894', avatar: 'https://i.pravatar.cc/150?u=11', children: [] },
          ],
        },
        { id: '7', name: 'Daniel Jackson', title: 'Lead Backend Developer', department: 'Technology', email: 'daniel.jackson@example.com', phone: '123-456-7895', avatar: 'https://i.pravatar.cc/150?u=7', children: [] },
      ],
    },
    { id: '3', name: 'Jessica Miller', title: 'VP of Marketing', department: 'Marketing', email: 'jessica.miller@example.com', phone: '123-456-7896', avatar: 'https://i.pravatar.cc/150?u=3', children: [] },
    // ... more nodes
  ],
};


// 2. HELPER COMPONENTS (for clarity)

// Popup Modal Component
// This component displays the details of the selected node.
const NodeDetailPopup = ({ node, onClose }) => {
  if (!node) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-2xl p-6 m-4 max-w-sm w-full relative"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        
        {/* Content */}
        <div className="flex flex-col items-center">
          <img src={node.avatar} alt={node.name} className="w-24 h-24 rounded-full border-4 border-blue-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{node.name}</h2>
          <p className="text-md text-blue-600 font-semibold">{node.title}</p>
          <p className="text-sm text-gray-500">{node.department}</p>
          <div className="w-full border-t my-4"></div>
          <div className="text-left w-full space-y-2">
            <p><strong>ID:</strong> {node.id}</p>
            <p><strong>Email:</strong> <a href={`mailto:${node.email}`} className="text-blue-500 hover:underline">{node.email}</a></p>
            <p><strong>Phone:</strong> {node.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// Recursive Node Component
// Now accepts props for state management: onNodeClick, collapsedNodes, setCollapsedNodes
const OrgChartNode = ({ node, onNodeClick, collapsedNodes, setCollapsedNodes }) => {
  
  // Check if the current node is collapsed
  const isCollapsed = collapsedNodes[node.id];

  // Function to toggle the collapsed state for the current node
  const handleToggleCollapse = () => {
    setCollapsedNodes(prev => ({ ...prev, [node.id]: !isCollapsed }));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="relative flex flex-col items-center p-4 m-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg">
        {/* Vertical line connector */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 h-6 w-0.5 bg-gray-400 group-first:hidden"></div>
        
        {/* Main card content - clickable to open popup */}
        <div className="cursor-pointer" onClick={() => onNodeClick(node)}>
          <img src={node.avatar} alt={node.name} className="w-20 h-20 rounded-full border-2 border-blue-300" />
          <h3 className="mt-2 text-lg font-semibold text-gray-800">{node.name}</h3>
          <p className="text-sm text-gray-500">{node.title}</p>
        </div>

        {/* --- NEW: Collapse/Expand Button --- */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={handleToggleCollapse}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-blue-700 transition-all"
          >
            {isCollapsed ? '+' : '−'}
          </button>
        )}
      </div>

      {/* Children Container - renders only if children exist AND the node is not collapsed */}
      {!isCollapsed && node.children && node.children.length > 0 && (
        <div className="relative flex justify-center">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400"></div>
          {node.children.map((childNode) => (
            <div key={childNode.id} className="group relative px-2">
              {/* Recursive call, passing down all necessary props */}
              <OrgChartNode 
                node={childNode}
                onNodeClick={onNodeClick}
                collapsedNodes={collapsedNodes}
                setCollapsedNodes={setCollapsedNodes}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// 3. MAIN COMPONENT - Manages all the state
const NetworkComponent = () => {
    // --- STATE MANAGEMENT ---
    // State for the popup: which node is selected? (null means popup is closed)
    const [selectedNode, setSelectedNode] = useState(null);
    
    // State for collapsed nodes: an object where keys are node IDs and values are booleans.
    // e.g., { '2': true } means the node with id '2' is collapsed.
    const [collapsedNodes, setCollapsedNodes] = useState({});

    // --- HANDLERS ---
    // Sets the selected node to open the popup
    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    // Closes the popup by setting the selected node to null
    const handleClosePopup = () => {
        setSelectedNode(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Interactive Company Chart
            </h1>
            
            <div className="p-4 overflow-x-auto">
                <div className="group relative">
                    {/* Pass state and handlers down to the root node */}
                    <OrgChartNode 
                        node={orgData}
                        onNodeClick={handleNodeClick}
                        collapsedNodes={collapsedNodes}
                        setCollapsedNodes={setCollapsedNodes}
                    />
                </div>
            </div>

            {/* --- RENDER THE POPUP --- */}
            {/* The popup is rendered here at the top level, but only appears if `selectedNode` is not null. */}
            <NodeDetailPopup node={selectedNode} onClose={handleClosePopup} />
        </div>
    );
};

export default NetworkComponent;
