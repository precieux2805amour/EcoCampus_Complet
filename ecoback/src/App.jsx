import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminAlertDetail from "./pages/admin/AdminAlertDetail";
import AdminCreateUser from "./pages/admin/AdminCreateUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Area */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="create-user" element={<AdminCreateUser />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="alerts/:id" element={<AdminAlertDetail />} />

          {/* Redirection automatique */}
          <Route index element={<Navigate to="dashboard" />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;