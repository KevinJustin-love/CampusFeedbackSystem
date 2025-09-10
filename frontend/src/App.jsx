import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import { checkUserAuth } from "./components/functions/checkUserAuth";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <RegisterPage />;
};

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 新增一个加载状态


  // 在组件挂载时和路由变化时检查用户状态
  useEffect(() => {
    checkUserAuth();
  }, [location.pathname]); // 监听路由变化

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user ? (
              <StudentDashboard
                user={user}
              />
            ) : (
              <div>加载用户信息中...</div>
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/detail/:id"
        element={
          <ProtectedRoute>
            <IssueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {user && ( //这里需要添加验证思路
              <AdminDashboard
                user={user}
              />
            )}
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/logout" element={<Logout />} />

      <Route path="/register" element={<RegisterAndLogout />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
