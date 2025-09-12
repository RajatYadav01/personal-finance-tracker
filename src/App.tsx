import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import {
  AuthContextProvider,
  RegistrationPage,
  LoginPage,
  ResetPasswordPage,
} from "./features/authentication";
import { DashboardPage } from "./features/dashboard";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<PublicRoutes />}>
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
            <Route path="/dashboard" element={<ProtectedRoutes />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<DashboardPage />} />
              <Route path="budget" element={<DashboardPage />} />
              <Route path="reports" element={<DashboardPage />} />
              <Route path="category" element={<DashboardPage />} />
              <Route path="settings" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <ToastContainer />
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
