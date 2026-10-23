package org.example.springstudy.Mapper;

import org.example.springstudy.Bean.AnswerDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 答题详情Mapper接口
 */
@Mapper
public interface AnswerDetailMapper {
    /**
     * 根据ID查询答题详情
     */
    AnswerDetail selectById(@Param("id") Long id);

    /**
     * 根据记录ID查询答题详情列表
     */
    List<AnswerDetail> selectByRecordId(@Param("recordId") Long recordId);

    /**
     * 插入答题详情
     */
    int insert(AnswerDetail answerDetail);

    /**
     * 批量插入答题详情
     */
    int batchInsert(@Param("details") List<AnswerDetail> details);

    /**
     * 根据记录ID删除答题详情
     */
    int deleteByRecordId(@Param("recordId") Long recordId);
}