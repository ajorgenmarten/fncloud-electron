import { useContext, useEffect, useMemo } from "react";
import { Connection, Edge, type Node, useEdgesState, useNodesState, NodeDragHandler, XYPosition } from "reactflow";
import { RequestNode } from "../nodes/request-node";
import { ResponseNode } from "../nodes/response-node";
import { ConditionNode } from "../nodes/condition-node";
import { CodeNode } from "../nodes/code-node";
import { AppContext } from "../../../app/context";
import { ICodeNodeData, IRequestNodeData, IResponseNodeData } from "../../../app/types";
import { CustomEdge } from "../edges/custom-edge";

export function useFlow() {
    const { selectedService, services, updateService } = useContext(AppContext)
    
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

    const createConditionNode = async () => {
        const position: XYPosition = { x: 520, y: 100 }
        const type: NodeTypes = "ConditionNode"
        const id = 'condition-node-' + crypto.randomUUID()
        const node: Node = { id, type, position, selected: true, data: { indicator: false } }
        const response = await window.ipcRenderer.invoke('nodes:save-condition', selectedService?.name, { id, data: { }, xPos: node.position.x, yPos: node.position.y, type })
        updateService && updateService({...response, name: selectedService?.name})
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

    const onNodesDragStop: NodeDragHandler = async (_evt, node) => {
        const findIndex = services?.find(s => s.name == selectedService?.name)?.nodes.findIndex(n => n.id == node.id)
        if (findIndex == -1 || findIndex == undefined) return
        
        const props = { id: node.id, xPos: node.position.x, yPos: node.position.y }
        const template = await window.ipcRenderer.invoke('nodes:save-position', selectedService?.name,  props)
        updateService && updateService({ ...template, name: selectedService?.name })
    }

    const onConnect = async (connection: Connection) => {
        const { target, source, sourceHandle } = connection
        
        const service = services?.find(service => service.name == selectedService?.name)
        
        const nodesFound = service?.nodes.filter(node => node.id == source || node.id == target)
        if (nodesFound == undefined || nodesFound?.length < 2) return
        
        const edgeFound = service?.edges.find(edge => {
            if ( sourceHandle && edge.source == source && edge.sourceHandle == sourceHandle) return true
            if ( source == edge.source ) return true
            return false
        })
        if (edgeFound) return

        // VALIDATIONS
        const nodeTarget = nodesFound.find(node => node.id == target)
        const nodeSource = nodesFound.find(node => node.id == source)

        if (nodeTarget?.type == "ConditionNode") {
            if ( nodeSource?.type !== "CodeNode") return
        }
        
        const edge: Edge = {
            id: crypto.randomUUID() as string,
            source: source as string,
            target: target as string,
            sourceHandle: sourceHandle,
            targetHandle: connection.targetHandle,
            type: "CustomEdge"
        }
        const template = await window.ipcRenderer.invoke('nodes:save-connection', selectedService?.name, edge)
        setEdges([...edges, edge])
        updateService && updateService({ ...template, name: selectedService?.name })
    }

    const onNodesDelete = async (nodes: Node[]) => {
        const template = await window.ipcRenderer.invoke('nodes:delete-nodes', selectedService?.name, nodes)
        updateService && updateService({ ...template, name: selectedService?.name })
    }

    const onEdgesDelete = async (edges: Edge[]) => {
        const template = await window.ipcRenderer.invoke('nodes:delete-connections', selectedService?.name, edges)
        updateService && updateService({ ...template, name: selectedService?.name })
    }

    const render = () => {
        setNodes(selectedService?.nodes.map(n => ({ id: n.id, data: n.data, position: { x: n.xPos, y: n.yPos }, type: n.type })) || [])
        setEdges(selectedService?.edges || [])
    }

    useEffect(() => {
        if ( selectedService != null ) {
            console.log('Change flow model to `' + selectedService?.name + '`')
            render()
        }
    }, [selectedService])

    return {nodes, edges, nodeTypes, edgeTypes, onNodesChange, onEdgesChange, createRequestNode, createResponseNode, createConditionNode, createCodeNode, onNodesDragStop, onConnect, onEdgesDelete, onNodesDelete }    
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

   

    const onNodesDelete = useCallback(async (nodes: Node[]) => {
        const template = await window.ipcRenderer.invoke('services:delete-nodes', selectedService, nodes)
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