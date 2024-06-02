import { useEffect, useState } from "react"
import { EdgeProps, NodeProps } from "reactflow"

export const Loader = () => {
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState<Service|null>(null)

    const loadservices = async () => {
        console.log('Load services')
        const loadedservices = await window.ipcRenderer.invoke('services:all') as Service[]
        setServices(loadedservices)
    }

    const createService = as

    useEffect(() => {
        loadservices()
    })


    return { services, selectedService }
    
}

interface Service {
}