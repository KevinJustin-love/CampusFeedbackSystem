import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../../constants";

// 检查用户登录状态的函数
export const checkUserAuth = (setIsLoading, setUser) => {
    console.log("检查登录状态开始");
    setIsLoading(true);

    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("Token:", token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("解码后的token:", decodedToken);
        // 提取用户信息
        const username = decodedToken.username || `user_${decodedToken.user_id}`;
        const role = decodedToken.role || "student";
        const id = decodedToken.user_id; // 从token中获取用户ID
        setUser({ id, username, role }); // 包含id字段
        console.log("设置用户:", { username, role });
      } catch (error) {
        console.error("无效的令牌:", error);
        localStorage.removeItem(ACCESS_TOKEN);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
    console.log("检查登录状态完成");
  };