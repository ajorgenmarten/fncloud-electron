import ReactFlow, { Background } from "reactflow";
import { FlowPanel } from "./panel";
import { useContext } from "react";
import { FlowContext } from "./context/context";
import './styles.css'

export function Flow() {
  const { nodes, edges, nodeTypes, onNodesChange, onEdgesChange } = useContext(FlowContext)
  
  return <div className="w-full h-full grow">
    <ReactFlow 
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      defaultEdgeOptions={{ animated: true, data: 'hola mundo' }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}>
      <FlowPanel />
      <Background color="#888" className="bg-slate-800" />
    </ReactFlow>
  </div>
}