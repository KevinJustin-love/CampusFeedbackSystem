import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// /dashboard 与 /admin 都是基于此页面的

function UserProfileModal({ user, onClose, onUpdate }) {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar || "../../pictures/OIP-C.jpg"
  );
  const fileInputRef = useRef(null);

  // 确保在组件挂载时从后端获取最新的用户信息
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("请先登录！");
        onClose();
        return;
      }
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedUser = response.data;
        setCurrentUserData(fetchedUser);
        setEmail(fetchedUser.email || "");
        setPhone(fetchedUser.phone || "");
        setBio(fetchedUser.bio || "");
        setAvatarPreview(fetchedUser.avatar || "../../pictures/OIP-C.jpg");
      } catch (error) {
        console.error("无法获取用户信息:", error);
        alert("无法加载用户信息，请稍后重试。");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [onClose]); // 当 onClose 变化时重新运行此 effect

  // 处理头像上传和实时预览
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl); // 更新模态框内的预览
      if (typeof onUpdate === "function") {
        onUpdate({
          ...user,
          avatar: previewUrl, // 传递临时预览URL给父组件
        });
      }
    }
  };

  // 处理信息保存
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const token = localStorage.getItem("access");

    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/auth/profile/", // 这里暂时硬编码
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (typeof onUpdate === "function") {
        onUpdate(response.data);
      }

      alert("用户信息已成功更新！");
      onClose();
    } catch (error) {
      console.error("更新用户信息失败:", error);
      console.error("后端返回错误信息:", error.response.data);
      alert("更新失败，请重试。");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="profile-header">
          <img
            src={avatarPreview}
            alt="用户头像"
            className="profile-avatar"
            onClick={() => fileInputRef.current.click()}
          />
          <h2 className="modalUserName">{currentUserData?.username}</h2>
        </div>
        <div className="profile-details">
          {/* 隐藏的文件输入框 */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <p>
            <strong>邮箱:</strong>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </p>
          <p>
            <strong>电话:</strong>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </p>
          <p>
            <strong>简介:</strong>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>保存更改</button>
        </div>
      </div>
    </div>
  );
}

//消息栏图标
function MessageBar() {
  return (
    <span className="message-bar">
      <svg
        className="envelope-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </span>
  );
}

//历史记录图标
function ClockIcon({ size = 24, stroke = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      className={`clock-icon ${className}`} // 合并类名
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

//收藏夹图标
function StarIcon({ filled = false, color = "gold", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="star-icon"
    >
      {/* 五角星路径 */}
      <path d="M12 2L14.47 8.53L21 9.27L16.24 14.25L17.47 21L12 17.77L6.53 21L7.76 14.25L3 9.27L9.53 8.53L12 2Z" />
    </svg>
  );
}

//搜索栏
function SearchBar() {
  return (
    <div className="search-container">
      <input type="text" placeholder="输入关键词..." className="search-input" />
      <button className="search-button">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
        </svg>
      </button>
    </div>
  );
}

// 移除外部的handleClick函数，将其移至组件内部

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

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
          "http://127.0.0.1:8000/api/auth/profile/",
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
          src={currentUser.avatar || "../../pictures/OIP-C.jpg"}
          alt="用户头像"
          className="userimg"
          onClick={() => setShowModal(true)}
        />
        {showModal && (
          <UserProfileModal
            user={currentUser}
            onClose={() => setShowModal(false)}
            onUpdate={handleUserUpdate}
          />
        )}
        欢迎，{user.username}
        {/* 这里用 user 也没问题，因为更改信息时不会影响username */}
        <ClockIcon />
        <MessageBar />
        <StarIcon />
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;