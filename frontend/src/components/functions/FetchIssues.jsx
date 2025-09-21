import { feedbackAPI } from "../../api";
import axios from "axios";

export const fetchIssues = async (setLoading, setIssues, setError, config) => {
  try {
    setLoading(true);
    console.log("正在获取问题列表，参数:", config);
    console.log("API基础URL:", import.meta.env.VITE_API_URL);
    
    const res = await feedbackAPI.getIssueList(config);
    console.log("API 响应状态:", res.status);
    console.log("响应数据:", res.data);
    console.log("数据长度:", res.data?.length || 0);
    console.log("数据类型:", Array.isArray(res.data) ? "数组" : typeof res.data);
    
    // 检查响应数据格式
    if (Array.isArray(res.data)) {
      setIssues(res.data);
      setError(null);
      return res.data; // 返回数据供调用方使用
    } else {
      console.error("API返回数据格式错误，期望数组但得到:", typeof res.data);
      setIssues([]);
      setError("数据格式错误");
      return [];
    }
  } catch (err) {
    console.error("获取问题列表失败：", err);
    console.error("错误详情:", err.response?.data || err.message);
    console.error("错误状态码:", err.response?.status);
    console.error("请求URL:", err.config?.url);
    setError("加载问题列表失败。请检查后端服务是否运行。");
    return null;
  } finally {
    setLoading(false);
  }
};