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
      role: credentials.role,
    });
    setPage(credentials.role.includes("管理员") ? "admin" : "dashboard");
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
    <div className="app-container">
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && (
        <StudentDashboard
          user={user}
          issues={issues}
          onSubmitIssue={() => setPage("submit")}
          setPage={setPage}
        />
      )}
      {page === "submit" && <SubmitIssuePage onSubmit={handleSubmitIssue} />}
      {page === "detail" && <IssueDetailPage issue={issues[0]} />}
      {page === "admin" && (
        <AdminDashboard
          user={user}
          issues={filteredIssues}
          categories={categories}
          users={filteredUsers}
          setPage={setPage}
        />
      )}
      {page === "profile" && <ProfilePage user={user} />}
      {/* 这里是个人主页的一个简单展示 */}
    </div>
  );
};

export default App;
