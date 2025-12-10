"""
输入验证工具类
用于增强项目的安全性，防止SQL注入和XSS攻击
"""

import re
import html
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class InputValidator:
    """输入验证工具类"""
    
    @staticmethod
    def validate_topic_name(topic_name):
        """验证分类名称"""
        if not topic_name or not topic_name.strip():
            raise ValidationError(_("分类名称不能为空"))
        
        # 限制长度
        if len(topic_name) > 50:
            raise ValidationError(_("分类名称不能超过50个字符"))
        
        # 只允许字母、数字、中文、空格和常见标点
        if not re.match(r'^[\w\u4e00-\u9fa5\s\-_,.()（）\[\]【】]+$', topic_name):
            raise ValidationError(_("分类名称只能包含字母、数字、中文、空格和常见标点符号"))
        
        # HTML转义防护
        safe_topic = html.escape(topic_name.strip())
        
        return safe_topic
    
    @staticmethod
    def validate_title(title):
        """验证问题标题"""
        if not title or not title.strip():
            raise ValidationError(_("标题不能为空"))
        
        # 限制长度
        if len(title) > 50:
            raise ValidationError(_("标题不能超过50个字符"))
        
        # 只允许字母、数字、中文、空格和常见标点
        if not re.match(r'^[\w\u4e00-\u9fa5\s\-_,.!?()（）\[\]【】]+$', title):
            raise ValidationError(_("标题只能包含字母、数字、中文、空格和常见标点符号"))
        
        # HTML转义防护
        safe_title = html.escape(title.strip())
        
        return safe_title
    
    @staticmethod
    def validate_description(description):
        """验证问题描述"""
        if not description or not description.strip():
            raise ValidationError(_("描述不能为空"))
        
        # 限制长度
        if len(description) > 1000:
            raise ValidationError(_("描述不能超过1000个字符"))
        
        # 基本HTML标签过滤
        dangerous_tags = ['<script', '<iframe', '<object', '<embed', '<form', '<input', '<button']
        for tag in dangerous_tags:
            if tag in description.lower():
                raise ValidationError(_("描述中不能包含危险的HTML标签"))
        
        # HTML转义防护
        safe_description = html.escape(description.strip())
        
        return safe_description
    
    @staticmethod
    def validate_content(content):
        """验证评论/回复内容"""
        if not content or not content.strip():
            raise ValidationError(_("内容不能为空"))
        
        # 限制长度
        if len(content) > 1000:
            raise ValidationError(_("内容不能超过1000个字符"))
        
        # 基本HTML标签过滤
        dangerous_tags = ['<script', '<iframe', '<object', '<embed', '<form', '<input', '<button']
        for tag in dangerous_tags:
            if tag in content.lower():
                raise ValidationError(_("内容中不能包含危险的HTML标签"))
        
        # HTML转义防护
        safe_content = html.escape(content.strip())
        
        return safe_content
    
    @staticmethod
    def validate_url_param(param_name, param_value, max_length=50):
        """验证URL参数"""
        if not param_value:
            return None
        
        # 限制长度
        if len(param_value) > max_length:
            raise ValidationError(_("参数 {} 长度不能超过 {} 个字符").format(param_name, max_length))
        
        # 只允许字母、数字、中文和常见标点
        if not re.match(r'^[\w\u4e00-\u9fa5\s\-_,.!?()（）\[\]【】]+$', param_value):
            raise ValidationError(_("参数 {} 包含非法字符").format(param_name))
        
        # HTML转义防护
        safe_param = html.escape(param_value.strip())
        
        return safe_param
    
    @staticmethod
    def sanitize_input(input_text, max_length=1000):
        """通用输入清理函数"""
        if not input_text:
            return ""
        
        # 限制长度
        if len(input_text) > max_length:
            input_text = input_text[:max_length]
        
        # 移除危险HTML标签
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'<iframe[^>]*>.*?</iframe>',
            r'<object[^>]*>.*?</object>',
            r'<embed[^>]*>.*?</embed>',
            r'<form[^>]*>.*?</form>',
            r'<input[^>]*>',
            r'<button[^>]*>.*?</button>'
        ]
        
        for pattern in dangerous_patterns:
            input_text = re.sub(pattern, '', input_text, flags=re.IGNORECASE | re.DOTALL)
        
        # HTML转义
        safe_text = html.escape(input_text.strip())
        
        return safe_text


class SQLInjectionDetector:
    """SQL注入检测器"""
    
    # SQL注入关键词模式 - 改进版本
    SQL_INJECTION_PATTERNS = [
        # SQL关键词
        r'(?i)\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b',
        # UNION攻击
        r'(?i)\b(UNION\s+ALL|UNION\s+SELECT)\b',
        # 注释攻击
        r'(--|#|/\*|\*/)',
        # 逻辑注入
        r'(?i)\b(OR\s+1\s*=\s*1|AND\s+1\s*=\s*1|WHERE\s+1\s*=\s*1)\b',
        # 延时攻击
        r'(?i)\b(WAITFOR\s+DELAY|SLEEP\s*\(|BENCHMARK\s*\(|PG_SLEEP\s*\(|SLEEP\s*\(\s*\d+\s*\))\b',
        # 存储过程
        r'(?i)\b(EXEC\s*\(|EXECUTE\s*\(|sp_|xp_)\b',
        # 函数调用
        r'(?i)\b(CHAR\s*\(|CONCAT\s*\(|SUBSTRING\s*\(|LENGTH\s*\(|DATABASE\s*\(|VERSION\s*\(|USER\s*\(|CURRENT_USER\s*\(|SYSTEM_USER\s*\(|SESSION_USER\s*\(\))\b',
        # 系统表
        r'(?i)\b(INFORMATION_SCHEMA|sys\.|mysql\.|pg_|master\.dbo\.sys)\b',
        # 文件操作
        r'(?i)\b(LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE|LOAD\s+DATA\s+INFILE)\b',
        # 特殊字符
        r'(\'\s*OR\s*\'|\'\s*AND\s*\'|\'\s*UNION\s*\')',
        # 分号注入
        r';\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)',
        # 引号注入
        r'(\'\s*;|\"\s*;|\`\s*;)',
        # 括号注入
        r'\)\s*;|\]\s*;',
    ]
    
    @staticmethod
    def detect_sql_injection(input_text):
        """检测SQL注入攻击"""
        if not input_text:
            return False
        
        input_text = str(input_text)
        
        # 检查常见SQL注入模式
        for pattern in SQLInjectionDetector.SQL_INJECTION_PATTERNS:
            if re.search(pattern, input_text):
                return True
        
        # 检测单引号注入
        if "'" in input_text:
            # 检查单引号后的SQL关键词
            quote_parts = input_text.split("'")
            for i, part in enumerate(quote_parts):
                if i % 2 == 1:  # 单引号内的内容
                    continue
                # 检查单引号外的SQL关键词
                if re.search(r'(?i)\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|UNION)\b', part):
                    return True
        
        # 检测分号分隔的多个SQL语句
        if ';' in input_text:
            statements = input_text.split(';')
            if len(statements) > 1:
                for stmt in statements[1:]:  # 跳过第一个语句
                    if re.search(r'(?i)\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|UNION)\b', stmt.strip()):
                        return True
        
        return False
    
    @staticmethod
    def safe_query_param(param_value):
        """安全处理查询参数"""
        if SQLInjectionDetector.detect_sql_injection(param_value):
            raise ValidationError(_("检测到可能的SQL注入攻击，请检查输入内容"))
        
        return InputValidator.sanitize_input(param_value)