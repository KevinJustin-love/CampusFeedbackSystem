import React from "react";

const ProfilePage = ({ user }) => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">个人主页</h1>
      {user ? (
        <div className="profile-info">
          <p>用户名: {user.username}</p>
          <p>角色: {user.role}</p>
        </div>
      ) : (
        <p>请先登录</p>
      )}
      <button className="btn-back" onClick={() => window.history.back()}>
        返回
      </button>
    </div>
  );
};

export default ProfilePage;