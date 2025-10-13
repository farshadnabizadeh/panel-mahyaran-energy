// src/components/dashboard/networkComponent.jsx

import React, { memo, useMemo } from 'react';
// تغییرات اصلی اینجاست: import ها از 'reactflow' انجام می‌شود
import ReactFlow, {
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow'; 
// مسیر CSS نیز تغییر کرده است
import 'reactflow/dist/style.css'; 
import dagre from 'dagre';

// =================================================================================
// 1. داده‌های چارت سازمانی (Nodes & Edges)
// =================================================================================
const initialNodes = [
  {
    id: '1',
    type: 'orgNode',
    data: { name: 'آقای احمدی', position: 'مدیرعامل (CEO)', imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg', isManager: true },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'orgNode',
    data: { name: 'خانم رضایی', position: 'مدیر فنی (CTO)', imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg', isManager: true },
    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    type: 'orgNode',
    data: { name: 'آقای محمدی', position: 'مدیر محصول (CPO)', imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg', isManager: true },
    position: { x: 0, y: 0 },
  },
  {
    id: '4',
    type: 'orgNode',
    data: { name: 'خانم کریمی', position: 'توسعه‌دهنده ارشد', imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' },
    position: { x: 0, y: 0 },
  },
  {
    id: '5',
    type: 'orgNode',
    data: { name: 'آقای حسینی', position: 'توسعه‌دهنده Backend', imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg' },
    position: { x: 0, y: 0 },
  },
  {
    id: '6',
    type: 'orgNode',
    data: { name: 'خانم نوری', position: 'طراح محصول', imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg' },
    position: { x: 0, y: 0 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
  { id: 'e2-5', source: '2', target: '5', type: 'smoothstep' },
  { id: 'e3-6', source: '3', target: '6', type: 'smoothstep' },
];

// =================================================================================
// 2. کامپوننت سفارشی برای نمایش هر نود (عضو سازمان)
// =================================================================================
const OrgChartNode = memo(({ data }) => {
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${data.isManager ? '#1a192b' : '#ff4f8b'}`,
      borderRadius: '10px',
      padding: '15px 20px',
      width: '220px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Vazirmatn, Tahoma, sans-serif'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} isConnectable={true} />
      
      <div style={{ marginBottom: '10px' }}>
        <img 
          src={data.imageUrl || 'https://via.placeholder.com/80'} 
          alt={data.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f0f0f0' }}
        />
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a192b' }}>{data.name}</div>
      <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>{data.position}</div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} isConnectable={true} />
    </div>
  );
});

// =================================================================================
// 3. منطق چیدمان خودکار با استفاده از Dagre
// =================================================================================
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 220;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

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
};

// =================================================================================
// 4. کامپوننت اصلی که چارت را رندر می‌کند
// =================================================================================
const LayoutedFlow = () => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const nodeTypes = useMemo(() => ({ orgNode: OrgChartNode }), []);

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

const NetworkComponent = () => {
    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <ReactFlowProvider>
                <LayoutedFlow />
            </ReactFlowProvider>
        </div>
    )
}

export default NetworkComponent;
