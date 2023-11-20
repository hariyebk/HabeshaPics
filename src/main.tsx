import React from "react";
import ReactDom from "react-dom/client"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "@/lib/react-query/QueryProvider";
import { Client } from 'appwrite';

const client = new Client();

// web sdk to point the production server to appwrite
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('653badab17aa7585cd49');

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