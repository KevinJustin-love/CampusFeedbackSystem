import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 个人信息栏
function UserProfileModal({ user, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="profile-header">
          <img src="../../pictures/OIP-C.jpg"  alt="用户头像" className="profile-avatar" />
          <h2 className="modalUserName">{user.username}</h2>
        </div>
        <div className="profile-details">
          <p><strong>邮箱:manba out</strong> {user.email}</p>
          <p><strong>电话:manba out</strong> {user.phone}</p>
          <p><strong>简介:manba out</strong> {user.bio}</p>
        </div>
      </div>
    </div>
  );
}

// 消息栏图标
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

// 历史记录图标
function ClockIcon({ size = 24, stroke = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      className={`clock-icon ${className}`}  // 合并类名
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// 收藏夹图标
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

// 搜索栏
function SearchBar() {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="输入关键词..."
        className="search-input"
      />
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

const AdminDashboard = ({ issues, categories, category, users, user }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSwitchToStudent = () => {
    navigate("/dashboard");
  };

  const handleViewDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  // 切换到个人主页，后续须添加该组件
  const handleGoToProfile = () => {
    navigate("/profile");
  };

  // 根据角色确定显示的内容
  const renderContent = () => {
    if (user.role === "life_admin") {
      const lifeIssues = issues.filter((issue) => issue.category === "生活");
      return (
        <div>
          <h2>生活管理</h2>
          <div className="table-card">
            <h2 className="table-title">生活问题列表</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {lifeIssues.map((issue) => (
                    <tr key={issue.id} className="table-row">
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.status}</td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => handleViewDetail(issue.id)}
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (user.role === "study_admin") {
      const studyIssues = issues.filter((issue) => issue.category === "学业");
      return (
        <div>
          <h2>学业管理</h2>
          <div className="table-card">
            <h2 className="table-title">学业问题列表</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {studyIssues.map((issue) => (
                    <tr key={issue.id} className="table-row">
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.status}</td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => handleViewDetail(issue.id)}
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (user.role === "manage_admin") {
      const managementIssues = issues.filter((issue) => issue.category === "管理");
      return (
        <div>
          <h2>管理管理</h2>
          <div className="table-card">
            <h2 className="table-title">管理问题列表</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {managementIssues.map((issue) => (
                    <tr key={issue.id} className="table-row">
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.status}</td>
                      <td>
                        <button className="btn-link">查看</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="table-card">
            <h2 className="table-title">用户管理</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => handleViewDetail(issue.id)}
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return <div>无权限访问</div>; // 默认情况
  };

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      <div className="dashboard-title" style={{ 
        padding: 0, 
        margin: 0, 
        width: '100%',
        borderRadius: 0,
        textIndent: '150px'
      }}>
        <img 
          src="../../pictures/OIP-C.jpg" 
          className="userimg"
          onClick={() => setShowModal(true)}
        />
        {showModal && (
          <UserProfileModal 
            user={user} 
            onClose={() => setShowModal(false)} 
          />
        )}
        欢迎，{user.username}
        <ClockIcon/>
        <MessageBar/>
        <StarIcon/>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <SearchBar/>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '85px', right: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-switch" onClick={handleSwitchToStudent}>
          切换
        </button>
        <button className="btn-profile" onClick={handleGoToProfile}>
          个人主页
        </button>
      </div>
      
      <div className="content-wrapper" style={{ marginTop: '30px' }}>{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
