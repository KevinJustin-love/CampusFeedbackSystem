import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "./Home";

const AdminDashboard = ({ issues, categories, category, users, user }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSwitchToStudent = () => {
    navigate("/dashboard");
  };

  const handleViewDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  // 管理员角色配置
  const adminConfig = {
    life_admin: {
      title: "生活管理",
      category: "生活",
      showUsers: false,
    },
    study_admin: {
      title: "学业管理",
      category: "学业",
      showUsers: false,
    },
    manage_admin: {
      title: "管理管理",
      category: "管理",
      showUsers: true,
    },
  };

  // 通用表格组件
  const IssueTable = ({ title, issueList, showViewButton = true }) => (
    <div className="table-card">
      <h2 className="table-title">{title}</h2>
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
            {issueList.map((issue) => (
              <tr key={issue.id} className="table-row">
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>{issue.status}</td>
                <td>
                  {showViewButton && (
                    <button
                      className="btn-link"
                      onClick={() => handleViewDetail(issue.id)}
                    >
                      查看
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 用户管理表格组件
  const UserTable = () => (
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
                    onClick={() => handleViewDetail(user.id)}
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
  );

  // 根据角色确定显示的内容
  const renderContent = () => {
    const config = adminConfig[user.role];

    if (!config) {
      return <div>无权限访问</div>;
    }

    const filteredIssues = issues.filter(
      (issue) => issue.category === config.category
    );

    return (
      <div>
        <h2>{config.title}</h2>
        <IssueTable
          title={`${config.category}问题列表`}
          issueList={filteredIssues}
          showViewButton={user.role !== "manage_admin"}
        />
        {config.showUsers && <UserTable />}
      </div>
    );
  };

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      {/* 使用 Home 组件替代原有的标题栏 */}
      <Home user={user} />

      <div
        style={{
          position: "absolute",
          top: "85px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          className="btn-switch"
          onClick={handleSwitchToStudent}
          style={{ marginRight: "60px" }}
        >
          切换
        </button>
      </div>

      <div className="content-wrapper" style={{ marginTop: "30px" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
