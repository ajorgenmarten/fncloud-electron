import { useCallback, useContext, useEffect, useMemo } from "react";
import { Connection, Edge, type Node, useEdgesState, useNodesState, NodeProps, EdgeProps } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";
import { IRequestNodeData, IResponseNodeData } from "../../../app/types";
import { CustomEdge } from "../edges/custom-edge";


export function useFlow() {
    const { selectedService, templates, updateTemplate } = useContext(AppContext)
    
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({RequestNode, ResponseNode, ConditionNode, CodeNode}), [])
    const edgeTypes = useMemo(() => ({CustomEdge}), [])

    const createRequestNode = () => {
        const position = {x:50, y:50}
        const type = 'RequestNode'
        const id = 'request-node-' + crypto.randomUUID()
        const node: Node<IRequestNodeData> = { position, type, id, data: { path: '', method: 'GET', indicator: true } }
        setNodes( [...nodes, node] )
    }

    const createResponseNode = () => {
        const position = {x:250, y:50}
        const type= 'ResponseNode'
        const id = 'response-node-' + crypto.randomUUID()
        const node: Node<IResponseNodeData> = { position, type, id, data: { success: 'OK', indicator: true } }
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
        setNodes([])

        const parseNodeToNodeProps = (nodeprop: NodeProps): Node => {
            return {
                id: nodeprop.id,
                data: nodeprop.data,
                position: { x: nodeprop.xPos, y: nodeprop.yPos },
                type: nodeprop.type
            }
        }

        const template = templates?.find(t => t.templateName == selectedService)
        if ( !template ) return

        const nodes = template.template.nodes.map(n => parseNodeToNodeProps(n))
        setNodes([...nodes])
    }

    const renderEdges = () => {
        setEdges([])

        const parseEdgetoEdgeProps = (edge: EdgeProps): Edge => {
            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandleId,
                targetHandle: edge.targetHandleId
            }
        }

        const template = templates?.find(t => t.templateName == selectedService)
        if ( !template ) return

        const edges = template.template.connections.map(n => parseEdgetoEdgeProps(n))
        setEdges(edges)
        
    }

    const onConnect = useCallback((connection: Connection) => {
        console.log(connection)
        // comprobar si existe una conexion con ese source
        const hasEdge = edges.find( edge => edge.source == connection.source)
        if ( hasEdge ) return

        const target: Node = nodes.find(n => n.id == connection.target) as Node
        const source: Node = nodes.find(n => n.id == connection.source) as Node

        if (!templates?.find(t => t.templateName == selectedService)?.template.nodes.find(n => n.id == target.id)) return
        if (!templates?.find(t => t.templateName == selectedService)?.template.nodes.find(n => n.id == source.id)) return

        if (target.type == "ConditionalNode" && source.type != "CodeNode") return
        
        const edge: Edge = { id: `${crypto.randomUUID()}`, source: connection.source as string, target: connection.target as string, type: "CustomEdge" }
        window.ipcRenderer.invoke('services:save-connection', selectedService, edge)
        setEdges([...edges, edge])

    }, [nodes, edges] )

    const onNodesDelete = useCallback(async (nodes: Node[]) => {
        const template = await window.ipcRenderer.invoke('services:delete-nodes', selectedService, nodes)
        updateTemplate && updateTemplate(template)
    }, [selectedService])

    const onEdgesDelete = useCallback(async (edges: Edge[]) => {
        const template = await window.ipcRenderer.invoke('services:delete-connection', selectedService, edges)
        updateTemplate && updateTemplate(template)
    }, [selectedService])
    
    useEffect(() => {
        renderNodes()
        renderEdges()
    }, [selectedService])

    return { nodes, edges, nodeTypes, edgeTypes, onEdgesDelete, onConnect, onNodesDelete, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode }
}