import { useState } from "react"

export const ItemEditable = (props: ItemEditableProps) => {
    const [label, setLabel] = useState<string>(props.label)
    const [newLbl, setNewLbl] = useState<string|null>(props.edit ? label : null)
    const [error, setError] = useState<string|null>(null)

    // FUNCION DE VALIDACION
    const validate = async (text?: string, ...args: any[]) => {
        if (props.validate == undefined) return true
        let validateResult
        try {
            validateResult = props.validate && await props.validate(text ?? newLbl as string, ...args)
            if ( validateResult ) {
                setError(null)
            }
        } catch (e) {
            setError((e as Error).message)
            validateResult = false
        }
        return await validateResult
    }

    // FUNCION DE UTILIDAD PARA OBTERNER EL EVENTO PERSONALIZADO
    const parseEvt = ( evt: any, value: string ): ItemEvent => {
        return {
            value,
            preventDefault: evt.preventDefault,
            isDefaultPrevented: evt.isDefaultPrevented
        }
    }

    // CUANDO SE HACE CLICK EN EL ELEMENTO
    const handleOnClick: React.MouseEventHandler<HTMLDivElement> = async (evt) => {
        const event = parseEvt(evt, label)
        newLbl == null && props.onClick &&  await props.onClick(event)
    }

    // CUANDO SE PRESIONA EL BOTON DE EDITAR
    const handleEdit: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
        evt.stopPropagation()
        setNewLbl(label)
    }

    // CUANDO SE PRESIONA EL BOTON DE BORRAR
    const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (evt) => {
        evt.stopPropagation()
        const event = parseEvt(evt, label)
        props.onDelete && await props.onDelete(event)
    }

    // CADA VEZ QUE CAMBIA EL CONTENIDO DEL INPUT
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (evt) => {
        const value = evt.target.value
        const event = parseEvt(evt, value)
        props.onChange && await props.onChange(event)
        evt.isDefaultPrevented() == false && setNewLbl(value)
        props.validateCheckOnChange && await validate(value)
    }

    // GUARDAR Y CANCELAR
    const handleOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async (evt) => {
        if (evt.key == "Enter" ) {
            const validation = await validate()
            if ( !validation ) return
            const event = parseEvt(evt, newLbl as string) as UpdateItemEvent
            event.prevValue = label
            props.onUpdate && await props.onUpdate(event)
            if ( evt.defaultPrevented ) return
            setLabel(newLbl as string)
            setNewLbl(null)
            setError(null)
        }
        if (evt.key == "Escape") {
            setNewLbl(null)
            setError(null)
            const event = parseEvt(evt, newLbl as string)
            props.onCancelUpdate && await props.onCancelUpdate(event)
        }
    }

    // CUANDO SE DESENFOCA DEL INPUT
    const handleOnBlur: React.FocusEventHandler<HTMLInputElement> = async(evt) => {
        setNewLbl(null)
        setError(null)
        const event = parseEvt(evt, newLbl as string)
        props.onCancelUpdate && await props.onCancelUpdate(event)
    }

    return <div className="relative flex items-center gap-1 max-w-full p-1 px-2 m-2 rounded-lg has-[input:focus]:bg-slate-700 hover:bg-slate-700 cursor-pointer group/el" title={label} onClick={handleOnClick}>

        <div className="grow truncate text-white h-7">
            {
                newLbl == null ?
                <span className="h-full text-slate-300 leading-[30px]"> { label } </span> :
                <input spellCheck={false} className="w-full  bg-transparent leading-loose text-gray-100 h-full border-none outline-none rounded" autoFocus type="text" value={newLbl} onChange={handleChange} onKeyDown={handleOnKeyDown} onBlur={handleOnBlur}/>
            }
        </div>

        {
            newLbl == null && ( props.deleteBtn || props.editBtn ) &&

            <div className="flex items-center shrink-0 gap-1 w-0 overflow-hidden group-hover/el:w-auto">
                
                {
                    props.editBtn &&

                    <button className="hover:bg-slate-600 w-7 h-7 rounded group"
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pencil text-slate-500 group-hover:text-orange-300"></i>
                    </button>
                }

                {
                    props.deleteBtn &&

                    <button className="hover:bg-slate-600 w-7 h-7 rounded group" onClick={handleDelete}>
                        <i className="bi bi-trash text-slate-500 group-hover:text-rose-500"></i>
                    </button>
                }

            </div>
        }

        {
            error != null &&
            <div className="absolute z-10 w-full rounded top-12 px-2 py-1 text-gray-200 left-0 bg-rose-500">
                <span>{ error }</span>
            </div>
        }

    </div>
}

interface ItemEditableProps {
    label: string
    deleteBtn?: boolean
    editBtn?: boolean
    validateCheckOnChange?: boolean
    edit?: boolean
    
    onClick?: (evt: ItemEvent) => void|Promise<void>
    onChange?: (evt: ItemEvent) => void|Promise<void>
    onUpdate?: (evt: UpdateItemEvent) => void|Promise<void>
    onCancelUpdate?: (evt: ItemEvent) => void|Promise<void>
    onDelete?: (evt: ItemEvent) => void|Promise<void>
    validate?: (value: string, ...args: any[]) => boolean|Promise<boolean>
}

export interface ItemEvent {
    value: string
    preventDefault: Function
    isDefaultPrevented: () => boolean
}

export interface UpdateItemEvent extends ItemEvent{
    prevValue: string
}