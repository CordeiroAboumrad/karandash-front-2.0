import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AppRouter } from "./router/AppRouter";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <RouterProvider router={AppRouter} />
    </QueryClientProvider>
  );
}

export default App;
