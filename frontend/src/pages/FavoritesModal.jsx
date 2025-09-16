import React from 'react';
import '../styles/FavoritesModal.css';

const FavoritesModal = ({ isOpen, onClose, favoritesData = [] }) => {
  if (!isOpen) return null;

  // 示例收藏数据 - 校园生活问题
  const sampleData = [
    { id: 1, title: '宿舍网络连接不稳定问题', starred: true },
    { id: 2, title: '图书馆座位预约系统故障', starred: true },
    { id: 3, title: '食堂饭菜质量改进建议', starred: true },
    { id: 4, title: '教学楼空调温度调节问题', starred: true },
    { id: 5, title: '校园卡充值系统使用问题', starred: true }
  ];

  const displayData = favoritesData.length > 0 ? favoritesData : sampleData;

  return (
    <div className="favorites-modal-overlay" onClick={onClose}>
      <div className="favorites-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-modal-header">
          <h2>我的收藏</h2>
          <button className="favorites-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="favorites-modal-body">
          {displayData.length === 0 ? (
            <div className="favorites-empty">
              <div className="empty-icon">⭐</div>
              <p>暂无收藏内容</p>
              <span className="empty-hint">点击星号图标收藏您喜欢的内容</span>
            </div>
          ) : (
            <div className="favorites-list">
              {displayData.map((item) => (
                <div key={item.id} className="favorite-item">
                  <div className="favorite-item-main">
                    <h4 className="favorite-item-title">{item.title}</h4>
                  </div>
                  <button className="favorite-item-action">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                    >
                      <path d="M12 2L14.47 8.53L21 9.27L16.24 14.25L17.47 21L12 17.77L6.53 21L7.76 14.25L3 9.27L9.53 8.53L12 2Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;