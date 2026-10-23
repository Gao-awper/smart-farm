package org.example.springstudy.Mapper;

import org.example.springstudy.Bean.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 题目Mapper接口
 */
@Mapper
public interface QuestionMapper {
    /**
     * 根据ID查询题目
     */
    Question selectById(@Param("id") Long id);

    /**
     * 根据分类查询题目列表
     */
    List<Question> selectByCategory(@Param("category") String category);

    /**
     * 根据分类和难度查询题目列表
     */
    List<Question> selectByCategoryAndDifficulty(@Param("category") String category, @Param("difficulty") String difficulty);

    /**
     * 随机获取指定数量的题目
     */
    List<Question> selectRandomQuestions(@Param("category") String category, @Param("count") int count);

    /**
     * 插入题目
     */
    int insert(Question question);

    /**
     * 更新题目
     */
    int update(Question question);

    /**
     * 删除题目
     */
    int delete(@Param("id") Long id);

    /**
     * 批量插入题目
     */
    int batchInsert(@Param("questions") List<Question> questions);
}