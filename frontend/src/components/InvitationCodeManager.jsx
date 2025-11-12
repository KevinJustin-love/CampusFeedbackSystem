import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/InvitationCodeManager.css';

const InvitationCodeManager = () => {
  const [codes, setCodes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvitationCodes();
    fetchRoles();
  }, []);

  const fetchInvitationCodes = async () => {
    try {
      const response = await api.get('/api/admin/invitation-codes/');
      setCodes(response.data);
    } catch (error) {
      console.error('获取邀请码失败:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/admin/roles/');
      setRoles(response.data);
    } catch (error) {
      console.error('获取角色失败:', error);
    }
  };

  const generateCode = async () => {
    if (!selectedRole) {
      alert('请选择角色');
      return;
    }

    setLoading(true);
    try {
      const data = { role_to_assign: selectedRole };
      if (customCode.trim()) {
        data.code = customCode.trim().toUpperCase();
      }

      const response = await api.post('/api/admin/invitation-codes/', data);
      setCodes([response.data, ...codes]);
      setCustomCode('');
      alert('邀请码生成成功: ' + response.data.code);
    } catch (error) {
      alert('生成邀请码失败: ' + (error.response?.data?.code || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteCode = async (id) => {
    if (!confirm('确定要删除这个邀请码吗？')) return;

    try {
      await api.delete(`/api/admin/invitation-codes/${id}/`);
      setCodes(codes.filter(code => code.id !== id));
      alert('邀请码删除成功');
    } catch (error) {
      alert('删除失败: ' + error.message);
    }
  };

  return (
    <div className="invitation-manager">
      <div className="manager-header">
        <h2>邀请码管理</h2>
      </div>

      <div className="generate-section">
        <h3>生成新邀请码</h3>
        <div className="form-row">
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-select"
          >
            <option value="">选择角色</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="自定义邀请码（可选）"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
            className="code-input"
          />
          
          <button 
            onClick={generateCode}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? '生成中...' : '生成邀请码'}
          </button>
        </div>
      </div>

      <div className="codes-list">
        <h3>现有邀请码</h3>
        <table>
          <thead>
            <tr>
              <th>邀请码</th>
              <th>角色</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>使用者</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(code => (
              <tr key={code.id}>
                <td className="code-cell">{code.code}</td>
                <td>{code.role_name}</td>
                <td>
                  <span className={`status ${code.is_used ? 'used' : 'available'}`}>
                    {code.is_used ? '已使用' : '可用'}
                  </span>
                </td>
                <td>{new Date(code.created_at).toLocaleDateString()}</td>
                <td>{code.used_by || '-'}</td>
                <td>
                  {!code.is_used && (
                    <button 
                      onClick={() => deleteCode(code.id)}
                      className="delete-btn"
                    >
                      删除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitationCodeManager;