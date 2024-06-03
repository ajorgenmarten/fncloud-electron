import { useCallback, useContext, useEffect, useMemo } from "react";
import { Connection, Edge, type Node, useEdgesState, useNodesState, NodeProps, NodeDragHandler, XYPosition } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";
import { ICodeNodeData, IRequestNodeData, IResponseNodeData } from "../../../app/types";
import { CustomEdge } from "../edges/custom-edge";

export function useFlow() {
    const { selectedService } = useContext(AppContext)
    
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({RequestNode, ResponseNode, ConditionNode, CodeNode}), [])
    const edgeTypes = useMemo(() => ({CustomEdge}), [])

    type NodeTypes = keyof typeof nodeTypes

    const createRequestNode = () => {
        const position: XYPosition = { x: 100, y: 100 }
        const data: IRequestNodeData = { indicator: true, method: 'GET', path: '' }
        const type: NodeTypes = "RequestNode"
        const id = 'request-node-' + crypto.randomUUID()
        const node: Node<IRequestNodeData> = { id, type, data, position, selected: true }
        setNodes([...nodes.map(n => { n.selected = false; return n }), node])
    }

    const createResponseNode = () => {
        const position: XYPosition = { x: 350, y: 100 }
        const data: IResponseNodeData = { indicator: true, success: "OK" }
        const type: NodeTypes = "ResponseNode"
        const id = 'response-node-' + crypto.randomUUID()
        const node: Node<IResponseNodeData> = { id, type, data, position, selected: true }
        setNodes([...nodes.map(n => { n.selected = false; return n }), node])
    }

    const createConditionNode = () => {
        const position: XYPosition = { x: 520, y: 100 }
        const type: NodeTypes = "ConditionNode"
        const id = 'condition-node-' + crypto.randomUUID()
        const node: Node = { id, type, position, selected: true, data: { indicator: false } }
        setNodes([...nodes.map(n => { n.selected = false; return n }), node])
    }

    const createCodeNode = () => {
        const position: XYPosition = { x: 610, y: 100 }
        const type: NodeTypes = "CodeNode"
        const id = 'code-node-' + crypto.randomUUID()
        const data: ICodeNodeData = { indicator: true, name: '', value: '', path: '' }
        const node: Node<ICodeNodeData> = { id, type, position, selected: true, data }
        setNodes([...nodes.map(n => { n.selected = false; return n }), node])
    }

    const render = () => {
        setNodes(selectedService?.nodes.map(n => ({ id: n.id, data: n.data, position: { x: n.xPos, y: n.yPos }, type: n.type })) || [])
        setEdges(selectedService?.edges || [])
    }

    useEffect(() => {
        if ( selectedService != null ) {
            console.log('Change flow for `' + selectedService?.name + '`')
            render()
        }
    }, [selectedService])

    return {nodes, edges, nodeTypes, edgeTypes, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode}    
}

/**
 * const parseNodePropsToNode = useCallback((props: NodeProps) => {
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
 */