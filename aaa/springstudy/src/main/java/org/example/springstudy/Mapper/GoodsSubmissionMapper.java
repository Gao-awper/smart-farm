package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.springstudy.Bean.GoodsSubmission;

import java.util.List;

/**
 * 商品投稿Mapper接口
 */
@Mapper
public interface GoodsSubmissionMapper {
    /**
     * 插入商品投稿
     * @param submission 商品投稿信息
     * @return 插入结果
     */
    int insert(GoodsSubmission submission);

    /**
     * 根据ID查询商品投稿
     * @param id 投稿ID
     * @return 商品投稿信息
     */
    GoodsSubmission selectById(Long id);

    /**
     * 查询所有商品投稿
     * @return 商品投稿列表
     */
    List<GoodsSubmission> selectAll();

    /**
     * 根据用户ID查询商品投稿
     * @param userId 用户ID
     * @return 商品投稿列表
     */
    List<GoodsSubmission> selectByUserId(Long userId);

    /**
     * 根据审核状态查询商品投稿
     * @param status 审核状态
     * @return 商品投稿列表
     */
    List<GoodsSubmission> selectByStatus(String status);

    /**
     * 更新商品投稿的审核状态
     * @param submission 商品投稿信息
     * @return 更新结果
     */
    int updateStatus(GoodsSubmission submission);

    /**
     * 删除商品投稿
     * @param id 投稿ID
     * @return 删除结果
     */
    int deleteById(Long id);
}