import { useMemo } from "react";
import { Node, useEdgesState, useNodesState } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";

export function useFlow() {
    
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({RequestNode, ResponseNode, ConditionNode, CodeNode}), [])

    const createRequestNode = () => {
        const position = {x:50, y:50}
        const type = 'RequestNode'
        const id = 'request-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: null }
        setNodes( [...nodes, node] )
    }

    const createResponseNode = () => {
        const position = {x:250, y:50}
        const type= 'ResponseNode'
        const id = 'response-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: null }
        setNodes( [...nodes, node] )
    }

    const createConditionNode = () => {
        const position = {x: 250, y: 250}
        const type = 'ConditionNode'
        const id = 'condition-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: null }
        setNodes( [...nodes, node] )
    }

    const createCodeNode = () => {
        const position = {x: 250, y: 250}
        const type = 'CodeNode'
        const id = 'condition-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: null }
        setNodes( [...nodes, node] )
    }


    return { nodes, edges, nodeTypes, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode }
}