import { useContext, useEffect, useMemo } from "react";
import { Node, useEdgesState, useNodesState } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";

export function useFlow() {
    const { selectedService, templates } = useContext(AppContext)
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
        const node: Node = { position, type, id, data: { id } }
        setNodes( [...nodes, node] )
    }

    const renderEndPoints = () => {
        const template = templates?.find(template => template.name == selectedService)
        if ( !template ) return 
        const endpointNodes: Node[] = template.template.endPoints.map(({method, path, connectTo, xPos, yPos, ...node}) => {
            const data = { method, path }
            return { data, ...node, position: { x: xPos, y: yPos }, type: 'RequestNode' }
        })
        setNodes([...nodes, ...endpointNodes])
    }

    useEffect(() => {
        setNodes([])
        renderEndPoints()   
    }, [selectedService])

    return { nodes, edges, nodeTypes, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode }
}