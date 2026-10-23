package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springstudy.Bean.AnswerRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 答题记录Mapper接口
 */
@Mapper
public interface AnswerRecordMapper {
    /**
     * 根据用户ID查询答题记录列表
     * @param userId 用户ID
     * @return 答题记录列表
     */
    List<AnswerRecord> selectByUserId(Long userId);

    /**
     * 根据记录ID查询答题记录
     * @param id 记录ID
     * @return 答题记录信息
     */
    AnswerRecord selectById(Long id);

    /**
     * 插入答题记录
     * @param answerRecord 答题记录信息
     * @return 影响行数
     */
    int insert(AnswerRecord answerRecord);

    /**
     * 更新答题记录
     * @param answerRecord 答题记录信息
     * @return 影响行数
     */
    int updateById(AnswerRecord answerRecord);

    /**
     * 根据记录ID删除答题记录
     * @param id 记录ID
     * @return 影响行数
     */
    int deleteById(Long id);

    /**
     * 获取用户答题统计信息
     * @param userId 用户ID
     * @return 统计信息
     */
    Map<String, Object> selectStatisticsByUserId(Long userId);

    /**
     * 获取答题排行榜
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param limit 限制数量
     * @return 排行榜数据
     */
    List<Map<String, Object>> selectRanking(@Param("type") String type,
                                            @Param("answerType") String answerType,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime,
                                            @Param("limit") int limit);

    /**
     * 获取用户答题排名
     * @param userId 用户ID
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 用户排名信息
     */
    Map<String, Object> selectUserRanking(@Param("userId") Long userId,
                                         @Param("type") String type,
                                         @Param("answerType") String answerType,
                                         @Param("startTime") LocalDateTime startTime,
                                         @Param("endTime") LocalDateTime endTime);

    /**
     * 查询用户每日答题次数
     * @param userId 用户ID
     * @param type 答题类型
     * @param startTime 当日开始时间
     * @param endTime 当日结束时间
     * @return 答题次数
     */
    int countDailyAnswers(@Param("userId") Long userId,
                         @Param("type") String type,
                         @Param("startTime") LocalDateTime startTime,
                         @Param("endTime") LocalDateTime endTime);
}