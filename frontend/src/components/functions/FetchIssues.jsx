import { feedbackAPI } from "../../api";

export const fetchIssues = async (setLoading, setIssues, setError) => {
    try {
      setLoading(true);
      const res = await feedbackAPI.getIssueList();
      console.log("API 响应数据:", res.data);
      setIssues(res.data);
      setError(null);
    } catch (err) {
      console.error("获取问题列表失败：", err);
      setError("加载问题列表失败。请稍后重试。");
    } finally {
      setLoading(false);
    }
  };