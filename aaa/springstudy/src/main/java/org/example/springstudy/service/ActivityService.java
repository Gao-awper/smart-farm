package org.example.springstudy.service;

import org.example.springstudy.Bean.Activity;

import java.util.List;

/**
 * 农场活动Service接口
 */
public interface ActivityService {

    /**
     * 获取所有活动列表
     * @return 活动列表
     */
    List<Activity> getAllActivities();

    /**
     * 根据ID获取活动详情
     * @param id 活动ID
     * @return 活动详情
     */
    Activity getActivityById(Long id);

    /**
     * 创建活动
     * @param activity 活动对象
     * @return 活动ID
     */
    Long createActivity(Activity activity);

    /**
     * 更新活动
     * @param activity 活动对象
     * @return 是否更新成功
     */
    boolean updateActivity(Activity activity);

    /**
     * 删除活动
     * @param id 活动ID
     * @return 是否删除成功
     */
    boolean deleteActivity(Long id);

    /**
     * 用户报名活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否报名成功
     */
    boolean registerActivity(Long activityId, Long userId);

    /**
     * 用户取消活动报名
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否取消成功
     */
    boolean cancelRegistration(Long activityId, Long userId);

    /**
     * 检查用户是否已报名活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否已报名
     */
    boolean isUserRegistered(Long activityId, Long userId);
    
    /**
     * 获取用户已报名的活动列表
     * @param userId 用户ID
     * @return 已报名的活动列表
     */
    List<Activity> getUserRegisteredActivities(Long userId);

    /**
     * 搜索活动
     * @param keyword 搜索关键词
     * @return 搜索结果
     */
    List<Activity> searchActivities(String keyword);
}