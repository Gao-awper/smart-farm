package org.example.springstudy.controller;

import org.example.springstudy.Bean.Question;

import org.example.springstudy.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 题目控制器
 */
@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * 获取单个题目
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        if (question != null) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "获取题目成功",
                    "data", question
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "题目不存在"
            ));
        }
    }

    /**
     * 根据分类获取题目列表
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getQuestionsByCategory(@PathVariable String category) {
        List<Question> questions = questionService.getQuestionsByCategory(category);
        boolean isEmpty = questions == null || questions.isEmpty();
        return ResponseEntity.ok(Map.of(
                "success", !isEmpty,
                "message", isEmpty ? "该分类下暂无题目" : "获取题目列表成功",
                "data", questions
        ));
    }

    /**
     * 根据分类和难度获取题目列表
     */
    @GetMapping("/category/{category}/difficulty/{difficulty}")
    public ResponseEntity<Map<String, Object>> getQuestionsByCategoryAndDifficulty(
            @PathVariable String category, 
            @PathVariable String difficulty) {
        List<Question> questions = questionService.getQuestionsByCategoryAndDifficulty(category, difficulty);
        boolean isEmpty = questions == null || questions.isEmpty();
        return ResponseEntity.ok(Map.of(
                "success", !isEmpty,
                "message", isEmpty ? "该分类和难度下暂无题目" : "获取题目列表成功",
                "data", questions
        ));
    }

    /**
     * 获取随机题目
     */
    @GetMapping("/random")
    public ResponseEntity<Map<String, Object>> getRandomQuestions(
            @RequestParam String category, 
            @RequestParam(defaultValue = "10") int count) {
        List<Question> questions = questionService.getRandomQuestions(category, count);
        if (questions == null || questions.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "该分类下暂无题目",
                    "data", questions
            ));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "获取随机题目成功",
                "data", questions
        ));
    }

    /**
     * 创建题目
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuestion(
            @RequestBody Map<String, Object> request) {
        Question question = new Question();
        // 简化的参数绑定，实际项目中建议使用DTO
        question.setType((String) request.get("type"));
        question.setContent((String) request.get("content"));
        question.setCategory((String) request.get("category"));
        question.setDifficulty((String) request.get("difficulty"));
        question.setScore((Integer) request.get("score"));
        question.setOptionA((String) request.get("optionA"));
        question.setOptionB((String) request.get("optionB"));
        question.setOptionC((String) request.get("optionC"));
        question.setOptionD((String) request.get("optionD"));
        question.setCorrectAnswer((String) request.get("correctAnswer"));
        question.setExplain((String) request.get("explain"));

        Map<String, Object> result = questionService.createQuestion(question);
        return ResponseEntity.ok(result);
    }

    /**
     * 更新题目
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateQuestion(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        Question question = new Question();
        question.setId(id);
        question.setType((String) request.get("type"));
        question.setContent((String) request.get("content"));
        question.setCategory((String) request.get("category"));
        question.setDifficulty((String) request.get("difficulty"));
        question.setScore((Integer) request.get("score"));
        question.setOptionA((String) request.get("optionA"));
        question.setOptionB((String) request.get("optionB"));
        question.setOptionC((String) request.get("optionC"));
        question.setOptionD((String) request.get("optionD"));
        question.setCorrectAnswer((String) request.get("correctAnswer"));
        question.setExplain((String) request.get("explain"));

        Map<String, Object> result = questionService.updateQuestion(question);
        return ResponseEntity.ok(result);
    }

    /**
     * 删除题目
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable Long id) {
        Map<String, Object> result = questionService.deleteQuestion(id);
        return ResponseEntity.ok(result);
    }

    /**
     * 验证答案
     */
    @PostMapping("/{id}/validate")
    public ResponseEntity<Map<String, Object>> validateAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        String selectedOption = (String) request.get("selectedOption");
        Map<String, Object> result = questionService.validateAnswer(id, selectedOption);
        return ResponseEntity.ok(result);
    }

    /**
     * 批量创建题目
     */
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> batchCreateQuestions(@RequestBody List<Question> questions) {
        Map<String, Object> result = questionService.batchCreateQuestions(questions);
        return ResponseEntity.ok(result);
    }
}