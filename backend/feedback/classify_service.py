"""
智能问题分类服务
使用 OpenAI API 自动分类校园反馈问题
"""
from openai import OpenAI
from django.conf import settings
from rest_framework.exceptions import ValidationError
from .validation_utils import InputValidator, SQLInjectionDetector
import logging
import json

logger = logging.getLogger(__name__)


class ClassifyService:
    """智能问题分类服务类"""
    
    def __init__(self):
        """初始化 OpenAI 客户端"""
        try:
            api_key = settings.OPENAI_API_KEY
            base_url = settings.OPENAI_BASE_URL
            
            if not api_key:
                logger.error("OPENAI_API_KEY is not set in settings")
                raise ValueError("OPENAI_API_KEY is missing")
            
            self.client = OpenAI(
                api_key=api_key,
                base_url=base_url,
                timeout=60.0,  # 设置60秒超时
                max_retries=2   # 失败后重试2次
            )
            logger.info("OpenAI client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {str(e)}")
            raise
        
        # 定义分类系统 Prompt
        self.system_prompt = (
            "你是 DoveLink 校园反馈系统的智能分类助手。你需要将学生的问题精准分类到以下五个类别之一：\n\n"
            "**【学业】分类标准：**\n"
            "- 课程相关：课程难度、课程内容、教学方法、课程安排\n"
            "- 教师相关：授课质量、教师态度、答疑解惑\n"
            "- 作业考试：作业量、作业难度、考试安排、成绩问题\n"
            "- 学习资源：图书馆、实验室、学习空间、教材资料\n"
            "- 学术活动：讲座、科研、竞赛、学术交流\n"
            "示例：数学分析课程很难、图书馆座位不够、实验室设备故障、考试时间冲突\n\n"
            
            "**【生活】分类标准：**\n"
            "- 住宿相关：宿舍环境、宿舍设施、住宿管理\n"
            "- 饮食相关：食堂餐饮、饭菜质量、食品安全\n"
            "- 设施服务：校园设施、维修保洁、水电网络\n"
            "- 健康安全：校医院、校园安全、交通出行\n"
            "- 文体活动：体育设施、文娱活动、社团生活（非官方）\n"
            "示例：宿舍热水供应不足、食堂饭菜不好吃、健身房设备少、校园路灯太暗\n\n"
            
            "**【管理】分类标准：**\n"
            "- 行政服务：办事流程、证明办理、政策咨询\n"
            "- 规章制度：校规校纪、管理规定、制度建议\n"
            "- 组织活动：学生会、官方社团、集体活动组织\n"
            "- 就业服务：就业指导、招聘信息、实习安排\n"
            "- 财务相关：学费、奖学金、补助、收费问题\n"
            "示例：学生证办理太慢、奖学金评定不公平、就业指导课程少、校园卡充值不方便\n\n"
            
            "**【情感】分类标准：**\n"
            "- 心理健康：心理困扰、情绪问题、压力焦虑\n"
            "- 人际关系：同学关系、师生关系、恋爱感情\n"
            "- 心理咨询：心理援助、情感支持、心理辅导\n"
            "- 情绪表达：倾诉烦恼、寻求安慰、情感释放\n"
            "- 成长困惑：自我认知、人生迷茫、发展规划\n"
            "示例：感到很焦虑压力大、和室友关系不好、失恋很难过、不知道未来方向\n\n"
            
            "**【其他】分类标准：**\n"
            "- 系统建议：对校园反馈系统本身的建议\n"
            "- 未分类问题：无法明确归入以上四类的问题\n"
            "- 综合性问题：涉及多个领域难以单一分类的复杂问题\n"
            "- 特殊情况：临时性、突发性、特殊性质的问题\n"
            "示例：希望增加新功能、这个问题比较复杂、建议改进系统\n\n"
            
            "**分类原则：**\n"
            "1. 优先根据问题的核心主题分类\n"
            "2. 课程、教学、学习相关 → 学业\n"
            "3. 衣食住行、生活设施 → 生活\n"
            "4. 行政流程、制度政策 → 管理\n"
            "5. 心理情感、人际关系 → 情感\n"
            "6. 无法明确分类或系统建议 → 其他\n"
            "7. 存在交叉时选择最主要的方面\n\n"
            
            "请返回严格的 JSON 格式：\n"
            "{\"category\": \"学业\", \"confidence\": 0.95, \"reason\": \"涉及课程难度问题\"}\n"
            "- category 只能是：学业、生活、管理、情感、其他\n"
            "- confidence 是 0.0-1.0 的数字\n"
            "- reason 用简短一句话说明分类依据"
        )
    
    def classify_issue(self, title: str, description: str = "") -> dict:
        """
        智能分类问题
        
        Args:
            title: 问题标题
            description: 问题描述（可选）
        
        Returns:
            dict: 包含分类结果的字典
            {
                "success": True/False,
                "category": "学业/生活/管理",
                "confidence": 0.0-1.0,
                "reason": "分类理由"
            }
        """
        try:
            # 输入验证
            if not title or not title.strip():
                return {
                    "success": False,
                    "category": "其他",
                    "confidence": 0.0,
                    "reason": "标题不能为空",
                    "error": "标题为空"
                }
            
            # 验证标题长度
            if len(title) > 100:
                return {
                    "success": False,
                    "category": "其他",
                    "confidence": 0.0,
                    "reason": "标题过长，请控制在100个字符以内",
                    "error": "标题过长"
                }
            
            # 验证描述长度
            if description and len(description) > 500:
                description = description[:500]
            
            # 检测SQL注入
            if SQLInjectionDetector.detect_sql_injection(title) or SQLInjectionDetector.detect_sql_injection(description):
                logger.warning(f"Detected possible SQL injection attempt in classification request: {title[:50]}")
                return {
                    "success": False,
                    "category": "其他",
                    "confidence": 0.0,
                    "reason": "检测到不安全的输入内容",
                    "error": "SQL注入检测"
                }
            
            # 清理输入内容
            safe_title = InputValidator.sanitize_input(title, max_length=100)
            safe_description = InputValidator.sanitize_input(description, max_length=500) if description else ""
            
            # 构建用户消息
            user_message = f"问题标题：{safe_title}\n"
            if safe_description:
                user_message += f"问题描述：{safe_description}"
            
            # 调用 OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.1,  # 更低的温度以获得更稳定和准确的分类结果
                max_tokens=200,
                response_format={"type": "json_object"}  # 强制返回 JSON
            )
            
            # 解析 AI 返回的 JSON
            result = json.loads(response.choices[0].message.content)
            
            # 验证分类是否有效
            valid_categories = ["学业", "生活", "管理", "情感", "其他"]
            category = result.get("category", "")
            
            if category not in valid_categories:
                logger.warning(f"Invalid category '{category}' returned for title '{safe_title}', using fallback logic")
                # 使用关键词回退策略
                category = self._fallback_classify(safe_title, safe_description)
            
            confidence = result.get("confidence", 0.5)
            reason = result.get("reason", "根据内容分析得出")
            
            logger.info(f"Classified '{safe_title}' as '{category}' with confidence {confidence}")
            
            return {
                "success": True,
                "category": category,
                "confidence": confidence,
                "reason": reason,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in classify_issue: {str(e)}")
            # 使用关键词回退策略
            category = self._fallback_classify(title, description)
            return {
                "success": False,
                "category": category,
                "confidence": 0.3,
                "reason": "AI分类失败，使用关键词匹配",
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"ClassifyService error: {type(e).__name__} - {str(e)}")
            
            # 使用关键词回退策略
            category = self._fallback_classify(title, description)
            return {
                "success": False,
                "category": category,
                "confidence": 0.3,
                "reason": f"分类服务异常，使用关键词匹配",
                "error": str(e)
            }
    
    def _fallback_classify(self, title: str, description: str = "") -> str:
        """
        关键词回退分类策略
        当 AI 分类失败时使用
        """
        text = (title + " " + description).lower()
        
        # 学业关键词
        academic_keywords = [
            "课程", "作业", "考试", "教学", "教师", "老师", "成绩", "图书馆",
            "实验室", "教材", "学习", "复习", "考研", "讲座", "选课", "学分",
            "数学", "英语", "物理", "化学", "计算机", "专业课", "公共课"
        ]
        
        # 生活关键词
        life_keywords = [
            "宿舍", "食堂", "饭", "菜", "餐", "热水", "洗澡", "洗衣", "空调",
            "网络", "wifi", "水电", "维修", "卫生", "校医", "体育", "健身",
            "运动", "安全", "门禁", "路灯", "交通", "公交", "食品"
        ]
        
        # 管理关键词
        management_keywords = [
            "学生证", "证明", "办理", "流程", "学生会", "奖学金", "补助",
            "收费", "缴费", "就业", "招聘", "实习", "政策", "规定", "制度",
            "活动组织", "校园卡", "充值", "报销", "申请"
        ]
        
        # 情感关键词
        emotion_keywords = [
            "焦虑", "压力", "抑郁", "烦恼", "困扰", "迷茫", "孤独", "难过",
            "伤心", "失恋", "恋爱", "感情", "心理", "情绪", "人际关系",
            "室友关系", "同学关系", "师生关系", "心理咨询", "倾诉", "安慰",
            "成长", "自我", "未来", "方向", "人生", "困惑"
        ]
        
        # 其他关键词
        other_keywords = [
            "系统", "功能", "建议", "改进", "优化", "反馈系统", "平台",
            "界面", "操作", "使用体验", "技术问题", "bug", "故障",
            "不确定", "复杂", "综合", "多方面", "特殊情况"
        ]
        
        # 统计关键词匹配数
        academic_count = sum(1 for kw in academic_keywords if kw in text)
        life_count = sum(1 for kw in life_keywords if kw in text)
        management_count = sum(1 for kw in management_keywords if kw in text)
        emotion_count = sum(1 for kw in emotion_keywords if kw in text)
        other_count = sum(1 for kw in other_keywords if kw in text)
        
        # 返回匹配最多的分类
        counts = {
            "学业": academic_count,
            "生活": life_count,
            "管理": management_count,
            "情感": emotion_count,
            "其他": other_count
        }
        
        max_count = max(counts.values())
        
        if max_count == 0:
            return "其他"  # 默认分类改为其他
        
        # 返回第一个匹配数最多的分类
        for category, count in counts.items():
            if count == max_count:
                return category
        
        # 如果没有匹配，返回默认分类
        return "其他"


# 创建单例实例
classify_service = ClassifyService()
