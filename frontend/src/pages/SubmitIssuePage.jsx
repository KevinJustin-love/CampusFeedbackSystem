import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { feedbackAPI, classifyAPI } from "../api";

import "../styles/SubmitIssuePage.css";

const SubmitIssuePage = ({ onIssueSubmitted, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 获取来源页面信息，默认为 /dashboard
  const fromPage = location.state?.from || "/dashboard";
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [topics, setTopics] = useState([]);
  const [date, setDate] = useState(""); // 新增日期状态

  // 智能分类相关状态
  const [classifying, setClassifying] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [classifyConfidence, setClassifyConfidence] = useState(0);
  const [classifyReason, setClassifyReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 取消按钮的处理函数
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // 返回到来源页面
      navigate(fromPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 使用 FormData 处理文件上传
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic); // 确保字段名与后端模型匹配
      formData.append("description", description);
      formData.append("is_public", isPublic);
      formData.append("date", date);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      // 调用 API 提交数据
      const res = await feedbackAPI.createIssue(formData);
      console.log("后端响应数据：", res.data);
      // res.data 包含了新创建问题的完整信息，包括 id
      const newIssueId = res.data.id;

      navigate(`/detail/${newIssueId}`);

      // 提交成功后，调用父组件传递的函数，并传递新创建的问题数据
      onIssueSubmitted(res.data);
      setSuccess(true);

      //清空表单
      setTopic("");
      setTitle("");
      setDescription("");
      setAttachment(null);
      setIsPublic(true);
    } catch (err) {
      console.error("提交问题失败：", err);
      setError("问题提交失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await feedbackAPI.getTopicList();
      setTopics(res.data);
    };
    fetchTopics();
  }, []);

  // 执行智能分类（通过按钮触发）
  const performClassification = async () => {
    if (!title && !description) {
      alert("请先输入标题或描述");
      return;
    }

    setClassifying(true);
    setSuggestedCategory(null); // 清除之前的建议
    try {
      const response = await classifyAPI.classifyIssue({
        title,
        description,
      });

      setSuggestedCategory(response.data.category);
      setClassifyConfidence(response.data.confidence);
      setClassifyReason(response.data.reason);

      // 如果用户还没有手动选择分类且置信度高，自动填充建议分类
      if (!topic && response.data.confidence > 0.7) {
        setTopic(response.data.category);
      }
    } catch (err) {
      console.error("智能分类失败：", err);
      alert("智能分类失败，请稍后重试");
    } finally {
      setClassifying(false);
    }
  };

  // 用户点击采纳建议分类
  const handleAcceptSuggestion = () => {
    if (suggestedCategory) {
      setTopic(suggestedCategory);
    }
  };

  if (success) {
    return (
      <div className="submit-card">
        <h2 className="submit-title">提交成功！</h2>
        <p>您的问题已成功提交，感谢您的反馈。</p>
        <button onClick={handleCancel} className="btn-primary1">
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="submit-container">
      <div className="submit-card">
        <h2 className="submit-title">提交问题</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic" className="form-label">
              问题分类
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
                required
              >
                <option value="">选择分类</option>
                <option value="学业">学业</option>
                <option value="生活">生活</option>
                <option value="管理">管理</option>
              </select>
              <button
                type="button"
                className="ai-classify-btn"
                onClick={performClassification}
                disabled={classifying || (!title && !description)}
              >
                {classifying ? "🤖 分析中..." : "🤖 智能分类"}
              </button>
            </div>

            {/* 智能分类建议提示框 */}
            {suggestedCategory &&
              suggestedCategory !== topic &&
              !classifying && (
                <div className="ai-suggestion-box">
                  <div className="ai-suggestion-header">
                    <span className="ai-icon">🤖</span>
                    <span className="ai-title">AI 智能建议</span>
                    <span
                      className="ai-confidence"
                      style={{
                        color:
                          classifyConfidence > 0.8
                            ? "#4CAF50"
                            : classifyConfidence > 0.6
                            ? "#FF9800"
                            : "#999",
                      }}
                    >
                      置信度: {(classifyConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="ai-suggestion-content">
                    <p className="ai-category">
                      建议分类：<strong>{suggestedCategory}</strong>
                    </p>
                    <p className="ai-reason">{classifyReason}</p>
                  </div>
                  <button
                    type="button"
                    className="ai-accept-btn"
                    onClick={handleAcceptSuggestion}
                  >
                    ✓ 采纳建议
                  </button>
                </div>
              )}
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              标题
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              问题发生时间
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
              required // 保持必填状态，以确保数据完整性
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              描述
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="attachment" className="form-label">
              附件
            </label>
            <input
              type="file"
              id="attachment"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="form-input"
            />
          </div>

          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic">公开问题</label>
          </div>

          <button type="submit" className="btn-primary1" disabled={loading}>
            {loading ? "提交中..." : "提交"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-primary1"
            style={{ marginLeft: "10px" }}
          >
            取消
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitIssuePage;
