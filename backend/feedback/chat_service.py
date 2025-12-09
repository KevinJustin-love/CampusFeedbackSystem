"""
智能客服聊天服务
使用 OpenAI API 提供 DoveLink 校园反馈系统的智能客服功能
"""
from openai import OpenAI
from django.conf import settings
from rest_framework.exceptions import ValidationError
from .validation_utils import InputValidator, SQLInjectionDetector
import logging

logger = logging.getLogger(__name__)


class ChatService:
    """智能客服聊天服务类"""
    
    def __init__(self):
        """初始化 OpenAI 客户端"""
        try:
            api_key = settings.OPENAI_API_KEY
            base_url = settings.OPENAI_BASE_URL
            
            if not api_key or api_key == "your_openai_api_key_here":
                logger.error("OPENAI_API_KEY is not set in settings")
                self.client = None
                logger.warning("OpenAI API密钥未配置，智能客服功能将不可用")
            else:
                self.client = OpenAI(
                    api_key=api_key,
                    base_url=base_url,
                    timeout=60.0,  # 设置60秒超时
                    max_retries=2   # 失败后重试2次
                )
                logger.info("ChatService OpenAI client initialized successfully")
                
        except Exception as e:
            logger.error(f"Failed to initialize ChatService OpenAI client: {str(e)}")
            self.client = None
        
        # 定义系统角色 Prompt
        self.system_prompt = (
            "你是 DoveLink 校园反馈系统的智能客服，负责帮助学生与老师解决校园事务相关问题。"
            "你的职责包括：\n"
            "1. 解答关于如何使用 DoveLink 反馈系统的问题\n"
            "2. 帮助用户了解如何提交、查看和管理校园反馈问题\n"
            "3. 解释系统的各项功能，如问题分类、状态追踪、点赞评论等\n"
            "4. 提供友好、专业、温和的服务态度\n"
            "5. 当遇到无法解答的问题时，建议用户联系管理员或提交具体的反馈问题\n\n"
            "关于问题分类，DoveLink 支持五个分类：\n"
            "• 学业：课程、教学、作业考试、学习资源、学术活动等\n"
            "• 生活：住宿、饮食、设施服务、健康安全、文体活动等\n"
            "• 管理：行政服务、规章制度、组织活动、就业服务、财务相关等\n"
            "• 情感：心理健康、人际关系、心理咨询、情绪表达、成长困惑等\n"
            "• 其他：系统建议、未分类问题、综合性问题、特殊情况等\n\n"
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
        # 检查客户端是否已初始化
        if self.client is None:
            logger.warning("ChatService client is None, cannot process request")
            return {
                "success": False,
                "message": "智能客服功能暂未启用，请配置OpenAI API密钥后使用。",
                "error": "OpenAI API密钥未配置"
            }
        
        try:
            # 输入验证
            if not user_message or not user_message.strip():
                return {
                    "success": False,
                    "message": "请输入有效的消息内容。",
                    "error": "消息内容为空"
                }
            
            # 验证消息长度
            if len(user_message) > 1000:
                return {
                    "success": False,
                    "message": "消息内容过长，请控制在1000个字符以内。",
                    "error": "消息内容过长"
                }
            
            # 检测SQL注入
            if SQLInjectionDetector.detect_sql_injection(user_message):
                logger.warning(f"Detected possible SQL injection attempt in chat message: {user_message[:50]}")
                return {
                    "success": False,
                    "message": "检测到不安全的输入内容，请检查后重试。",
                    "error": "SQL注入检测"
                }
            
            # 清理用户输入
            safe_user_message = InputValidator.sanitize_input(user_message, max_length=1000)
            
            # 构建消息列表
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # 添加历史对话（如果有）
            if conversation_history:
                # 验证历史对话格式
                if isinstance(conversation_history, list):
                    for msg in conversation_history:
                        if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                            # 清理历史消息内容
                            safe_content = InputValidator.sanitize_input(msg['content'], max_length=1000)
                            messages.append({
                                "role": msg['role'],
                                "content": safe_content
                            })
            
            # 添加当前用户消息
            messages.append({"role": "user", "content": safe_user_message})
            
            logger.info(f"ChatService preparing API call - messages: {len(messages)}, user_message_length: {len(safe_user_message)}")
            
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
            import traceback
            logger.error(f"ChatService error: {type(e).__name__} - {str(e)}")
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return {
                "success": False,
                "message": "抱歉，智能客服暂时无法响应，请稍后再试或联系管理员。",
                "error": str(e),
                "error_type": type(e).__name__
            }


# 创建单例实例
chat_service = ChatService()
