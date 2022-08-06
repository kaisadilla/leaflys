//import './App.css';
import { DocumentContextProvider } from "./logic/useDocumentContext";
import { UIContextProvider } from "./logic/useUIContext";
import Editor from "./pages/Editor";
import "./styles/app.scss";

function App () {
    return (
        <div className="app">
            <UIContextProvider>
                <DocumentContextProvider>
                    <Editor />
                </DocumentContextProvider>
            </UIContextProvider>
        </div>
    );
}

export default App;
