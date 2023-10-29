import React from "react";
import ReactDom from "react-dom/client"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/queryProvider";

ReactDom.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
        </BrowserRouter>
    </React.StrictMode>
)