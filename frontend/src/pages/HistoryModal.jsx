import React from 'react';
import '../styles/HistoryModal.css';

const HistoryModal = ({ isOpen, onClose, historyData = [] }) => {
  if (!isOpen) return null;

  // 示例历史数据 - 校园生活问题
  const sampleData = [
    { id: 1, title: '宿舍网络连接不稳定', time: '2024-09-15 14:30', status: '已解决' },
    { id: 2, title: '图书馆座位预约系统故障', time: '2024-09-14 10:15', status: '处理中' },
    { id: 3, title: '食堂饭菜质量改进建议', time: '2024-09-13 16:45', status: '已关闭' },
    { id: 4, title: '教学楼空调温度调节问题', time: '2024-09-12 09:20', status: '已解决' },
    { id: 5, title: '校园卡充值系统使用问题', time: '2024-09-11 15:10', status: '待处理' }
  ];

  const displayData = historyData.length > 0 ? historyData : sampleData;

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <h2>历史记录</h2>
          <button className="history-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="history-modal-body">
          {displayData.length === 0 ? (
            <div className="history-empty">
              <p>暂无历史记录</p>
            </div>
          ) : (
            <div className="history-list">
              {displayData.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-main">
                    <h3 className="history-item-title">{item.title}</h3>
                    <span className="history-item-time">{item.time}</span>
                  </div>
                  <div className="history-item-status">
                    <span className={`status-badge status-${item.status}`}>
                      {item.status}
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