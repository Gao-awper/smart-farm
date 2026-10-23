package org.example.springstudy.service;

import org.example.springstudy.Bean.AnswerRecord;
import org.example.springstudy.Bean.AnswerDetail;

import java.util.List;
import java.util.Map;

/**
 * 答题记录服务接口
 */
public interface AnswerRecordService {
    /**
     * 根据用户ID获取答题记录列表
     * @param userId 用户ID
     * @return 答题记录列表
     */
    Map<String, Object> getAnswerRecordsByUserId(Long userId);

    /**
     * 根据记录ID获取答题记录详情
     * @param recordId 记录ID
     * @return 答题记录详情
     */
    Map<String, Object> getAnswerRecordById(Long recordId);

    /**
     * 创建答题记录（包含详情）
     * @param answerRecord 答题记录信息
     * @param answerDetails 答题详情列表
     * @return 操作结果
     */
    Map<String, Object> createAnswerRecord(AnswerRecord answerRecord, List<AnswerDetail> answerDetails);

    /**
     * 获取用户答题统计信息
     * @param userId 用户ID
     * @return 统计信息
     */
    Map<String, Object> getAnswerStatisticsByUserId(Long userId);

    /**
     * 获取答题排行榜
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @return 排行榜数据
     */
    Map<String, Object> getAnswerRanking(String type, String answerType);

    /**
     * 获取用户答题排名
     * @param userId 用户ID
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @return 用户排名信息
     */
    Map<String, Object> getUserAnswerRanking(Long userId, String type, String answerType);

    /**
     * 检查用户每日答题限制
     * @param userId 用户ID
     * @param answerType 答题类型
     * @return 检查结果
     */
    Map<String, Object> checkDailyAnswerLimit(Long userId, String answerType);


}