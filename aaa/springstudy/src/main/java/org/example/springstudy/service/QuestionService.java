package org.example.springstudy.service;

import org.example.springstudy.Bean.Question;

import java.util.List;
import java.util.Map;

/**
 * 题目服务接口
 */
public interface QuestionService {
    /**
     * 根据ID获取题目
     */
    Question getQuestionById(Long id);

    /**
     * 根据分类获取题目列表
     */
    List<Question> getQuestionsByCategory(String category);

    /**
     * 根据分类和难度获取题目列表
     */
    List<Question> getQuestionsByCategoryAndDifficulty(String category, String difficulty);

    /**
     * 获取随机题目
     */
    List<Question> getRandomQuestions(String category, int count);

    /**
     * 创建题目（包含选项）
     */
    Map<String, Object> createQuestion(Question question);

    /**
     * 更新题目
     */
    Map<String, Object> updateQuestion(Question question);

    /**
     * 删除题目
     */
    Map<String, Object> deleteQuestion(Long id);

    /**
     * 批量创建题目
     */
    Map<String, Object> batchCreateQuestions(List<Question> questions);

    /**
     * 验证答案
     */
    Map<String, Object> validateAnswer(Long questionId, String selectedOption);
}