import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard.jsx";
import SubmitIssuePage from "./components/SubmitIssuePage";
import IssueDetailPage from "./components/IssueDetailPage";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "宿舍水管漏水",
      category: "生活",
      status: "处理中",
      updated_at: "2025-08-01",
      created_at: "2025-08-01",
      description: "宿舍401水管漏水，需要维修。",
      updates: [{ text: "已分配给维修部门", timestamp: "2025-08-01 10:00" }],
      comments: [
        { text: "请尽快处理", user: "学生A", timestamp: "2025-08-01 10:05" },
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
      updates: [],
      comments: [],
    },
  ]);
  const [categories] = useState(["生活", "学业", "管理"]);
  const [users] = useState([
    { id: 1, username: "student1", role: "学生" },
    { id: 2, username: "admin1", role: "管理员" },
  ]);

  const handleLogin = (credentials) => {
    setUser({
      username: credentials.username,
      role: credentials.username === "admin" ? "管理员" : "学生",
    });
    setPage(credentials.username === "admin" ? "admin" : "dashboard");
  };

  const handleSubmitIssue = (issue) => {
    setIssues([
      ...issues,
      {
        id: issues.length + 1,
        ...issue,
        status: "已提交",
        updated_at: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString().split("T")[0],
        updates: [],
        comments: [],
      },
    ]);
    setPage("dashboard");
  };

  return (
    <div className="app-container">
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && (
        <StudentDashboard
          user={user}
          issues={issues}
          onSubmitIssue={() => setPage("submit")}
        />
      )}
      {page === "submit" && <SubmitIssuePage onSubmit={handleSubmitIssue} />}
      {page === "detail" && <IssueDetailPage issue={issues[0]} />}
      {page === "admin" && (
        <AdminDashboard issues={issues} categories={categories} users={users} />
      )}
    </div>
  );
};

export default App;
