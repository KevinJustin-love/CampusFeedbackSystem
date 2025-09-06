import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import AdminDashboard from "./pages/AdminDashboard";
import IssueDetailPage from "./pages/IssueDetailPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ACCESS_TOKEN } from "./constants";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <RegisterPage />;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // 检查用户登录状态的函数
  const checkUserAuth = () => {
    console.log("检查登录状态开始");
    setIsLoading(true);

    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("Token:", token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("解码后的token:", decodedToken);
        // 提取username和role，如果不存在则使用默认值
        const username =
          decodedToken.username || `user_${decodedToken.user_id}`;
        const role = decodedToken.role || "student";
        setUser({ username, role });
        console.log("设置用户:", { username, role });
      } catch (error) {
        console.error("无效的令牌:", error);
        localStorage.removeItem(ACCESS_TOKEN);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
    console.log("检查登录状态完成");
  };

  // 在组件挂载时和路由变化时检查用户状态
  useEffect(() => {
    checkUserAuth();
  }, [location.pathname]); // 监听路由变化

  // 过滤 issues 根据管理员范围
  const filteredIssues = user
    ? issues.filter((issue) => {
        if (user.role === "life_admin") return issue.category === "生活";
        if (user.role === "study_admin") return issue.category === "学业";
        if (user.role === "manage_admin") return issue.category === "管理";
        return true;
      })
    : issues;
  
    const filteredUsers = [];

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
      <Route
        path="/dashboard"
        element={

          (
               <StudentDashboard
                 user={user}
                 issues={issues}
                 onSubmitIssue={() => navigate("/submit")}
                 onDetail={(id) => navigate(`/detail/${id}`)}
               />
             ) 

          // <ProtectedRoute>
            // {user ? (
            //   <StudentDashboard
            //     user={user}
            //     issues={issues}
            //     onSubmitIssue={() => navigate("/submit")}
            //     onDetail={(id) => navigate(`/detail/${id}`)}
            //   />
            // ) : (
            //   <div>加载用户信息中...</div>
            // )}
          // </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <SubmitIssuePage onSubmit={handleSubmitIssue} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/detail/:id"
        element={
          // <ProtectedRoute>
            <IssueDetailPage issues={issues} setIssues={setIssues} />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {user && user.role !== "student" && (
              <AdminDashboard
                issues={filteredIssues}
                categories={["生活", "学业", "管理"]} // 暂时硬编码 categories
                users={filteredUsers}
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
