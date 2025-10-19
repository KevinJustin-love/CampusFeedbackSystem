"""
智能客服聊天服务
使用 OpenAI API 提供 DoveLink 校园反馈系统的智能客服功能
"""
from openai import OpenAI
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ChatService:
    """智能客服聊天服务类"""
    
    def __init__(self):
        """初始化 OpenAI 客户端"""
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )
        
        # 定义系统角色 Prompt
        self.system_prompt = (
            "你是 DoveLink 校园反馈系统的智能客服，负责帮助学生与老师解决校园事务相关问题。"
            "你的职责包括：\n"
            "1. 解答关于如何使用 DoveLink 反馈系统的问题\n"
            "2. 帮助用户了解如何提交、查看和管理校园反馈问题\n"
            "3. 解释系统的各项功能，如问题分类、状态追踪、点赞评论等\n"
            "4. 提供友好、专业、温和的服务态度\n"
            "5. 当遇到无法解答的问题时，建议用户联系管理员或提交具体的反馈问题\n\n"
            "请用简洁、清晰的语言回答问题，必要时可以分点说明。"
        )
    
    def get_response(self, user_message: str, conversation_history: list = None) -> dict:
        """
        获取 AI 客服回复
        
        Args:
            user_message: 用户输入的消息
            conversation_history: 对话历史（可选），格式为 [{"role": "user/assistant", "content": "..."}]
        
        Returns:
            dict: 包含回复内容和状态的字典
        """
        try:
            # 构建消息列表
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # 添加历史对话（如果有）
            if conversation_history:
                messages.extend(conversation_history)
            
            # 添加当前用户消息
            messages.append({"role": "user", "content": user_message})
            
            # 调用 OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # 可以根据需要更改模型
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            # 提取回复内容
            assistant_message = response.choices[0].message.content
            
            return {
                "success": True,
                "message": assistant_message,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
            
        except Exception as e:
            logger.error(f"ChatService error: {str(e)}")
            return {
                "success": False,
                "message": "抱歉，智能客服暂时无法响应，请稍后再试或联系管理员。",
                "error": str(e)
            }


# 创建单例实例
chat_service = ChatService()
