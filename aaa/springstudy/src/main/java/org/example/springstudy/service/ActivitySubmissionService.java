package org.example.springstudy.service;

import org.example.springstudy.Bean.ActivitySubmission;

import java.util.Map;

/**
 * 活动投稿服务接口
 */
public interface ActivitySubmissionService {
    /**
     * 提交活动
     * @param submission 活动投稿信息
     * @return 提交结果
     */
    Map<String, Object> submitActivity(ActivitySubmission submission);

    /**
     * 获取活动投稿列表
     * @return 投稿列表
     */
    Map<String, Object> getAllSubmissions();

    /**
     * 根据用户ID获取投稿列表
     * @param userId 用户ID
     * @return 投稿列表
     */
    Map<String, Object> getSubmissionsByUserId(Long userId);

    /**
     * 根据ID获取投稿详情
     * @param id 投稿ID
     * @return 投稿详情
     */
    Map<String, Object> getSubmissionById(Long id);

    /**
     * 审核活动投稿
     * @param id 投稿ID
     * @param status 审核状态
     * @param comment 审核意见
     * @param reviewedBy 审核人ID
     * @return 审核结果
     */
    Map<String, Object> reviewSubmission(Long id, String status, String comment, Long reviewedBy);
}