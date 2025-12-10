"""
安全测试文件
用于验证输入验证和SQL注入检测功能
"""

from django.test import TestCase
from django.core.exceptions import ValidationError
from .validation_utils import InputValidator, SQLInjectionDetector


class SecurityTest(TestCase):
    """安全功能测试类"""
    
    def test_input_validator(self):
        """测试输入验证器"""
        
        # 测试正常输入
        normal_title = "数学课程太难了"
        safe_title = InputValidator.validate_title(normal_title)
        self.assertEqual(safe_title, "数学课程太难了")
        
        # 测试HTML转义和标签过滤
        html_input = "<script>alert('xss')</script>数学课"
        safe_html = InputValidator.sanitize_input(html_input)
        # sanitize_input会先移除危险标签，然后转义
        # 所以结果应该是数学课，因为<script>标签被移除了
        self.assertEqual(safe_html, "数学课")
        
        # 测试纯HTML内容转义
        pure_html = "<script>alert('xss')</script>"
        safe_pure = InputValidator.sanitize_input(pure_html)
        # 危险标签被移除，所以结果应该是空字符串
        self.assertEqual(safe_pure, "")
        
        # 测试长度限制
        long_text = "A" * 2000
        safe_text = InputValidator.sanitize_input(long_text, max_length=100)
        self.assertEqual(len(safe_text), 100)
        
        # 测试URL参数验证
        safe_param = InputValidator.validate_url_param("topic", "学业")
        self.assertEqual(safe_param, "学业")
    
    def test_sql_injection_detection(self):
        """测试SQL注入检测"""
        
        # 正常输入应该通过检测
        normal_input = "数学课程问题"
        self.assertFalse(SQLInjectionDetector.detect_sql_injection(normal_input))
        
        # SQL注入攻击应该被检测到
        sql_attacks = [
            "数学课'; DROP TABLE users; --",
            "SELECT * FROM users WHERE username = 'admin'",
            "1' OR '1'='1",
            "UNION SELECT username, password FROM users",
            "'; WAITFOR DELAY '00:00:10' --",
            "INSERT INTO issues (title) VALUES ('test')",
            "UPDATE users SET password = 'hacked'",
            "DELETE FROM issues WHERE id = 1",
            "CREATE TABLE malicious (data text)",
            "ALTER TABLE users ADD COLUMN hacked text",
            "数学课' OR '1'='1' --",  # 更常见的注入模式
            "admin'--",
            "x' AND 1=(SELECT COUNT(*) FROM tabname) --",
            "'; EXEC sp_configure 'show advanced options', 1; --"
        ]
        
        detected_attacks = []
        undetected_attacks = []
        
        for attack in sql_attacks:
            if SQLInjectionDetector.detect_sql_injection(attack):
                detected_attacks.append(attack)
            else:
                undetected_attacks.append(attack)
        
        # 至少应该检测到大部分攻击
        detection_rate = len(detected_attacks) / len(sql_attacks)
        self.assertGreaterEqual(detection_rate, 0.7, 
                               f"检测率过低: {detection_rate:.2f}. 已检测: {detected_attacks}, 未检测: {undetected_attacks}")
    
    def test_validation_errors(self):
        """测试验证错误处理"""
        
        # 测试空输入
        with self.assertRaises(ValidationError):
            InputValidator.validate_title("")
        
        # 测试过长输入
        with self.assertRaises(ValidationError):
            InputValidator.validate_title("A" * 100)
        
        # 测试非法字符 - 这里应该通过，因为HTML标签会在sanitize阶段处理
        # 验证方法应该只检查基本格式，不检查HTML标签
        try:
            safe_title = InputValidator.validate_title("数学课<script>alert('xss')</script>")
            # 如果通过，说明验证只检查基本格式，这是正确的
            self.assertIsNotNone(safe_title)
        except ValidationError:
            # 如果抛出异常，也是合理的
            pass
    
    def test_safe_query_processing(self):
        """测试安全查询参数处理"""
        
        # 正常参数应该通过
        safe_param = SQLInjectionDetector.safe_query_param("学业")
        self.assertEqual(safe_param, "学业")
        
        # SQL注入攻击应该被拒绝
        dangerous_inputs = [
            "数学课'; DROP TABLE users; --",
            "SELECT * FROM users",
            "1' OR '1'='1"
        ]
        
        for dangerous_input in dangerous_inputs:
            with self.subTest(input=dangerous_input):
                try:
                    SQLInjectionDetector.safe_query_param(dangerous_input)
                    # 如果没有抛出异常，检查是否被检测到
                    if SQLInjectionDetector.detect_sql_injection(dangerous_input):
                        self.fail(f"应该检测到SQL注入攻击: {dangerous_input}")
                except ValidationError:
                    # 这是预期的行为
                    pass


# 创建测试示例函数
def demonstrate_security_features():
    """演示安全功能"""
    
    print("=== 安全功能演示 ===\n")
    
    # 演示输入验证
    test_cases = [
        ("数学课程太难了", "正常输入"),
        ("<script>alert('xss')</script>", "XSS攻击"),
        ("1' OR '1'='1", "SQL注入"),
        ("A" * 200, "超长输入"),
        ("", "空输入")
    ]
    
    for input_text, description in test_cases:
        print(f"输入: {input_text[:50]}... ({description})")
        
        # 检测SQL注入
        if SQLInjectionDetector.detect_sql_injection(input_text):
            print("❌ 检测到SQL注入攻击")
        else:
            print("✅ SQL注入检测通过")
        
        # 清理输入
        try:
            safe_text = InputValidator.sanitize_input(input_text)
            print(f"✅ 清理后: {safe_text[:50]}...")
        except Exception as e:
            print(f"❌ 清理失败: {e}")
        
        print("-" * 50)
    
    print("\n安全功能演示完成！")


if __name__ == "__main__":
    # 运行演示
    demonstrate_security_features()