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
import { apiCall } from '../../utils/api';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// =================================================================================
// 1. کامپوننت‌های بصری برای نودها (Nodes)
// =================================================================================

// کامپوننت برای نود اصلی (کاربر لاگین کرده)
const MainNode = ({ data }) => (
  <div
    style={{
      background: '#1a202c', // Dark background
      color: 'white', // White text
      border: `2px solid #4a5568`,
      borderRadius: '12px',
      padding: '20px',
      width: '220px',
      textAlign: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    }}
  >
    {/* Handle برای اتصال ورودی از بالا */}
    <Handle type="target" position={Position.Top} style={{ background: '#555', visibility: 'hidden' }} />
    
    <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px' }}>{data.name}</div>
    <div style={{ color: '#a0aec0', fontSize: '15px' }}>{data.position}</div>
    
    {/* Handle برای اتصال خروجی به زیرمجموعه‌ها */}
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);


// کامپonnet برای نودهای زیرمجموعه
const ChildNode = ({ data }) => (
  <div
    style={{
      background: '#fff',
      border: '2px solid #cbd5e0',
      borderRadius: '12px',
      padding: '20px',
      width: '220px',
      textAlign: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    }}
  >
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    
    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2d3748' }}>{data.name}</div>
    <div style={{ color: '#718096', fontSize: '14px', marginTop: '5px' }}>{data.position}</div>
    
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);


// =================================================================================
// 2. منطق چیدمان با کتابخانه Dagre
// =================================================================================
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// ابعاد نودها برای محاسبه چیدمان
const nodeWidth = 220;
const nodeHeight = 120; // ارتفاع نودها کمتر شده چون تصویر حذف شده

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 70 }); // فاصله بین نودها

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
// 3. کامپوننت اصلی که منطق و API را مدیریت می‌کند
// =================================================================================
const LayoutedFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // تعریف انواع نودها برای React Flow
  const nodeTypes = useMemo(() => ({ 
    mainNode: MainNode,
    childNode: ChildNode 
  }), []);

  useEffect(() => {
    // برای سادگی، کاربر را مستقیماً از localStorage می‌خوانیم
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        setError("اطلاعات کاربر یافت نشد. لطفاً دوباره وارد شوید.");
        setLoading(false);
        return;
    }
    
    const userData = JSON.parse(storedUser);
    const userId = userData.id;

    apiCall('GET', `/network/${userId}`)
      .then((data) => {
        if (!data || !data.parent) {
            setError("داده‌ای برای نمایش شبکه وجود ندارد.");
            return;
        }

        // ایجاد نود اصلی (کاربر فعلی)
        const parentNode = {
          id: String(data.parent.id),
          type: 'mainNode', // <-- استفاده از نوع نود جدید
          data: {
            name: `${data.parent.first_name || ''} ${data.parent.last_name || ''}`.trim(),
            position: 'شما', // A clear label
          },
          position: { x: 0, y: 0 },
        };

        // ایجاد نودهای فرزندان
        const childNodes = data.children.map((child) => ({
          id: String(child.id),
          type: 'childNode', // <-- استفاده از نوع نود استاندارد
          data: {
            name: `${child.first_name || ''} ${child.last_name || ''}`.trim(),
            position: 'زیرمجموعه',
          },
          position: { x: 0, y: 0 },
        }));

        // ایجاد اتصالات (Edges)
        const connections = data.children.map((child) => ({
          id: `e-${data.parent.id}-${child.id}`,
          source: String(data.parent.id),
          target: String(child.id),
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#a0aec0' },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          [parentNode, ...childNodes],
          connections
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      })
      .catch((err) => {
        console.error('Network API Error:', err);
        setError(err.message || "خطا در دریافت اطلاعات شبکه.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setNodes, setEdges]); // این useEffect فقط یک بار اجرا می‌شود

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="mr-4 text-lg text-gray-700">در حال بارگذاری شبکه...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 text-red-600">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', direction: 'ltr' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        // ✅ کنترل زوم اولیه
        fitViewOptions={{ maxZoom: 1 }} 
        proOptions={{ hideAttribution: true }}
        style={{ background: '#f0f2f5' }} // A slightly different background
      >
        <Controls />
        <Background variant="dots" gap={15} size={1} />
      </ReactFlow>
    </div>
  );
};


// =================================================================================
// 4. کامپوننت Wrapper برای فراهم کردن Context
// =================================================================================
const NetworkComponent = () => (
  // به این کامپوننت کلاس‌های Tailwind می‌دهیم تا 100% ارتفاع و عرض را بگیرد
  <div className="w-full h-full">
    <ReactFlowProvider>
      <LayoutedFlow />
    </ReactFlowProvider>
  </div>
);

export default NetworkComponent;
