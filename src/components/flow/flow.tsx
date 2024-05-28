import ReactFlow, { Background, MiniMap } from "reactflow";
import { FlowPanel, SaveConnections } from "./panel";
import { useContext, useEffect } from "react";
import { FlowContext } from "./context/context";
import './styles.css'

export function Flow() {
  const { nodes, edges, nodeTypes, onNodesChange, onEdgesChange, onConnect, onNodesDelete } = useContext( FlowContext )

  useEffect(() => {
    console.log(edges)
  }, [edges])
  
  return <div className="w-full h-full grow">
    <ReactFlow 
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      defaultEdgeOptions={{ animated: true, style: { stroke: 'rgb(13 148 136)', strokeWidth: 2 }, type: 'smoothstep' }}
      onConnect={onConnect}
      onEdgesDelete={(edges) => {}}
      onNodesDelete={onNodesDelete}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}>
      <FlowPanel />
      <SaveConnections />
      <MiniMap className="bg-slate-700 border border-slate-800 shadow-md" position="bottom-left" maskColor="#0004" nodeColor='#0007' color="red"/>
      <Background color="#888" className="bg-slate-800" />
    </ReactFlow>
  </div>
}