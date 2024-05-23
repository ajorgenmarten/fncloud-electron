import { useContext } from "react";
import { ModelsList } from "./models-list";
import { ServicesList } from "./services-list";
import { AppContext } from "../../app/context";

export default function Sidebar() {

    const { selectModel, selectService } = useContext(AppContext)

    const handleClick = () => {
        selectModel && selectModel(null)
        selectService && selectService(null)
    }

    return <div className="w-80 shrink-0 h-screen bg-slate-900 overflow-y-auto select-none" >
    <div className="h-12 flex items-center pl-1">
        <h1 className="text-emerald-500 text-3xl font-bold uppercase ml-1 select-none hover:cursor-pointer" onClick={handleClick}>fncloud</h1>
    </div>
    <ServicesList />
    <ModelsList />
    </div>
}