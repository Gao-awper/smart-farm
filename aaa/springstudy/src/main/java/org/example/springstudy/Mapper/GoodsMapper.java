package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springstudy.Bean.Goods;

import java.util.List;

/**
 * 商品Mapper接口
 */
@Mapper
public interface GoodsMapper {
    /**
     * 查询所有商品
     * @return 商品列表
     */
    List<Goods> selectAll();

    /**
     * 根据分类查询商品
     * @param category 商品分类
     * @return 商品列表
     */
    List<Goods> selectByCategory(String category);

    /**
     * 根据ID查询商品
     * @param id 商品ID
     * @return 商品信息
     */
    Goods selectById(Long id);

    /**
     * 根据关键词搜索商品
     * @param keyword 搜索关键词
     * @return 商品列表
     */
    List<Goods> searchByKeyword(String keyword);

    /**
     * 插入商品
     * @param goods 商品信息
     * @return 影响行数
     */
    int insert(Goods goods);

    /**
     * 更新商品
     * @param goods 商品信息
     * @return 影响行数
     */
    int updateById(Goods goods);

    /**
     * 删除商品
     * @param id 商品ID
     * @return 影响行数
     */
    int deleteById(Long id);

    /**
     * 扣减库存
     * @param goodsId 商品ID
     * @param count 扣减数量
     * @return 影响行数
     */
    int decreaseStock(@Param("goodsId") Long goodsId, @Param("count") Integer count);

    /**
     * 恢复库存
     * @param goodsId 商品ID
     * @param count 恢复数量
     * @return 影响行数
     */
    int increaseStock(@Param("goodsId") Long goodsId, @Param("count") Integer count);

    /**
     * 批量扣减库存
     * @param goodsId 商品ID
     * @param count 扣减数量
     * @return 影响行数
     */
    int decreaseStockBatch(@Param("goodsId") Long goodsId, @Param("count") Integer count);

    /**
     * 批量恢复库存
     * @param goodsId 商品ID
     * @param count 恢复数量
     * @return 影响行数
     */
    int increaseStockBatch(@Param("goodsId") Long goodsId, @Param("count") Integer count);
}