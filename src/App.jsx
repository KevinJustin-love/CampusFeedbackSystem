import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard.jsx";
import SubmitIssuePage from "./components/SubmitIssuePage";
import AdminDashboard from "./components/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [selectedIssue, setSelectedIssue] = useState(null);
  // Sample issues and categories
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
      updates: [{ text: "已分配给维修部门", timestamp: "2025-08-01 10:00", file: null }],
      comments: [
        { id: 1, message: "请尽快处理", sender: "学生A", timestamp: "2025-08-01 10:05" },
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
    { id: 2, username: "admin1", role: "管理员" },
  ]);

  // Added state for comments for the selected issue
  const [commentMessages, setCommentMessages] = useState(
    issues[0].comments.map(comment => ({
      id: comment.id,
      message: comment.message,
      sender: comment.sender,
      timestamp: comment.timestamp,
    }))
  );

  const handleLogin = (credentials) => {
    setUser({
      username: credentials.username,
      role: credentials.username === "admin" ? "管理员" : "学生",
    });
    setPage(credentials.username === "admin" ? "admin" : "dashboard");
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
      reporter: issue.isAnonymous ? "匿名用户" : user?.username || "未知用户"
    };
    setIssues([...issues, newIssue]);
    navigate("/dashboard");
  };
  const handleDetail = (issue) => {
    setSelectedIssue(issue);
    setCommentMessages(issue.comments); // 加载对应的评论
    setPage("detail");
  };
  

  return (
    <div className="app-container">
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && (
        <StudentDashboard
          user={user}
          issues={issues}
          onSubmitIssue={() => setPage("submit")}
          onDetail={handleDetail}
        />
      )}
      {page === "submit" && <SubmitIssuePage onSubmit={handleSubmitIssue} />}
      {page === "detail" && (
        <IssueDetailPage
          issue={selectedIssue} //pass the selected issue
          commentMessages={commentMessages}
          setCommentMessages={setCommentMessages}
        />
      )}
      {page === "admin" && (
        <AdminDashboard issues={issues} categories={categories} users={users} />
      )}
    </div>
  );
};

export default App;