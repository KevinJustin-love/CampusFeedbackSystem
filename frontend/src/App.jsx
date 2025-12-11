import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import NotificationPage from "./pages/NotificationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ForestIssue from "./pages/ForestIssue";
import TopicTreePage from "./pages/TopicTreePage";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import TopicIslandPage from "./pages/TopicIslandPage";

import { checkUserAuth } from "./components/functions/checkUserAuth";
import ChatWidget from "./components/ChatWidget";

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
    checkUserAuth(setIsLoading, setUser);
  }, [location.pathname]); // 监听路由变化

  // 判断是否应该显示客服组件（排除登录、注册页面）
  const shouldShowChatWidget = () => {
    const publicPaths = ["/login", "/register"];
    return !publicPaths.includes(location.pathname) && user !== null;
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user ? (
                <StudentDashboard user={user} />
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
              {user ? (
                <IssueDetailPage user={user} />
              ) : (
                <div>加载用户信息中...</div>
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {user && ( //这里需要添加验证思路
                <AdminDashboard user={user} />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user ? <HomePage user={user} adminUnreadCount={0} /> : <div>加载用户信息中...</div>}
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/forestissue"
          element={
            <ProtectedRoute>
              <ForestIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topic-island/:topic"
          element={
            <ProtectedRoute>
              {user ? (
                <TopicIslandPage user={user} />
              ) : (
                <div>加载用户信息中...</div>
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/topic-tree/:topic"
          element={
            <ProtectedRoute>
              {user ? (
                <TopicTreePage user={user} onSearch={() => {}} adminUnreadCount={0} />
              ) : (
                <div>加载用户信息中...</div>
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              {user ? (
                <SubmitIssuePage
                  user={user}
                  onIssueSubmitted={(newIssue) => {
                    // 提交成功后跳转到问题详情页
                    window.location.href = `/detail/${newIssue.id}`;
                  }}
                />
              ) : (
                <div>加载用户信息中...</div>
              )}
            </ProtectedRoute>
          }
        />

        <Route path="/logout" element={<Logout />} />

        <Route path="/register" element={<RegisterAndLogout />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* 悬浮客服组件，仅在登录后显示 */}
      {shouldShowChatWidget() && <ChatWidget />}
    </>
  );
};

export default App;
