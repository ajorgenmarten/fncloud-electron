import { useContext } from "react"
import { MenuList } from "./menu-list"
import { AppContext } from "../../app/context"
import { ItemEvent, UpdateItemEvent } from "./item-editable"

export const ModelsList = () => {
    const { models, createModel, deleteModel, renameModel, selectModel, selectService } = useContext(AppContext)

    const handleOnCreate = (event: ItemEvent) => {
        createModel && createModel(event.value)
        event.preventDefault() 
    }

    const handleOnDelete = (event: ItemEvent) => {
        deleteModel && deleteModel(event.value)
    }

    const handleOnUpdateItem = (event: UpdateItemEvent) => {
        renameModel && renameModel(event.prevValue, event.value)
        event.preventDefault()
    }

    const handleSelect = (event: ItemEvent) => {
        selectService && selectService(null)
        selectModel && selectModel(event.value)
    }

    const handleValidate = (text: string, index: number) => {
        const findIndex = models?.findIndex(model => model.name == text)
        const regexp = /^[a-zA-z]+$/
        if ( findIndex != -1 && findIndex != index ) {
            throw new Error('Model has been created')
        }
        if (regexp.test(text) == false) {
            throw new Error('Only has contain letters')
        }
        return true
    }

    return <MenuList 
        title="MODELS"
        iconTitle='bi bi-file-earmark-code'
        addBtn
        open
        data={models?.map(m => m.name)}
        onCreateItem={handleOnCreate}
        onDeleteItem={handleOnDelete}
        onUpdateItem={handleOnUpdateItem}
        onSelectItem={handleSelect}
        validate={handleValidate}
    />
}