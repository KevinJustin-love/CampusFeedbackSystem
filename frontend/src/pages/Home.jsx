import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//状态导航栏
function IssuesNavbar({ activeTab, onTabChange }) {
  return (
    <div className="issues-navbar">
      <button
        className={`nav-button ${activeTab === "all" ? "active" : ""}`}
        onClick={() => onTabChange("all")}
      >
        全部
      </button>
      <button
        className={`nav-button ${activeTab === "mine" ? "active" : ""}`}
        onClick={() => onTabChange("mine")}
      >
        我的
      </button>
    </div>
  );
}


//个人信息栏
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
      className={`clock-icon ${className}`}  // 合并类名
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


//筛选栏组件
function FilterBar({ 
  sortBy, 
  onSortChange, 
  category, 
  onCategoryChange 
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">排序：</span>
        <select 
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="time">按时间</option>
          <option value="popularity">按热度</option>
        </select>
      </div>
      
      <div className="filter-group">
        <span className="filter-label">分类：</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">全部</option>
          <option value="life">生活</option>
          <option value="study">学业</option>
          <option value="management">管理</option>
        </select>
      </div>
    </div>
  );
}


// 分页组件
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const maxVisiblePages = 5; // 最多显示5个页码
  
  // 生成页码按钮
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 调整起始页码以确保显示完整的分页范围
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 添加第一页和省略号（如果需要）
    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => onPageChange(1)} className="page-number">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="left-ellipsis" className="ellipsis">...</span>);
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-number ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    // 添加最后一页和省略号（如果需要）
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="right-ellipsis" className="ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="page-number"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button 
        className="page-nav"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        上一页
      </button>
      
      {renderPageNumbers()}
      
      <button
        className="page-nav"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        下一页
      </button>
    </div>
  );
}

// 移除外部的handleClick函数，将其移至组件内部

const Home = ({ user, issues, onSubmitIssue, onDetail, id }) => {

  const navigate = useNavigate();

  const handleSwitchToAdmin = () => {
    navigate("/admin");
  };

  const [showModal,setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 状态管理
  const [sortBy, setSortBy] = useState("time"); // 排序状态
  const [category, setCategory] = useState("all"); // 分类状态
  const [currentPage, setCurrentPage] = useState(1); // 当前页码状态
  const [itemsPerPage] = useState(5); // 每页显示5条数据

  // 综合过滤和排序逻辑
  const filteredIssues = issues
    // 第一步：按"全部/我的"筛选
    .filter(issue => 
      activeTab === "all" || issue.author === user.username
    )
    // 第二步：按分类筛选
    .filter(issue =>
      category === "all" || issue.category === category
    )
    // 第三步：排序
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      } else {
        // 假设有popularity字段，没有则用评论数等代替
        return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    // 计算分页数据
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const currentItems = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 重置页码当过滤条件变化时
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, category, sortBy]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
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
          <SearchBar/>
        </div>
      <div className="content-wrapper">
        {user && user.role.includes('admin') && (
          <button onClick={handleSwitchToAdmin} className="btn-primary" style={{ marginRight: '10px' }}>切换</button>
        )}
        <button onClick={onSubmitIssue} className="btn-primary">提交新问题</button>

         {/* 导航栏 */}
        <IssuesNavbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* 筛选栏 */}
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />

        <div className="issues-grid">
          {currentItems.map((issue) => (
            <div key={issue.id} className="issue-card">
              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-info">分类：{issue.category}</p>
              <p className="issue-info">状态：{issue.status}</p>
              <p className="issue-info issue-date">更新时间：{issue.updated_at}</p>
              <p className="issue-popularity">热度：{issue.popularity || 0}</p>
              <button className="btn-link" onClick={() => navigate(`/detail/${issue.id}`)}>查看详情</button>
              <hr/>
            </div>
          ))}
        </div>

        {/* 分页组件 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>
    </div>
  );
};

export default Home;