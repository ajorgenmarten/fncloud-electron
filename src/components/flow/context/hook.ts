import { useContext, useEffect, useMemo } from "react";
import { Node, useEdgesState, useNodesState } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";
import { NodeRequestPropsData, NodeResponsePropsData } from "../../../app/types";

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
        const node: Node = { position, type, id, data: null }
        setNodes( [...nodes, node] )
    }

    const renderNodes = () => {
        const template = templates?.find(t => t.name == selectedService)
        if ( !template ) return
        const requestNodes: Node<NodeRequestPropsData>[] = template.template.endPoints.map(t => {
            const data: NodeRequestPropsData = { indicator: false, method: t.method, path: t.path }
            const node: Node<NodeRequestPropsData> = { id: t.id, data, position: { x: t.xPos, y: t.yPos }, type: 'RequestNode' }
            return node
        })
        const responseNodes: Node<NodeResponsePropsData>[] = template.template.responses.map(t => {
            const data: NodeResponsePropsData = { indicator: false, success: t.success }
            const node: Node<NodeResponsePropsData> = { id: t.id, data, position: {x: t.xPos, y: t.yPos}, type: 'ResponseNode' }
            return node
        })
        setNodes([...requestNodes, ...responseNodes])
    }
    
    useEffect(() => {
        setNodes([])
        renderNodes()
    }, [selectedService])

    return { nodes, edges, nodeTypes, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode }
}