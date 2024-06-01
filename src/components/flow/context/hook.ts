import { useCallback, useContext, useEffect, useMemo } from "react";
import { Connection, Edge, type Node, useEdgesState, useNodesState, NodeProps, NodeDragHandler } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";
import { IRequestNodeData, IResponseNodeData } from "../../../app/types";
import { CustomEdge } from "../edges/custom-edge";

export function useFlow() {
    const { selectedService, templates, updateTemplate, getTemplate } = useContext(AppContext)
    
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({RequestNode, ResponseNode, ConditionNode, CodeNode}), [])
    const edgeTypes = useMemo(() => ({CustomEdge}), [])
    const parseNodePropsToNode = useCallback((props: NodeProps) => {
        return {
            id: props.id,
            data: props.data,
            position: { x: props.xPos, y: props.yPos },
            type: props.type
        }
    }, [])
    const parseNodeToNodeProps = useCallback((props: Node) => {
        return {
            id: props.id,
            data: props.data,
            xPos: props.position.x,
            yPos: props.position.y,
            type: props.type,
        } as NodeProps
    },[])

    const createRequestNode = () => {
        const position = {x:50, y:50}
        const type = 'RequestNode'
        const id = 'request-node-' + crypto.randomUUID()
        const node: Node<IRequestNodeData> = { position, type, id, data: { path: '', method: 'GET', indicator: true }, selected: true }
        setNodes( [...nodes, node] )
    }

    const createResponseNode = () => {
        const position = {x:250, y:50}
        const type= 'ResponseNode'
        const id = 'response-node-' + crypto.randomUUID()
        const node: Node<IResponseNodeData> = { position, type, id, data: { success: 'OK', indicator: true }, selected: true }
        setNodes( [...nodes, node] )
    }

    const createConditionNode = async () => {
        const position = {x: 250, y: 250}
        const type = 'ConditionNode'
        const id = 'condition-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: null, selected: true }
        const template = await window.ipcRenderer.invoke('services:save-node', selectedService, parseNodeToNodeProps(node))
        updateTemplate && updateTemplate({ templateName: selectedService as string, template })
        setNodes([...nodes, node])
    }

    const createCodeNode = () => {
        const position = {x: 250, y: 250}
        const type = 'CodeNode'
        const id = 'code-node-' + crypto.randomUUID()
        const node: Node = { position, type, id, data: { indicator: true, value: '', path: '' }, selected: true }
        setNodes( [...nodes, node] )
    }

    const getValue = async (name: string) => {
        const value = await window.ipcRenderer.invoke('services:get-code-node-value', selectedService, name)
        return value as string
    }

    const renderNodes = async () => {
        setNodes([])

        const template = templates?.find(t => t.templateName == selectedService)
        if ( !template ) return

        const nodes = await Promise.all(template.template.nodes.map(async n => {
            if (n.type == "CodeNode") {
                n.data.value = await getValue(n.data.name)
                console.log(n.data)
            }
            return parseNodePropsToNode(n)
        }))
        setNodes([...nodes])
    }

    const renderEdges = () => {
        setEdges([])

        const template = templates?.find(t => t.templateName == selectedService)
        if ( !template ) return
        
        setEdges(template.template.connections)
        
    }

    const onConnect = useCallback((connection: Connection) => {
        
        const hasEdge = edges.find( edge => {
            if (connection.sourceHandle) {
                return connection.sourceHandle == edge.sourceHandle
            } 
            return connection.source == edge.source
        } )
        if ( hasEdge ) return
        if (connection.target == connection.source) return

        const target: Node = nodes.find(n => n.id == connection.target) as Node
        const source: Node = nodes.find(n => n.id == connection.source) as Node

        if (!templates?.find(t => t.templateName == selectedService)?.template.nodes.find(n => n.id == target.id)) return
        if (!templates?.find(t => t.templateName == selectedService)?.template.nodes.find(n => n.id == source.id)) return

        if (target.type == "ConditionNode" && source.type != "CodeNode") return
        
        const edge: Edge = { id: `${crypto.randomUUID()}`, source: connection.source as string, target: connection.target as string, type: "CustomEdge", sourceHandle: connection.sourceHandle, targetHandle: connection.targetHandle }
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

    const onNodeDragStop: NodeDragHandler = async (_evt, node) => {
        const findIndex = nodes.findIndex(n => n.id == node.id)
        const searchNode = nodes[findIndex]
        searchNode.position = node.position
        const template = getTemplate && getTemplate(selectedService as string)
        if ( template?.template.nodes.findIndex(n => n.id == node.id) == -1 ) return
        const newTemplate = await window.ipcRenderer.invoke('services:save-node', selectedService, parseNodeToNodeProps(searchNode))
        updateTemplate && updateTemplate({ templateName: selectedService as string, template: newTemplate })
    }
    
    useEffect(() => {
        renderNodes()
        renderEdges()
    }, [selectedService])

    return { nodes, edges, nodeTypes, edgeTypes, onNodeDragStop, onEdgesDelete, onConnect, onNodesDelete, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode }
}