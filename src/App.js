//import './App.css';
import { useEffect } from "react";
import Input from "./components/Input";
import { SUPPRESS_CONSOLE_ERROR, SUPPRESS_CONSOLE_WARNING } from "./config";
import { DocumentContextProvider } from "./logic/useDocumentContext";
import { EventContextProvider } from "./logic/useEventContext";
import { UIContextProvider } from "./logic/useUIContext";
import Editor from "./pages/Editor";
import "./styles/app.scss";

function App () {
    applyUserConfig();

    return (
        <div className="app">
            <DocumentContextProvider>
                <UIContextProvider>
                    <EventContextProvider>
                        <Editor />
                        <Input />
                    </EventContextProvider>
                </UIContextProvider>
            </DocumentContextProvider>
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
