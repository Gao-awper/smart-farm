package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.springstudy.Bean.ActivitySubmission;

import java.util.List;

/**
 * 活动投稿Mapper接口
 */
@Mapper
public interface ActivitySubmissionMapper {
    /**
     * 插入活动投稿
     * @param submission 活动投稿信息
     * @return 插入结果
     */
    int insert(ActivitySubmission submission);

    /**
     * 根据ID查询活动投稿
     * @param id 投稿ID
     * @return 活动投稿信息
     */
    ActivitySubmission selectById(Long id);

    /**
     * 查询所有活动投稿
     * @return 活动投稿列表
     */
    List<ActivitySubmission> selectAll();

    /**
     * 根据用户ID查询活动投稿
     * @param userId 用户ID
     * @return 活动投稿列表
     */
    List<ActivitySubmission> selectByUserId(Long userId);

    /**
     * 根据审核状态查询活动投稿
     * @param status 审核状态
     * @return 活动投稿列表
     */
    List<ActivitySubmission> selectByStatus(String status);

    /**
     * 更新活动投稿的审核状态
     * @param submission 活动投稿信息
     * @return 更新结果
     */
    int updateStatus(ActivitySubmission submission);

    /**
     * 删除活动投稿
     * @param id 投稿ID
     * @return 删除结果
     */
    int deleteById(Long id);
}