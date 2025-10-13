// src/components/dashboard/networkComponent.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { apiCall } from '../../utils/api'; // ✅ اطمینان از مسیر درست import

// =================================================================================
// Node component (pure visual component) — بدون hook
// =================================================================================
const OrgChartNode = ({ data }) => (
  <div
    style={{
      background: '#fff',
      border: `2px solid ${data.isManager ? '#1a192b' : '#ff4f8b'}`,
      borderRadius: '10px',
      padding: '15px 20px',
      width: '220px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    }}
  >
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <div style={{ marginBottom: '10px' }}>
      <img
        src={data.imageUrl || 'https://via.placeholder.com/80'}
        alt={data.name}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid #f0f0f0',
        }}
      />
    </div>
    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a192b' }}>{data.name}</div>
    <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{data.position}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);

// =================================================================================
// DAGRE layout logic
// =================================================================================
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 220;

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });
  return { nodes, edges };
}

// =================================================================================
// LayoutedFlow Component - جایی که داده از API گرفته می‌شود
// =================================================================================
const LayoutedFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = useMemo(() => ({ orgNode: OrgChartNode }), []);

  const [userData, setUserData] = useState(null);
  const storedUser = localStorage.getItem('user');

  // مقداردهی اولیه userData از localStorage
  useEffect(() => {
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  console.log('userData', userData);

  // 🚀 اجرای فراخوانی API فقط وقتی userData آماده است
  useEffect(() => {
    if (!userData?.id) return; // جلوگیری از اجرا قبل از آماده‌شدن کاربر

    const userId = userData.id;

    apiCall(`/network/${userId}`)
      .then((data) => {
        if (!data || !data.parent) return;

        const parentNode = {
          id: String(data.parent.id),
          type: 'orgNode',
          data: {
            name: `${data.parent.first_name} ${data.parent.last_name}`,
            position: 'Parent',
            isManager: true,
          },
          position: { x: 0, y: 0 },
        };

        const childNodes = data.children.map((child) => ({
          id: String(child.id),
          type: 'orgNode',
          data: {
            name: `${child.first_name} ${child.last_name}`,
            position: 'Child',
            isManager: false,
          },
          position: { x: 0, y: 0 },
        }));

        const connections = data.children.map((child) => ({
          id: `e${data.parent.id}-${child.id}`,
          source: String(data.parent.id),
          target: String(child.id),
          type: 'smoothstep',
          animated: true,
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          [parentNode, ...childNodes],
          connections
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      })
      .catch((err) => console.error('Network Error:', err));
  }, [userData]); // ← اجرا فقط زمانی که userData تغییر کند

  return (
    <div style={{ width: '100%', height: '100%', direction: 'ltr' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: '#f8f9fa' }}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};


// =================================================================================
// Wrapper Component
// =================================================================================
const NetworkComponent = () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <ReactFlowProvider>
      <LayoutedFlow />
    </ReactFlowProvider>
  </div>
);

export default NetworkComponent;
