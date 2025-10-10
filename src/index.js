import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'primereact/resources/themes/lara-light-blue/theme.css';   // Theme (required for lines)
import 'primereact/resources/primereact.min.css';                // Core PrimeReact styles
import 'primeicons/primeicons.css'; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
