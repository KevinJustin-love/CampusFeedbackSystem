import React, { useEffect } from 'react';
import { useViewHistory } from '../hooks/useViewHistory';
import { useNavigate } from 'react-router-dom';
import '../styles/HistoryModal.css';

const HistoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    history,
    loading,
    error,
    fetchHistory,
    clearHistory,
    formatTime,
    getStatusText,
    getStatusClass
  } = useViewHistory();

  // 当弹窗打开时获取历史记录
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  if (!isOpen) return null;

  const handleItemClick = (issueId) => {
    onClose();
    navigate(`/detail/${issueId}`);
  };

  const handleClearHistory = async () => {
    if (window.confirm('确定要清空所有浏览历史吗？')) {
      await clearHistory();
    }
  };

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <h2>浏览历史</h2>
          <div className="history-header-actions">
            {history.length > 0 && (
              <button className="clear-history-btn" onClick={handleClearHistory}>
                清空历史
              </button>
            )}
            <button className="history-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        
        <div className="history-modal-body">
          {loading && (
            <div className="history-loading">
              <div className="loading-spinner"></div>
              <p>加载中...</p>
            </div>
          )}
          
          {error && (
            <div className="history-error">
              <p>{error}</p>
              <button onClick={fetchHistory}>重试</button>
            </div>
          )}
          
          {!loading && !error && history.length === 0 && (
            <div className="history-empty">
              <div className="empty-icon">🕒</div>
              <p>暂无浏览历史</p>
              <p className="empty-hint">浏览问题后，历史记录会显示在这里</p>
            </div>
          )}
          
          {!loading && !error && history.length > 0 && (
            <div className="history-list">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="history-item"
                  onClick={() => handleItemClick(item.issue)}
                >
                  <div className="history-item-main">
                    <h3 className="history-item-title">{item.issue_title}</h3>
                    <div className="history-item-meta">
                      <span className="history-item-topic">{item.issue_topic}</span>
                      <span className="history-item-time">{formatTime(item.viewed_at)}</span>
                    </div>
                  </div>
                  <div className="history-item-status">
                    <span className={`status-badge ${getStatusClass(item.issue_status)}`}>
                      {getStatusText(item.issue_status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;