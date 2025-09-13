import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfile from "./Profile";
import Navbar from "../components/Navbar";
import NotificationPanel from "../pages/MessagePage";
// /dashboard 与 /admin 都是基于此页面的

import "../styles/Home.css";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // 下面是消息界面，目前采用硬编码

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      problemId: 101,
      problemTitle: "登录页面加载缓慢",
      content: "您关注的问题状态已更新：处理中 → 已解决",
      time: "10分钟前",
      isRead: false,
      type: "status",
    },
    {
      id: 2,
      problemId: 102,
      problemTitle: "支付功能异常",
      content: "您关注的问题状态已更新：待处理 → 处理中",
      time: "2小时前",
      isRead: false,
      type: "status",
    },
    {
      id: 3,
      problemId: 103,
      problemTitle: "图片上传失败",
      content: "您关注的问题有了新的回复",
      time: "昨天",
      isRead: true,
      type: "reply",
    },
  ]);

  // 计算未读消息数量
  // const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 标记单条消息为已读
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 标记所有消息为已读
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  // 处理消息点击
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/detail/${notification.problemId}`);
  };

  // 处理消息栏点击 - 新增函数
  const handleMessageBarClick = () => {
    setShowNotificationPanel(true);
  };

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
        const response = await axios.get(
          "http://127.0.0.1:8000/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="dashboard-title">
        <img
          src={currentUser?.avatar || "../../pictures/OIP-C.jpg"}
          alt="用户头像"
          className="userimg"
          onClick={() => setShowModal(true)}
        />
        {showModal && (
          <UserProfile
            user={currentUser}
            onClose={() => setShowModal(false)}
            onUpdate={handleUserUpdate}
          />
        )}
        <NotificationPanel
          isOpen={showNotificationPanel}
          onClose={() => setShowNotificationPanel(false)}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
        />
        欢迎，{currentUser?.username || user?.username || "访客"}
        <Navbar
          onMessageBarClick={handleMessageBarClick}
          // unreadCount={unreadCount}
        />
      </div>
    </div>
  );
};

export default Home;
