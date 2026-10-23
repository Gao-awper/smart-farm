package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.AnswerRecord;
import org.example.springstudy.Bean.AnswerDetail;
import org.example.springstudy.Mapper.AnswerRecordMapper;
import org.example.springstudy.Mapper.AnswerDetailMapper;
import org.example.springstudy.service.AnswerRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 答题记录服务实现类
 */
@Service
public class AnswerRecordServiceImpl implements AnswerRecordService {

    @Autowired
    private AnswerRecordMapper answerRecordMapper;

    @Autowired
    private AnswerDetailMapper answerDetailMapper;

    // 可配置的每日答题上限（可以放到配置文件中）
    private static final int GENERAL_DAILY_LIMIT = 2; // 综合题库每日限答2次
    private static final int DEFAULT_DAILY_LIMIT = 1; // 其他专题每日限答1次
    // 领取每日额外奖励的最低得分要求
    private static final int DAILY_BONUS_MIN_SCORE = 60;

    @Override
    public Map<String, Object> getAnswerRecordsByUserId(Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<AnswerRecord> answerRecords = answerRecordMapper.selectByUserId(userId);
            result.put("status", "success");
            result.put("message", "查询答题记录列表成功");
            result.put("data", answerRecords);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询答题记录列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getAnswerRecordById(Long recordId) {
        Map<String, Object> result = new HashMap<>();
        try {
            AnswerRecord answerRecord = answerRecordMapper.selectById(recordId);
            if (answerRecord != null) {
                // 获取答题详情
                List<AnswerDetail> answerDetails = answerDetailMapper.selectByRecordId(recordId);

                Map<String, Object> data = new HashMap<>();
                data.put("record", answerRecord);
                data.put("details", answerDetails);

                result.put("status", "success");
                result.put("message", "查询答题记录详情成功");
                result.put("data", data);
            } else {
                result.put("status", "error");
                result.put("message", "答题记录不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询答题记录详情失败：" + e.getMessage());
        }
        return result;
    }

    @Transactional
    @Override
    public Map<String, Object> createAnswerRecord(AnswerRecord answerRecord, List<AnswerDetail> answerDetails) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 记录开始插入答题记录
            System.out.println("[数据库日志] 开始插入答题记录：userId=" + answerRecord.getUserId() + ", type=" + answerRecord.getType() + ", score=" + answerRecord.getScore());

            // 插入答题记录
            int insertResult = answerRecordMapper.insert(answerRecord);
            System.out.println("[数据库日志] 答题记录插入结果：" + (insertResult > 0 ? "成功" : "失败") + ", 生成的recordId=" + answerRecord.getId());

            if (insertResult > 0) {
                // 插入答题详情
                if (answerDetails != null && !answerDetails.isEmpty()) {
                    System.out.println("[数据库日志] 开始插入答题详情，共 " + answerDetails.size() + " 条记录");
                    for (int i = 0; i < answerDetails.size(); i++) {
                        AnswerDetail detail = answerDetails.get(i);
                        detail.setRecordId(answerRecord.getId());
                        detail.setCreateTime(LocalDateTime.now());
                        int detailInsertResult = answerDetailMapper.insert(detail);
                        System.out.println("[数据库日志] 第 " + (i + 1) + " 条答题详情插入结果：" + (detailInsertResult > 0 ? "成功" : "失败") + ", questionId=" + detail.getQuestionId());
                    }
                } else {
                    System.out.println("[数据库日志] 没有答题详情需要插入");
                }

                result.put("status", "success");
                result.put("message", "创建答题记录成功");
                result.put("data", answerRecord);
                System.out.println("[数据库日志] 答题记录创建完成：recordId=" + answerRecord.getId());
            } else {
                result.put("status", "error");
                result.put("message", "创建答题记录失败");
                System.out.println("[数据库日志] 答题记录创建失败：无法插入主记录");
            }
        } catch (Exception e) {
            System.out.println("[数据库日志] 答题记录创建发生异常：" + e.getMessage());
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "创建答题记录失败：" + e.getMessage());
            throw new RuntimeException(e); // 触发事务回滚
        }
        return result;
    }

    @Override
    public Map<String, Object> getAnswerStatisticsByUserId(Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> statistics = answerRecordMapper.selectStatisticsByUserId(userId);
            result.put("status", "success");
            result.put("message", "获取答题统计信息成功");
            result.put("data", statistics);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "获取答题统计信息失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getAnswerRanking(String type, String answerType) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 计算时间范围
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startTime;
            LocalDateTime endTime = now;

            switch (type) {
                case "daily": // 日榜
                    startTime = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                case "weekly": // 周榜
                    startTime = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                case "monthly": // 月榜
                    startTime = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                default:
                    result.put("status", "error");
                    result.put("message", "无效的排行榜类型");
                    return result;
            }

            // 获取排行榜数据
            List<Map<String, Object>> rankingList = answerRecordMapper.selectRanking(type, answerType, startTime, endTime, 100);

            result.put("status", "success");
            result.put("message", "获取答题排行榜成功");
            result.put("data", rankingList);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "获取答题排行榜失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getUserAnswerRanking(Long userId, String type, String answerType) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 计算时间范围
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startTime;
            LocalDateTime endTime = now;

            switch (type) {
                case "daily": // 日榜
                    startTime = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                case "weekly": // 周榜
                    startTime = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                case "monthly": // 月榜
                    startTime = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    break;
                default:
                    result.put("status", "error");
                    result.put("message", "无效的排行榜类型");
                    return result;
            }

            // 获取用户排名
            Map<String, Object> userRanking = answerRecordMapper.selectUserRanking(userId, type, answerType, startTime, endTime);

            result.put("status", "success");
            result.put("message", "获取用户答题排名成功");
            result.put("data", userRanking);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "获取用户答题排名失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 检查用户每日答题限制
     * @param userId 用户ID
     * @param answerType 答题类型
     * @return 检查结果（是否可答题、已答题次数、剩余次数）
     */
    @Override
    public Map<String, Object> checkDailyAnswerLimit(Long userId, String answerType) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 计算当日时间范围（00:00:00 到 23:59:59）
            LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime todayEnd = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);

            // 2. 根据题型设置不同的每日限制
            int dailyLimit = "general".equals(answerType) ? GENERAL_DAILY_LIMIT : DEFAULT_DAILY_LIMIT;

            // 3. 查询用户当日该类型的答题次数
            int todayAnswerCount = answerRecordMapper.countDailyAnswers(userId, answerType, todayStart, todayEnd);

            // 4. 计算剩余答题次数
            int remainingCount = dailyLimit - todayAnswerCount;
            boolean canAnswer = remainingCount > 0;

            // 5. 组装返回结果
            Map<String, Object> data = new HashMap<>();
            data.put("canAnswer", canAnswer);
            data.put("dailyLimit", dailyLimit);
            data.put("answeredCount", todayAnswerCount);
            data.put("remainingCount", remainingCount);

            result.put("status", "success");
            result.put("message", canAnswer ? "用户今日仍可答题" : "用户今日答题已达上限");
            result.put("data", data);

        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "检查每日答题限制失败：" + e.getMessage());
        }
        return result;
    }

}