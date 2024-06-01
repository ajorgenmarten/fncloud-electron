import { useContext, useEffect } from "react"
import { Editor } from "./components/editor/editor"
import Sidebar from "./components/sidebar/sidebar"
import { AppContext } from "./app/context"
import { Flow } from "./components/flow/flow"
import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { Welcome } from "./components/welcome/welcome"
import 'reactflow/dist/style.css';


function App() {

  const { selectedModel, selectedService } = useContext(AppContext)

  useEffect(() => {
    window.MonacoEnvironment = {
      getWorker() { return new TSWorker() },
    }
  }, [])

  return <div className="flex h-screen bg-slate-800">
  <Sidebar />

  {
    selectedModel != null &&
    <Editor />
  }
  {
    selectedService != null &&
    <Flow />
  }
  {
    selectedModel == null &&
    selectedService == null &&
    <Welcome />
  }
</div>
}

export default App
