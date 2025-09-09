import React, { useRef,useState, useEffect } from "react"
import axios from "axios"

import "../styles/Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL

export default function UserProfile({ user, onClose, onUpdate }) {
    const [currentUserData, setCurrentUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
      user?.avatar || "../../pictures/OIP-C.jpg"
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
            `${API_BASE_URL}/api/auth/profile/`,
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
          `${API_BASE_URL}/api/auth/profile/`,
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