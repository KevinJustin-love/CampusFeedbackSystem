import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarGreen from "./NavbarGreen";

import "../styles/HeroGreen.css";

const HeroGreen = ({ 
  user, 
  onSearch, 
  adminUnreadCount,
  adminFilter = false,
  isSearching = false,
  onUserUpdate,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  // 在组件挂载时获取用户信息
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("请先登录！");
        navigate("/login");
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleUserUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    if (onUserUpdate) {
      onUserUpdate(updatedUserData);
    }
  };

  return (
    <div className="hero-green-container">
      <div className="hero-green-navbar">
        <NavbarGreen
          user={currentUser}
          onSearch={onSearch}
          adminUnreadCount={adminUnreadCount}
          adminFilter={adminFilter}
          isSearching={isSearching}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
};

export default HeroGreen;