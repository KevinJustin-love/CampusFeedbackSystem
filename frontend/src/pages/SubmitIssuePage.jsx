import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { feedbackAPI } from "../api";

import "../styles/SubmitIssuePage.css";

const SubmitIssuePage = ({ onIssueSubmitted, onCancel }) => {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isPublic,setIsPublic] = useState(true);
  const [topics, setTopics] = useState([]);
  const [date, setDate] = useState(''); // 新增日期状态

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 使用 FormData 处理文件上传
      const formData = new FormData();
      formData.append('title', title);
      formData.append('topic', topic); // 确保字段名与后端模型匹配
      formData.append('description', description);
      formData.append('is_public', isPublic); 
      formData.append('date', date)

      if (attachment) {
        formData.append('attachment', attachment);
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
      setTopic('');
      setTitle('');
      setDescription('');
      setAttachment(null);
      setIsPublic(true)
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

  if (success) {
      return (
          <div className="submit-card">
              <h2 className="submit-title">提交成功！</h2>
              <p>您的问题已成功提交，感谢您的反馈。</p>
              <button onClick={onCancel} className="btn-primary1">返回</button>
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
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="form-input"
              required
            >
              <option value="">选择分类</option>
              <option value="学业">学业</option>
              <option value="生活">生活</option>
              <option value="管理">管理</option>
            </select>
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
            onClick={onCancel}
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