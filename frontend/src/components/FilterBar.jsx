import React from 'react';

import "../styles/FilterBar.css";

function FilterBar({ sortBy, onSortChange, category, onCategoryChange }) {
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
          <option value="学习问题">学习问题</option>
          <option value="生活问题">生活问题</option>
          <option value="技术问题">技术问题</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;