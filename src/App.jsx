// App.jsx（使用 React Router）
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";
import SubmitIssuePage from "./components/SubmitIssuePage";
import AdminDashboard from "./components/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";

const App = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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

  const [categories] = useState(["生活", "学业", "管理"]);
  const [users] = useState([
    { id: 1, username: "student1", role: "学生" },
    { id: 2, username: "lifeAdmin", role: "生活管理员" },
    { id: 3, username: "studyAdmin", role: "学业管理员" },
    { id: 4, username: "manageAdmin", role: "管理管理员" },
  ]);

  const handleLogin = (credentials) => {
    const role =
      credentials.username === "lifeAdmin"
        ? "生活管理员"
        : credentials.username === "studyAdmin"
        ? "学业管理员"
        : credentials.username === "manageAdmin"
        ? "管理管理员"
        : "学生";
    setUser({ username: credentials.username, role });
    navigate(role.includes("管理员") ? "/admin" : "/dashboard");
  };

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

  // 过滤 issues 和 users 根据管理员范围
  const filteredIssues = user
    ? issues.filter((issue) => {
        if (user.role === "生活管理员") return issue.category === "生活";
        if (user.role === "学业管理员") return issue.category === "学业";
        if (user.role === "管理管理员") return issue.category === "管理";
        return true;
      })
    : issues;
  const filteredUsers = user
    ? users.filter((u) => u.role === user.role)
    : users;
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

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

      <Route
        path="/submit"
        element={<SubmitIssuePage onSubmit={handleSubmitIssue} />}
      />

      <Route path="/detail/:id" element={<IssueDetailPage issues={issues} />} />

      <Route
        path="/admin"
        element={
          <AdminDashboard
            issues={issues}
            categories={categories}
            users={users}
            user={user}
          />
        }
      />
    </Routes>
  );
};

export default App;