import React from "react";

function HandlingProcess({ issue }) {
  return (
    <div className="process-container">
      <h2 className = "process-title">处理进度</h2>
      <div className="updates-list">
        {issue.updates.map((update) => (
          <div 
            key={update.timestamp} 
            className="timeline-item">
              <p className="update-text">{update.text}</p>
              <p className="update-date">{update.timestamp}</p>
                {update.file && (
                  <div className="update-file">
                    <h3>相关文件：</h3>
                    <a
                      href={update.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      点击下载
                    </a>
                  </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
}

export default HandlingProcess;