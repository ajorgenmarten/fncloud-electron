import './style.css'

export function WelcomeContact() {
    return <div className="p-[1px] select-none border border-opacity-20 border-slate-800 shadow-slate-800 translate shadow-[0_0_60px_20px] mt-14 rounded-2xl transition-transform group">
    <div className="flex items-center max-w-full w-96 backdrop-blur-sm bg-slate-800 bg-opacity-60 rounded-[15px]">
        <img className="rounded-full w-28 m-5" src="profile.jpg" alt="" />
        
        <div className="flex flex-col gap-2 justify-center">
        
            <span className="text-3xl font-bold text-emerald-500">Developer </span>
            <span className="text-xl text-gray-300">Alejandro Jorgen Marten</span>
        
            <div className="flex gap-4">
                <a href="https://github.com/ajorgenmarten" target="_blank">
                    <button className="flex gap-2 pr-1 pb-[2px] items-center text-emerald-300 border-b-[.5px] border-emerald-200">
                        <i className="bi bi-github text-emerald-200 text-[18px]"></i>
                        <span>GitHub</span>
                    </button>
                </a>

                <a href="https://cocodev.onrender.com" target="_blank">
                    <button className="flex gap-2 pr-1 pb-[2px] items-center text-emerald-300 border-b-[.5px] border-emerald-200">
                        <i className="bi bi-wallet text-emerald-200 text-[18px]"></i>
                        <span>Portfolio</span>
                    </button>
                </a>
            </div>
        </div>
    </div>
</div>
}