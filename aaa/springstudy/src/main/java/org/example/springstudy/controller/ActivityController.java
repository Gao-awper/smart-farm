package org.example.springstudy.controller;

import org.example.springstudy.Bean.Activity;
import org.example.springstudy.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 农场活动Controller
 */
@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);

    @Autowired
    private ActivityService activityService;

    /**
     * 获取所有活动列表
     * @return 活动列表
     */
    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        logger.info("获取所有活动列表");
        List<Activity> activities = activityService.getAllActivities();
        logger.info("成功获取{}个活动", activities.size());
        return ResponseEntity.ok(activities);
    }

    /**
     * 根据ID获取活动详情
     * @param id 活动ID
     * @return 活动详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        logger.info("根据ID获取活动详情，ID: {}", id);
        Activity activity = activityService.getActivityById(id);
        if (activity == null) {
            logger.warn("活动不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("成功获取活动详情，ID: {}", id);
        return ResponseEntity.ok(activity);
    }

    /**
     * 创建活动（管理员功能）
     * @param activity 活动对象
     * @return 创建的活动
     */
    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        logger.info("创建活动，标题: {}", activity.getTitle());
        Long activityId = activityService.createActivity(activity);
        Activity createdActivity = activityService.getActivityById(activityId);
        logger.info("成功创建活动，ID: {}", activityId);
        return ResponseEntity.ok(createdActivity);
    }

    /**
     * 更新活动（管理员功能）
     * @param id 活动ID
     * @param activity 活动对象
     * @return 更新后的活动
     */
    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        logger.info("更新活动，ID: {}", id);
        activity.setId(id);
        boolean updated = activityService.updateActivity(activity);
        if (!updated) {
            logger.warn("活动不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        Activity updatedActivity = activityService.getActivityById(id);
        logger.info("成功更新活动，ID: {}", id);
        return ResponseEntity.ok(updatedActivity);
    }

    /**
     * 删除活动（管理员功能）
     * @param id 活动ID
     * @return 是否删除成功
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        logger.info("删除活动，ID: {}", id);
        boolean deleted = activityService.deleteActivity(id);
        if (!deleted) {
            logger.warn("活动不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("成功删除活动，ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 用户报名活动
     * @param id 活动ID
     * @param userId 用户ID
     * @return 报名结果
     */
    @PostMapping("/{id}/register")
    public ResponseEntity<String> registerActivity(@PathVariable Long id, @RequestParam Long userId) {
        logger.info("用户报名活动，活动ID: {}, 用户ID: {}", id, userId);
        boolean registered = activityService.registerActivity(id, userId);
        if (registered) {
            logger.info("用户报名成功，活动ID: {}, 用户ID: {}", id, userId);
            return ResponseEntity.ok("报名成功");
        } else {
            logger.warn("用户报名失败，活动ID: {}, 用户ID: {}", id, userId);
            return ResponseEntity.badRequest().body("您已报名该活动或活动不存在");
        }
    }

    /**
     * 用户取消活动报名
     * @param id 活动ID
     * @param userId 用户ID
     * @return 取消结果
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelRegistration(@PathVariable Long id, @RequestParam Long userId) {
        logger.info("用户取消活动报名，活动ID: {}, 用户ID: {}", id, userId);
        boolean canceled = activityService.cancelRegistration(id, userId);
        if (canceled) {
            logger.info("用户取消报名成功，活动ID: {}, 用户ID: {}", id, userId);
            return ResponseEntity.ok("取消报名成功");
        } else {
            logger.warn("用户取消报名失败，活动ID: {}, 用户ID: {}", id, userId);
            return ResponseEntity.badRequest().body("您未报名该活动或活动不存在");
        }
    }

    /**
     * 检查用户是否已报名活动
     * @param id 活动ID
     * @param userId 用户ID
     * @return 是否已报名
     */
    @GetMapping("/{id}/isRegistered")
    public ResponseEntity<Boolean> isUserRegistered(@PathVariable Long id, @RequestParam Long userId) {
        logger.info("检查用户是否已报名活动，活动ID: {}, 用户ID: {}", id, userId);
        boolean isRegistered = activityService.isUserRegistered(id, userId);
        logger.info("用户报名状态查询结果，活动ID: {}, 用户ID: {}, 已报名: {}", id, userId, isRegistered);
        return ResponseEntity.ok(isRegistered);
    }
    
    /**
     * 获取用户已报名的活动列表
     * @param userId 用户ID
     * @return 用户已报名的活动列表
     */
    @GetMapping("/user/activities")
    public ResponseEntity<List<Activity>> getUserRegisteredActivities(@RequestParam Long userId) {
        logger.info("获取用户已报名活动，用户ID: {}", userId);
        List<Activity> activities = activityService.getUserRegisteredActivities(userId);
        logger.info("成功获取{}个已报名活动", activities.size());
        return ResponseEntity.ok(activities);
    }

    /**
     * 搜索活动
     * @param keyword 搜索关键词
     * @return 搜索结果
     */
    @GetMapping("/search")
    public ResponseEntity<List<Activity>> searchActivities(@RequestParam String keyword) {
        logger.info("搜索活动，关键词: {}", keyword);
        List<Activity> activities = activityService.searchActivities(keyword);
        logger.info("搜索到{}个活动", activities.size());
        return ResponseEntity.ok(activities);
    }
}