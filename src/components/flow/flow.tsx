import ReactFlow, { Background, MiniMap } from "reactflow";
import { useContext, useEffect } from "react";
import { FlowContext } from "./context/context";
import './styles.css'
import { FlowPanel } from "./panel";

export function Flow() {
  const { nodes, edges, nodeTypes, edgeTypes, onNodesDragStop, onEdgesDelete, onNodesChange, onEdgesChange, onConnect, onNodesDelete } = useContext( FlowContext )

  useEffect(() => {
    console.log('Mount flow')
    return () => {
      console.log('Dismount flow')
    }
  }, [])
  
  return <div className="w-full h-full grow">
    <ReactFlow 
      nodes={nodes}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      edges={edges}
      defaultEdgeOptions={{ animated: true, type: 'CustomEdge'}}
      onNodeDragStop={onNodesDragStop}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
      onNodesDelete={onNodesDelete}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}>
      <MiniMap className="bg-slate-700 border border-slate-800 shadow-md" position="bottom-left" maskColor="#0004" nodeColor='#0007' color="red"/>
      <FlowPanel />
      <Background color="#888" className="bg-slate-800" />
    </ReactFlow>
  </div>
}