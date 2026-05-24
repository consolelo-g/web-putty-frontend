import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./components/Landing";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Landing />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } /> */}

      </Routes>
    </BrowserRouter>
  );
}