import React, { useState } from "react";

const SubmitIssuePage = ({ onSubmit }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isAnonymous,setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, title, description, file, isAnonymous });
  };

  return (
    <div className="submit-container">
      <div className="submit-card">
        <h2 className="submit-title">提交问题</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category" className="form-label">问题分类</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              required
            >
              <option value="">选择分类</option>
              <option value="生活">生活</option>
              <option value="学业">学业</option>
              <option value="管理">管理</option>
            </select>
          </div>
          <div className="form-group">
            <label 
              htmlFor="title" 
              className="form-label">
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
            <label 
              htmlFor="description" 
              className="form-label">
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
            <label
              htmlFor="file" 
              className="form-label">
                附件
              </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-primary1">提交</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitIssuePage;