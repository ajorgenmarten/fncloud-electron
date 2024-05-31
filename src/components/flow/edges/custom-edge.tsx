import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

export function CustomEdge (props: EdgeProps) {
    const [edgepath] = getSmoothStepPath({...props, borderRadius: 20})
    return <BaseEdge path={edgepath} id={props.id} style={ { stroke: props.selected ? "rgb(94, 234, 212)" : "rgb(23, 120, 110)", strokeWidth: 2 } } />
}