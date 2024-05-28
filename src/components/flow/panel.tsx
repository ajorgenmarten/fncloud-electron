import { Panel } from "reactflow";
import { useContext } from "react";
import { FlowContext } from "./context/context";

export function FlowPanel () {

    const { createRequestNode, createResponseNode, createConditionNode, createCodeNode } = useContext(FlowContext)

    const handleCreateRequestNode = () => {
        createRequestNode && createRequestNode()
    }
    const handleCreateResponseNode = () => {
        createResponseNode && createResponseNode()
    }
    const handleCreateConditionNode = () => {
        createConditionNode && createConditionNode()
    }
    const handleCreateCodeNode = () => {
        createCodeNode && createCodeNode()
    }

    return <Panel position="top-left" className="text-white flex flex-wrap gap-1 max-w-32 shadow-xl border border-gray-800 rounded-lg p-1 bg-slate-900" >
        
        <button title="NEW REQUEST" className="w-14 h-14 border hover:bg-gray-800 border-gray-500 rounded-lg hover:border-emerald-300 group" onClick={handleCreateRequestNode}>
            <i className="bi bi-globe text-3xl text-gray-300 group-hover:text-emerald-400"></i>
        </button>

        <button title="RESPONSE" className="w-14 h-14 border hover:bg-gray-800 border-gray-500 rounded-lg hover:border-emerald-300 group" onClick={handleCreateResponseNode}>
            <i className="bi bi-lightning-charge-fill text-3xl group-hover:text-emerald-400"></i>
        </button>

        <button title="CONDITION" className="w-14 h-14 border hover:bg-gray-800 border-gray-500 rounded-lg hover:border-emerald-300 group" onClick={handleCreateConditionNode}>
            <i className="bi bi-question-circle text-3xl text-gray-300 group-hover:text-emerald-400"></i>
        </button>

        <button title="CODE" className="w-14 h-14 border hover:bg-gray-800 border-gray-500 rounded-lg hover:border-emerald-300 group" onClick={handleCreateCodeNode}>
            <i className="bi bi-code text-3xl text-gray-300 group-hover:text-emerald-400"></i>
        </button>

    </Panel>
}

export function SaveConnections () {
    const { showSaveConnections, saveConnection } = useContext(FlowContext)
    return showSaveConnections && <Panel position="bottom-right" >
        <button onClick={saveConnection} className="uppercase p-2 bg-teal-500 rounded-lg text-slate-300 font-semibold shadow-gray-800 shadow-md hover:bg-teal-600 active:bg-teal-700 animate-pulse">
            <i className="bi bi-floppy mr-1"></i>
            save
        </button>
    </Panel>
}