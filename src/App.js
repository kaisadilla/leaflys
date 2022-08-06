//import './App.css';
import { UIContextProvider } from "./logic/useUIContext";
import Editor from "./pages/Editor";
import "./styles/app.scss";

function App () {
    return (
        <div className="app">
            <UIContextProvider>
                <Editor />
            </UIContextProvider>
        </div>
    );
}

export default App;
