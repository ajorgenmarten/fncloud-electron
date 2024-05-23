import { useContext } from "react";
import { MenuList } from "./menu-list";
import { AppContext } from "../../app/context";
import { ItemEvent, UpdateItemEvent } from "./item-editable";

export function ServicesList () {

    const { services, createService, renameService, deleteService, selectService, selectModel } = useContext(AppContext)
    
    const handleCreate = (event: ItemEvent) => {
        createService && createService(event.value)
        event.preventDefault()
    }

    const handleValidate = (name: string, index: number) => {
        const findIndex = services?.findIndex(service => service.name == name)
        const regexp = /^[a-zA-z]+$/
        if ( findIndex != -1 && findIndex != index ) {
            throw new Error('Service has been created')
        }
        if (regexp.test(name) == false) {
            throw new Error('Only has contain letters')
        }
        return true
    }

    const handleUpdate = (event: UpdateItemEvent) => {
        renameService && renameService(event.prevValue, event.value)
        event.preventDefault()
    }

    const handleDelete = (event: ItemEvent) => {
        deleteService && deleteService(event.value)
        event.preventDefault()
    }

    const handleSelect = (event: ItemEvent) => {
        selectModel && selectModel(null)
        selectService && selectService(event.value)
    }

    return <MenuList 
        title="SERVICES"
        iconTitle="bi bi-puzzle"
        data={services?.map(s => s.name)}
        itemsShowDeleteBtn
        itemsShowUpdateBtn
        onCreateItem={handleCreate}
        onUpdateItem={handleUpdate}
        onDeleteItem={handleDelete}
        validate={handleValidate}
        onSelectItem={handleSelect}
        open
        addBtn
    />
}