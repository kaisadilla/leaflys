//import './App.css';
import { SUPPRESS_CONSOLE_ERROR, SUPPRESS_CONSOLE_WARNING } from "./config";
import { DocumentContextProvider } from "./logic/useDocumentContext";
import { UIContextProvider } from "./logic/useUIContext";
import Editor from "./pages/Editor";
import "./styles/app.scss";

function App () {
    applyUserConfig();

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

function applyUserConfig () {
    if (SUPPRESS_CONSOLE_WARNING) {
        console.warn = () => {};
    }
    if (SUPPRESS_CONSOLE_ERROR) {
        console.error = () => {};
    }
}

export default App;
