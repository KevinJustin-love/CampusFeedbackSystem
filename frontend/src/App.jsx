import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import AdminDashboard from "./pages/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";

const App = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 新增一个加载状态

  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "宿舍水管漏水",
      category: "生活",
      status: "处理中",
      updated_at: "2025-08-01",
      created_at: "2025-08-01",
      description: "宿舍401水管漏水，需要维修。",
      file: null,
      updates: [
        { text: "已分配给维修部门", timestamp: "2025-08-01 10:00", file: null },
      ],
      comments: [
        {
          id: 1,
          message: "请尽快处理",
          sender: "学生A",
          timestamp: "2025-08-01 10:05",
        },
      ],
    },
    {
      id: 2,
      title: "课程安排冲突",
      category: "学业",
      status: "已提交",
      updated_at: "2025-08-01",
      created_at: "2025-08-01",
      description: "两门课程时间冲突。",
      file: null,
      updates: [],
      comments: [],
    },
  ]);

  // useEffect Hook 用于在组件加载时检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { username, role } = decodedToken;
        setUser({ username, role });
      } catch (error) {
        console.error("无效的令牌:", error);
        localStorage.removeItem("access_token"); // 令牌无效，移除它
        setUser(null);
      }
    }
    setIsLoading(false); // 无论是否登录，都在检查完成后将加载状态设为 false
  }, []); // 空数组确保只在组件挂载时运行一次

  // 过滤 issues 和 users 根据管理员范围
  const filteredIssues = user
    ? issues.filter((issue) => {
        if (user.role === "life_admin") return issue.category === "生活";
        if (user.role === "study_admin") return issue.category === "学业";
        if (user.role === "manage_admin") return issue.category === "管理";
        return true;
      })
    : issues;

  // 这里的 users 列表可以从后端获取，或者在前端不再维护
  const filteredUsers = []; // 暂时移除硬编码的 users

  const handleSubmitIssue = (issue) => {
    const newIssue = {
      id: issues.length + 1,
      ...issue,
      status: "已提交",
      updated_at: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString().split("T")[0],
      updates: [],
      comments: [],
    };
    setIssues([...issues, newIssue]);
    navigate("/dashboard");
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* 根据用户是否登录来渲染受保护的路由 */}
      {user && (
        <>
          {/* 学生和管理员共享的路由 */}
          <Route
            path="/submit"
            element={<SubmitIssuePage onSubmit={handleSubmitIssue} />}
          />
          <Route
            path="/detail/:id"
            element={<IssueDetailPage issues={issues} setIssues={setIssues} />}
          />

          {/* 公共路由，所有登录用户都可以访问 */}
          {user && (
            <Route
              path="/dashboard"
              element={
                <StudentDashboard
                  user={user}
                  issues={issues}
                  onSubmitIssue={() => navigate("/submit")}
                  onDetail={(id) => navigate(`/detail/${id}`)}
                />
              }
            />
          )}

          {/* 管理员专用的 Admin Dashboard */}
          {user && user.role !== "student" && (
            <Route
              path="/admin"
              element={
                <AdminDashboard
                  issues={filteredIssues}
                  categories={["生活", "学业", "管理"]} // 暂时硬编码 categories
                  users={filteredUsers}
                  user={user}
                />
              }
            />
          )}
        </>
      )}
    </Routes>
  );
};

export default App;
