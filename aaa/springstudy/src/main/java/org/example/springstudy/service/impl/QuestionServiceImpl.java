package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Question;
import org.example.springstudy.Bean.QuestionOption;
import org.example.springstudy.Mapper.QuestionMapper;
import org.example.springstudy.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 题目服务实现类
 */
@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionMapper questionMapper;

    @Override
    public Question getQuestionById(Long id) {
        return questionMapper.selectById(id);
    }

    @Override
    public List<Question> getQuestionsByCategory(String category) {
        List<Question> questions = questionMapper.selectByCategory(category);
        return questions == null ? new ArrayList<>() : questions;
    }

    @Override
    public List<Question> getQuestionsByCategoryAndDifficulty(String category, String difficulty) {
        List<Question> questions = questionMapper.selectByCategoryAndDifficulty(category, difficulty);
        return questions == null ? new ArrayList<>() : questions;
    }

    @Override
    public List<Question> getRandomQuestions(String category, int count) {
        List<Question> questions = questionMapper.selectRandomQuestions(category, count);
        return questions == null ? new ArrayList<>() : questions;
    }

    @Transactional
    @Override
    public Map<String, Object> createQuestion(Question question) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 设置默认值
            question.setIsDeleted(0);
            question.setCreatedAt(LocalDateTime.now());
            question.setUpdatedAt(LocalDateTime.now());

            // 插入题目
            questionMapper.insert(question);
            
            result.put("code", 200);
            result.put("message", "题目创建成功");
            result.put("questionId", question.getId());
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "题目创建失败: " + e.getMessage());
            // 记录异常日志
            e.printStackTrace();
        }
        return result;
    }

    @Transactional
    @Override
    public Map<String, Object> updateQuestion(Question question) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 更新题目信息
            question.setUpdatedAt(LocalDateTime.now());
            questionMapper.update(question);
            
            result.put("code", 200);
            result.put("message", "题目更新成功");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "题目更新失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Transactional
    @Override
    public Map<String, Object> deleteQuestion(Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 删除题目（选项在同一张表，会自动删除）
            questionMapper.delete(id);

            result.put("success", true);
            result.put("message", "题目删除成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "题目删除失败: " + e.getMessage());
            throw new RuntimeException(e);
        }
        return result;
    }

    @Transactional
    @Override
    public Map<String, Object> batchCreateQuestions(List<Question> questions) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 设置默认值
            for (Question question : questions) {
                question.setIsDeleted(0);
                question.setCreatedAt(LocalDateTime.now());
                question.setUpdatedAt(LocalDateTime.now());
            }
            
            // 批量插入题目
            questionMapper.batchInsert(questions);
            
            result.put("code", 200);
            result.put("message", "批量创建题目成功");
            result.put("count", questions.size());
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "批量创建题目失败: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public Map<String, Object> validateAnswer(Long questionId, String selectedOption) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 获取题目信息
            Question question = questionMapper.selectById(questionId);
            if (question == null) {
                result.put("success", false);
                result.put("message", "题目不存在");
                return result;
            }

            // 获取正确答案
            String correctAnswer = question.getCorrectAnswer();

            // 验证答案（忽略大小写）
            boolean isCorrect = correctAnswer.equalsIgnoreCase(selectedOption);

            result.put("success", true);
            result.put("isCorrect", isCorrect);
            result.put("correctAnswer", correctAnswer);
            result.put("explain", question.getExplain());
            result.put("score", isCorrect ? question.getScore() : 0);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "答案验证失败: " + e.getMessage());
        }
        return result;
    }
}