import React, { useState, useEffect } from 'react';
import { favoriteAPI } from '../api';
import '../styles/FavoritesModal.css';

const FavoritesModal = ({ isOpen, onClose }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取收藏列表
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await favoriteAPI.getFavorites();
        setFavorites(response.data);
      } catch (error) {
        console.error('获取收藏列表失败:', error);
        setError('获取收藏列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isOpen]);

  // 取消收藏
  const handleRemoveFavorite = async (issueId) => {
    try {
      await favoriteAPI.toggleFavorite(issueId);
      // 从列表中移除
      setFavorites(prev => prev.filter(item => item.issue !== issueId));
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  const handleItemClick = (issueId) => {
    // 跳转到问题详情页
    window.location.href = `/detail/${issueId}`;
  };

  if (!isOpen) return null;

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
          {loading ? (
            <div className="favorites-loading">加载中...</div>
          ) : error ? (
            <div className="favorites-error">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="favorites-empty">
              <div className="empty-icon">⭐</div>
              <p>暂无收藏内容</p>
              <span className="empty-hint">点击收藏按钮收藏您喜欢的问题</span>
            </div>
          ) : (
            <div className="favorites-list">
              {favorites.map((item) => (
                <div key={item.id} className="favorite-item">
                  <div 
                    className="favorite-item-main"
                    onClick={() => handleItemClick(item.issue)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4 className="favorite-item-title">{item.issue_title}</h4>
                    <div className="favorite-item-meta">
                      <span className="favorite-item-topic">{item.issue_topic}</span>
                      <span className="favorite-item-status">{item.issue_status}</span>
                      <span className="favorite-item-date">{new Date(item.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button 
                    className="favorite-item-action"
                    onClick={() => handleRemoveFavorite(item.issue)}
                    title="取消收藏"
                  >
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