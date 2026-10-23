package org.example.springstudy.Bean;

import java.sql.Timestamp;

/**
 * 活动亮点实体类
 */
public class ActivityHighlight {
    private Integer id; // 亮点ID
    private Long activityId; // 关联的活动ID
    private String content; // 亮点内容
    private Timestamp createdAt; // 创建时间

    // getter and setter methods
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}