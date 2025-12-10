import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

import "../styles/Hero.css";

const Home = ({
  user,
  onSearch,
  adminUnreadCount,
  adminFilter = false,
  isSearching = false,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  // 旧的通知系统已移除，现在使用新的集成通知系统

  // 在组件挂载时获取用户信息
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("请先登录！");
        navigate("/login"); // 或者其他登录页面
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("无法获取用户信息:", error);
        alert("无法加载用户信息，请稍后重试。");
        // 可以选择在这里处理错误，比如退出登录
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleUserUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
  };

  return (
    <div>
      <div className="dashboard-title">
        <Navbar
          onSearch={onSearch}
          adminUnreadCount={adminUnreadCount}
          adminFilter={adminFilter}
          isSearching={isSearching}
          user={currentUser}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
};

export default Home;
