// Home.jsx (模拟实现)
import React from 'react';
// 假设您有一个专门的样式文件
import "../styles/Home.css"; 

// 预设岛屿/分类数据
const ISLANDS = [
    { id: 'bug', name: '程序错误岛', topic: 'Bug/Error', icon: '🐛' },
    { id: 'feature', name: '新功能愿望岛', topic: 'Feature Request', icon: '✨' },
    { id: 'suggestion', name: '系统建议岛', topic: 'General Suggestion', icon: '💡' },
    // 添加更多分类
];

// 假设 onSearch 仍然用于搜索框，currentCategory 和 onTopicSelect 用于地图交互
const Home = ({ user, onSearch, currentCategory, onTopicSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="home-map-container">
            {/* 顶部的用户欢迎和搜索栏 (保留现有 Home 组件逻辑) */}
            <div className="home-header">
                <h2>欢迎, {user ? user.username : '访客'}!</h2>
                <form onSubmit={handleSearchSubmit} className="search-bar">
                    <input
                        type="text"
                        placeholder="搜索岛上的信件..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">🔍</button>
                </form>
            </div>

            {/* 海洋地图区域 */}
            <div className="ocean-map">
                {/* 1. 送信的鸽子区域（代表所有问题） */}
                <div 
                    className={`pigeon-post-area ${currentCategory === 'all' ? 'active-selection' : ''}`}
                    onClick={() => onTopicSelect('all')} // 触发显示所有问题
                    title="点击查看所有信件 (按时间/热度排序)"
                >
                    <span className="pigeon-icon">🕊️</span>
                    <p>问题总览海域</p>
                </div>

                {/* 2. 岛屿群（代表不同分类） */}
                {ISLANDS.map((island) => (
                    <div
                        key={island.id}
                        className={`island ${currentCategory === island.topic ? 'active-selection' : ''}`}
                        onClick={() => onTopicSelect(island.topic)} // 触发显示特定分类问题
                        style={{ /* 实际项目中应使用定位，例如 top: 'X%', left: 'Y%' */ }} 
                    >
                        <span className="island-icon">{island.icon}</span>
                        <h4>{island.name}</h4>
                    </div>
                ))}

                {/* 提示信息 */}
                <div className="map-legend">
                    选择一个岛屿或鸽子来筛选问题
                </div>
            </div>
        </div>
    );
};

export default Home;