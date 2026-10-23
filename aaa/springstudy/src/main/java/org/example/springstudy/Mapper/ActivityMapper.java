package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springstudy.Bean.Activity;
import org.example.springstudy.Bean.ActivityHighlight;
import org.example.springstudy.Bean.ActivityRegistration;
import org.example.springstudy.Bean.ActivityTag;

import java.util.List;

/**
 * 农场活动Mapper接口
 */
@Mapper
public interface ActivityMapper {

    /**
     * 查询所有活动
     * @return 活动列表
     * @see ActivityServiceImpl#getAllActivities() 查看业务层实现和日志记录
     */
    List<Activity> selectAll();

    /**
     * 根据ID查询活动
     * @param id 活动ID
     * @return 活动对象
     * @see ActivityServiceImpl#getActivityById(Long) 查看业务层实现和日志记录
     */
    Activity selectById(@Param("id") Long id);

    /**
     * 查询活动的亮点
     * @param activityId 活动ID
     * @return 活动亮点列表
     * @see ActivityServiceImpl#getActivityById(Long) 查看业务层实现和日志记录
     */
    List<ActivityHighlight> selectHighlightsByActivityId(@Param("activityId") Long activityId);

    /**
     * 查询活动的标签
     * @param activityId 活动ID
     * @return 活动标签列表
     * @see ActivityServiceImpl#getActivityById(Long) 查看业务层实现和日志记录
     */
    List<ActivityTag> selectTagsByActivityId(@Param("activityId") Long activityId);

    /**
     * 新增活动
     * @param activity 活动对象
     * @return 影响行数
     * @see ActivityServiceImpl#createActivity(Activity) 查看业务层实现和日志记录
     */
    int insertActivity(Activity activity);

    /**
     * 更新活动
     * @param activity 活动对象
     * @return 影响行数
     * @see ActivityServiceImpl#updateActivity(Activity) 查看业务层实现和日志记录
     */
    int updateActivity(Activity activity);

    /**
     * 删除活动
     * @param id 活动ID
     * @return 影响行数
     * @see ActivityServiceImpl#deleteActivity(Long) 查看业务层实现和日志记录
     */
    int deleteActivity(@Param("id") Long id);

    /**
     * 报名活动
     * @param registration 报名记录
     * @return 影响行数
     * @see ActivityServiceImpl#registerActivity(Long, Long) 查看业务层实现和日志记录
     */
    int registerActivity(ActivityRegistration registration);

    /**
     * 更新活动已报名人数
     * @param activityId 活动ID
     * @param increment 增加的报名人数
     * @return 影响行数
     * @see ActivityServiceImpl#registerActivity(Long, Long) 查看业务层实现和日志记录
     * @see ActivityServiceImpl#cancelRegistration(Long, Long) 查看业务层实现和日志记录
     */
    int updateActivityRegistrations(@Param("activityId") Long activityId, @Param("increment") int increment);

    /**
     * 查询用户是否已报名该活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 报名记录
     * @see ActivityServiceImpl#isUserRegistered(Long, Long) 查看业务层实现和日志记录
     */
    ActivityRegistration selectRegistrationByActivityIdAndUserId(@Param("activityId") Long activityId, @Param("userId") Long userId);

    /**
     * 取消活动报名
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 影响行数
     * @see ActivityServiceImpl#cancelRegistration(Long, Long) 查看业务层实现和日志记录
     */
    int cancelRegistration(@Param("activityId") Long activityId, @Param("userId") Long userId);
    
    /**
     * 查询用户已报名的活动
     * @param userId 用户ID
     * @return 用户已报名的活动列表
     * @see ActivityServiceImpl#getUserRegisteredActivities(Long) 查看业务层实现和日志记录
     */
    List<Activity> selectActivitiesByUserId(@Param("userId") Long userId);

    /**
     * 搜索活动
     * @param keyword 搜索关键词
     * @return 搜索结果
     * @see ActivityServiceImpl#searchActivities(String) 查看业务层实现和日志记录
     */
    List<Activity> searchActivities(@Param("keyword") String keyword);
}