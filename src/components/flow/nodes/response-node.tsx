import { Handle, Position } from "reactflow";

export function ResponseNode () {
    return <div className="flex flex-col bg-slate-900 p-2 rounded-md text-slate-400">
        <div>
            <span>RESPONSE</span>
        </div>
        <select className="request-node-input" name="" id="">
            <option value="ok">OK</option>
            <option value="bad">BAD</option>
        </select>
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-rose-500"/>
    </div>
}