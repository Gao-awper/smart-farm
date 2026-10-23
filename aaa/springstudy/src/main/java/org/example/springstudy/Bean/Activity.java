package org.example.springstudy.Bean;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * 农场活动实体类
 */
public class Activity {
    private Long id;
    private Integer farmId; // 关联的农场ID
    private String title; // 活动标题
    private String description; // 活动描述
    private Date startTime; // 活动开始时间
    private Date endTime; // 活动结束时间
    private String location; // 活动地点
    private Integer capacity; // 活动容量
    private Integer registrations; // 已报名人数
    private String status; // 活动状态
    private String image; // 活动图片URL
    private String detail; // 活动详细内容
    private Timestamp createdAt; // 创建时间
    private Timestamp updatedAt; // 更新时间
    
    // 关联的活动亮点
    private List<ActivityHighlight> highlights;
    
    // 关联的活动标签
    private List<ActivityTag> tags;

    // getter and setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getFarmId() {
        return farmId;
    }

    public void setFarmId(Integer farmId) {
        this.farmId = farmId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getRegistrations() {
        return registrations;
    }

    public void setRegistrations(Integer registrations) {
        this.registrations = registrations;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ActivityHighlight> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<ActivityHighlight> highlights) {
        this.highlights = highlights;
    }

    public List<ActivityTag> getTags() {
        return tags;
    }

    public void setTags(List<ActivityTag> tags) {
        this.tags = tags;
    }
}