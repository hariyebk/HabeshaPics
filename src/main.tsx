import React from "react";
import ReactDom from "react-dom/client"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    // configuring the default options for react-query
    defaultOptions: {
        queries: {
            staleTime: 0,
        }
    }
})

ReactDom.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
)