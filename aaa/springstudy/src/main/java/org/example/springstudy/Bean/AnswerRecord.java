package org.example.springstudy.Bean;

import java.time.LocalDateTime;

/**
 * 答题记录实体类
 */
public class AnswerRecord {
    private Long id; // 记录ID
    private Long userId; // 用户ID
    private String type; // 答题类型：heritage-非遗知识 culture-传统文化 craft-传统技艺
    private LocalDateTime answerTime; // 答题时间
    private int score; // 得分
    private int totalScore; // 总分
    private int duration; // 答题时长（秒）
    private int correctCount; // 正确题数
    private int errorCount; // 错误题数

    // getter和setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getAnswerTime() {
        return answerTime;
    }

    public void setAnswerTime(LocalDateTime answerTime) {
        this.answerTime = answerTime;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(int errorCount) {
        this.errorCount = errorCount;
    }
}