package org.example.springstudy.Bean;

import java.sql.Timestamp;

/**
 * 活动报名实体类
 */
public class ActivityRegistration {
    private Long id; // 报名ID
    private Long activityId; // 关联的活动ID
    private Long userId; // 报名用户ID
    private Timestamp registrationTime; // 报名时间
    private Integer status; // 报名状态：1-已报名，2-已取消，3-已参加

    // getter and setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Timestamp getRegistrationTime() {
        return registrationTime;
    }

    public void setRegistrationTime(Timestamp registrationTime) {
        this.registrationTime = registrationTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}