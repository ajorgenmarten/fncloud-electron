import { Handle, NodeProps, Position } from "reactflow";

export function ConditionNode (props: NodeProps) {

    return <div className={`bg-slate-900 p-2 rounded-md text-slate-400 w-20 text-center ${ props.selected && 'outline outline-1 outline-teal-400' }`}>

        <span className="text-2xl font-bold m-2">if</span>

        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500"/>
        <Handle type="source" id="success" position={Position.Top} className="h-2 w-4 rounded-sm border border-gray-400 bg-teal-600"/>
        <Handle type="source" id="bad" position={Position.Bottom} className="h-2 w-4 rounded-sm border border-gray-400 bg-rose-500"/>

    </div>
}