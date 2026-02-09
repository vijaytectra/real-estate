import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppRoutes } from "@/routes/AppRoutes";
import { CompareBar } from "@/components/common/CompareBar";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <CompareBar />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
              className: "font-sans",
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
