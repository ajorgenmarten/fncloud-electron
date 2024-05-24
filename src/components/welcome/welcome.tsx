import { useEffect, useRef } from "react"
import { WelcomeContact } from "./contact"
import { WelcomeHeader } from "./header"

export function Welcome () {
    const globalContainer = useRef<HTMLDivElement|null>(null)
    const light = useRef<HTMLDivElement|null>(null)

    useEffect(() => {
        const listener = (evt: MouseEvent) => {
            const width = getComputedStyle(globalContainer.current as HTMLElement).width.split('px')[0];

            const screenwidth = innerWidth

            const restwidth = screenwidth - +width

            const x = evt.pageX - restwidth
            const y = evt.pageY

            if (light.current != null)
                light.current.style.transform = `translate(${x}px,${y}px)`
        }

        globalContainer.current?.addEventListener('mousemove', listener)
    
        return () => {
            globalContainer.current?.removeEventListener('mousemove', listener)
        }
    }, []) 

    return <div className="relative grow w-full h-full overflow-hidden" ref={globalContainer} id="global-container">
        
        <div className="absolute w-1 h-1 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 190px 150px #10b981' }} ref={light}></div>
        
        <div className="absolute flex flex-col items-center justify-center w-full h-full backdrop-blur perspective">

            {/* ICONO Y NOMBRE DEL PROYECTO */}
            <WelcomeHeader />

            {/* BY */}
            <WelcomeContact />

        </div>

    </div>
}