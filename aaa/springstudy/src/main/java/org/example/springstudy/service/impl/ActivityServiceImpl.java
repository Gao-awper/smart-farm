package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Activity;
import org.example.springstudy.Bean.ActivityRegistration;
import org.example.springstudy.Mapper.ActivityMapper;
import org.example.springstudy.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 农场活动Service实现类
 */
@Service
public class ActivityServiceImpl implements ActivityService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);

    @Autowired
    private ActivityMapper activityMapper;

    /**
     * 获取所有活动列表
     * @return 活动列表
     */
    @Override
    public List<Activity> getAllActivities() {
        logger.info("查询所有活动列表");
        List<Activity> activities = activityMapper.selectAll();
        logger.info("成功查询到{}个活动", activities.size());
        return activities;
    }

    /**
     * 根据ID获取活动详情
     * @param id 活动ID
     * @return 活动详情
     */
    @Override
    public Activity getActivityById(Long id) {
        logger.info("根据ID查询活动详情，ID: {}", id);
        Activity activity = activityMapper.selectById(id);
        if (activity != null) {
            logger.info("成功查询到活动，标题: {}", activity.getTitle());
        } else {
            logger.warn("未查询到活动，ID: {}", id);
        }
        return activity;
    }

    /**
     * 创建活动
     * @param activity 活动对象
     * @return 活动ID
     */
    @Override
    public Long createActivity(Activity activity) {
        logger.info("创建活动，标题: {}", activity.getTitle());
        activityMapper.insertActivity(activity);
        logger.info("成功创建活动，ID: {}", activity.getId());
        return activity.getId();
    }

    /**
     * 更新活动
     * @param activity 活动对象
     * @return 是否更新成功
     */
    @Override
    public boolean updateActivity(Activity activity) {
        logger.info("更新活动，ID: {}, 标题: {}", activity.getId(), activity.getTitle());
        int result = activityMapper.updateActivity(activity);
        boolean success = result > 0;
        logger.info("更新活动结果，ID: {}, 成功: {}", activity.getId(), success);
        return success;
    }

    /**
     * 删除活动
     * @param id 活动ID
     * @return 是否删除成功
     */
    @Override
    public boolean deleteActivity(Long id) {
        logger.info("删除活动，ID: {}", id);
        int result = activityMapper.deleteActivity(id);
        boolean success = result > 0;
        logger.info("删除活动结果，ID: {}, 成功: {}", id, success);
        return success;
    }

    /**
     * 用户报名活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否报名成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean registerActivity(Long activityId, Long userId) {
        logger.info("用户报名活动，活动ID: {}, 用户ID: {}", activityId, userId);
        
        // 检查是否已报名
        if (isUserRegistered(activityId, userId)) {
            logger.warn("用户已报名该活动，活动ID: {}, 用户ID: {}", activityId, userId);
            return false;
        }

        // 创建报名记录
        ActivityRegistration registration = new ActivityRegistration();
        registration.setActivityId(activityId);
        registration.setUserId(userId);
        
        // 执行报名操作
        activityMapper.registerActivity(registration);
        
        // 更新活动已报名人数
        activityMapper.updateActivityRegistrations(activityId, 1);
        
        logger.info("用户报名成功，活动ID: {}, 用户ID: {}", activityId, userId);
        return true;
    }

    /**
     * 用户取消活动报名
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否取消成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelRegistration(Long activityId, Long userId) {
        logger.info("用户取消活动报名，活动ID: {}, 用户ID: {}", activityId, userId);
        
        // 检查是否已报名
        if (!isUserRegistered(activityId, userId)) {
            logger.warn("用户未报名该活动，活动ID: {}, 用户ID: {}", activityId, userId);
            return false;
        }

        // 取消报名
        activityMapper.cancelRegistration(activityId, userId);
        
        // 更新活动已报名人数
        activityMapper.updateActivityRegistrations(activityId, -1);
        
        logger.info("用户取消报名成功，活动ID: {}, 用户ID: {}", activityId, userId);
        return true;
    }

    /**
     * 检查用户是否已报名活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 是否已报名
     */
    @Override
    public boolean isUserRegistered(Long activityId, Long userId) {
        logger.info("检查用户是否已报名活动，活动ID: {}, 用户ID: {}", activityId, userId);
        ActivityRegistration registration = activityMapper.selectRegistrationByActivityIdAndUserId(activityId, userId);
        boolean isRegistered = registration != null && registration.getStatus() == 1;
        logger.info("用户报名状态，活动ID: {}, 用户ID: {}, 已报名: {}", activityId, userId, isRegistered);
        return isRegistered;
    }
    
    /**
     * 获取用户已报名的活动列表
     * @param userId 用户ID
     * @return 已报名的活动列表
     */
    @Override
    public List<Activity> getUserRegisteredActivities(Long userId) {
        logger.info("获取用户已报名活动，用户ID: {}", userId);
        List<Activity> activities = activityMapper.selectActivitiesByUserId(userId);
        logger.info("成功获取{}个已报名活动", activities.size());
        return activities;
    }

    /**
     * 搜索活动
     * @param keyword 搜索关键词
     * @return 搜索结果
     */
    @Override
    public List<Activity> searchActivities(String keyword) {
        logger.info("搜索活动，关键词: {}", keyword);
        List<Activity> activities = activityMapper.searchActivities(keyword);
        logger.info("搜索到{}个活动", activities.size());
        return activities;
    }
}