package org.example.springstudy.Bean;

import java.sql.Timestamp;

/**
 * 活动标签实体类
 */
public class ActivityTag {
    private Integer id; // 标签ID
    private String name; // 标签名称
    private Timestamp createdAt; // 创建时间

    // getter and setter methods
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}