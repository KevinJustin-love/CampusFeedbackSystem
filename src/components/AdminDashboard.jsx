import React, { useState } from "react";

const AdminDashboard = ({ user, issues, categories, users, setPage }) => {
  const handleSwitchToStudent = () => {
    setPage("dashboard");
  };

  // 切换到个人主页，后续须添加该组件
  const handleGoToProfile = () => {
    setPage("profile");
  };

  // 根据角色确定显示的内容
  const renderContent = () => {
    if (user.role === "生活管理员") {
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
                  {issues.map((issue) => (
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
        </div>
      );
    } else if (user.role === "学业管理员") {
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
                  {issues.map((issue) => (
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
        </div>
      );
    } else if (user.role === "管理管理员") {
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
                  {issues.map((issue) => (
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
                        <button className="btn-link">编辑</button>
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
    <div className="admin-container">
      <div className="header-actions">
        <button className="btn-switch" onClick={handleSwitchToStudent}>
          切换
        </button>
        <button className="btn-profile" onClick={handleGoToProfile}>
          个人主页
        </button>
      </div>
      <div className="content-wrapper">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;