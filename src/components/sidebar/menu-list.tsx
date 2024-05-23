import { useEffect, useState } from "react"
import { ItemEditable, ItemEvent, UpdateItemEvent } from "./item-editable"

export const MenuList = (props: MenuListProps) => {
    const [data, setData] = useState<string[]>([])
    const [newItem, setNewItem] = useState<string|null>(null)
    const [close, setClose] = useState<boolean>( props.open ? !props.open : true )

    useEffect(() => {
        setData(props.data ?? [])
    }, [props.data])
    
    const handleToggleClose = () => { setClose(!close) }
    const handleClickAddBtn: React.MouseEventHandler = (evt) => {
        setNewItem('')
        setClose(false)
        evt.stopPropagation()
    }
    const handleOnAddNewItem = async (evt: ItemEvent) => {
        props.onCreateItem && await props.onCreateItem( evt )
        if ( !evt.isDefaultPrevented() )
            setData([...data, evt.value])
        setNewItem(null)
    }
    const handleOnCancelAddNewItem = () => {
        setNewItem(null)
    }
    const handleDeleteItem = async(evt: ItemEvent, index: number) => {
        
        props.onDeleteItem && await props.onDeleteItem( evt )
        if ( !evt.isDefaultPrevented() ) {
            data.splice(index, 1)
            setData([...data])
        }
    }
    const handleUpdateItem = async (evt: UpdateItemEvent, index: number) => {
        props.onUpdateItem && await props.onUpdateItem(evt)
        if ( evt.isDefaultPrevented() ) return
        setData(prev => {
            data[index] = evt.value
            return prev
        })
    }
    const handleValidate = async (value: string, index: number) => {
        if (!props.validate) return true
        return await props.validate(value, index)
    }

    return <div className="w-full">

        {
            props.title && 

            <div className="text-white text-xl font-bold flex justify-between cursor-pointer items-center p-2 m-2 hover:bg-slate-700 rounded-lg has-[~ul:not([hidden])]:bg-slate-700" onClick={handleToggleClose} title={props.title}>

                <div className={`truncate grow ${ close ? 'text-slate-400' : 'text-slate-50' }`}>

                    {
                        props.iconTitle !== undefined && typeof props.iconTitle == 'string' ?

                        <i className={props.iconTitle}></i> :
                        
                        props.iconTitle 
                    }

                    <span> {props.title} </span>
                
                </div>

                {
                    props.addBtn &&

                    <button className="flex shrink-0 items-center justify-center w-7 h-7 hover:bg-slate-600 rounded" onClick={handleClickAddBtn}>
                        <i className="bi bi-plus text-zinc-300"></i>
                    </button>
                }

            </div>
        }

        <ul className="ml-7 pl-2 border-l-2 border-l-slate-700" hidden={close}>
            {
                newItem != null &&
                
                <li>
                    <ItemEditable 
                        label={newItem} 
                        validate={props.validate} 
                        validateCheckOnChange 
                        edit
                        onCancelUpdate={handleOnCancelAddNewItem}
                        onUpdate={handleOnAddNewItem}
                        />
                </li>

            }
            {
                data.map((item, index) => <li key={crypto.randomUUID()} >
                                            <ItemEditable
                                                label={item}
                                                deleteBtn={(props.onDeleteItem || props.itemsShowDeleteBtn) ? true : false}
                                                editBtn={(props.onUpdateItem || props.itemsShowUpdateBtn) ? true : false}
                                                validateCheckOnChange
                                                validate={(item) => handleValidate(item, index)}
                                                onDelete={(evt) => handleDeleteItem(evt, index)}
                                                onUpdate={(evt) => handleUpdateItem(evt, index)}
                                                onClick={props.onSelectItem}
                                            />
                                        </li> )

            }
        </ul>

    </div>
}

interface MenuListProps {
    title?: string
    iconTitle?: string | JSX.Element
    addBtn?: boolean
    open?: boolean
    data?: string[]
    itemsShowUpdateBtn?: boolean
    itemsShowDeleteBtn?: boolean

    validate?: (text: string, index: number) => boolean|Promise<boolean>
    onCreateItem?: ( event: ItemEvent ) => void|Promise<void>
    onUpdateItem?: ( event: UpdateItemEvent ) => void|Promise<void>
    onDeleteItem?: ( event: ItemEvent ) => void|Promise<void>
    onSelectItem?: ( event: ItemEvent ) => void|Promise<void>
}