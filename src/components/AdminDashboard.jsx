import React, { useState } from "react";

const AdminDashboard = ({ issues, categories, users }) => {
  return (
    <div className="admin-container">
      <div className="content-wrapper">
        <h1 className="dashboard-title">管理员仪表盘</h1>
        <div className="overview-grid">
          <div className="overview-card">
            <h2 className="overview-title">问题概览</h2>
            <p className="overview-info">未解决问题：{issues.filter(i => i.status !== '已关闭').length}</p>
            <p className="overview-info">总问题数：{issues.length}</p>
          </div>
          <div className="overview-card">
            <h2 className="overview-title">问题分类分布</h2>
            <canvas id="issueChart" className="chart-canvas"></canvas>
          </div>
        </div>
        <div className="table-card">
          <h2 className="table-title">问题列表</h2>
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
    </div>
  );
};

export default AdminDashboard;