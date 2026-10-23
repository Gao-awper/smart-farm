package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Activity;
import org.example.springstudy.Bean.ActivitySubmission;
import org.example.springstudy.Mapper.ActivityMapper;
import org.example.springstudy.Mapper.ActivitySubmissionMapper;
import org.example.springstudy.service.ActivitySubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 活动投稿服务实现类
 */
@Service
public class ActivitySubmissionServiceImpl implements ActivitySubmissionService {

    @Autowired
    private ActivitySubmissionMapper activitySubmissionMapper;

    @Autowired
    private ActivityMapper activityMapper;

    @Override
    public Map<String, Object> submitActivity(ActivitySubmission submission) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 设置默认值
            submission.setStatus("pending");
            submission.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            submission.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            
            int insertResult = activitySubmissionMapper.insert(submission);
            if (insertResult > 0) {
                result.put("status", "success");
                result.put("message", "提交活动成功，等待审核");
                result.put("data", submission);
            } else {
                result.put("status", "error");
                result.put("message", "提交活动失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "提交活动失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getAllSubmissions() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ActivitySubmission> submissions = activitySubmissionMapper.selectAll();
            result.put("status", "success");
            result.put("message", "查询投稿列表成功");
            result.put("data", submissions);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询投稿列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getSubmissionsByUserId(Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ActivitySubmission> submissions = activitySubmissionMapper.selectByUserId(userId);
            result.put("status", "success");
            result.put("message", "查询用户投稿列表成功");
            result.put("data", submissions);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询用户投稿列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getSubmissionById(Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            ActivitySubmission submission = activitySubmissionMapper.selectById(id);
            if (submission != null) {
                result.put("status", "success");
                result.put("message", "查询投稿详情成功");
                result.put("data", submission);
            } else {
                result.put("status", "error");
                result.put("message", "投稿不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询投稿详情失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> reviewSubmission(Long id, String status, String comment, Long reviewedBy) {
        Map<String, Object> result = new HashMap<>();
        try {
            ActivitySubmission submission = activitySubmissionMapper.selectById(id);
            if (submission != null) {
                submission.setStatus(status);
                submission.setReviewComment(comment);
                submission.setReviewedBy(reviewedBy);
                submission.setReviewedAt(new Timestamp(System.currentTimeMillis()));
                submission.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                
                int updateResult = activitySubmissionMapper.updateStatus(submission);
                if (updateResult > 0) {
                    if ("approved".equals(status)) {
                        Activity activity = new Activity();
                        activity.setTitle(submission.getTitle());
                        activity.setDescription(submission.getDescription());
                        activity.setStartTime(submission.getStartTime());
                        activity.setEndTime(submission.getEndTime());
                        activity.setLocation(submission.getLocation());
                        activity.setCapacity(submission.getCapacity());
                        activity.setRegistrations(0);
                        activity.setStatus("upcoming");
                        activity.setImage(submission.getImage());
                        activity.setDetail(submission.getDetail());
                        activity.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                        activity.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                        
                        activityMapper.insertActivity(activity);
                    }
                    result.put("status", "success");
                    result.put("message", "审核活动投稿成功");
                    result.put("data", submission);
                } else {
                    result.put("status", "error");
                    result.put("message", "审核活动投稿失败");
                }
            } else {
                result.put("status", "error");
                result.put("message", "投稿不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "审核活动投稿失败：" + e.getMessage());
        }
        return result;
    }
}