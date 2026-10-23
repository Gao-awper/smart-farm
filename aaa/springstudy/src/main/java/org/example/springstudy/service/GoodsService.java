package org.example.springstudy.service;

import org.example.springstudy.Bean.Goods;

import java.util.List;
import java.util.Map;

/**
 * 商品服务接口
 */
public interface GoodsService {
    /**
     * 获取所有商品
     * @return 商品列表
     */
    Map<String, Object> getAllGoods();

    /**
     * 根据分类获取商品
     * @param category 商品分类
     * @return 商品列表
     */
    Map<String, Object> getGoodsByCategory(String category);

    /**
     * 根据ID获取商品详情
     * @param goodsId 商品ID
     * @return 商品详情
     */
    Map<String, Object> getGoodsById(Long goodsId);

    /**
     * 根据关键词搜索商品
     * @param keyword 搜索关键词
     * @return 商品列表
     */
    Map<String, Object> searchGoods(String keyword);

    /**
     * 添加商品
     * @param goods 商品信息
     * @return 操作结果
     */
    Map<String, Object> addGoods(Goods goods);

    /**
     * 更新商品
     * @param goods 商品信息
     * @return 操作结果
     */
    Map<String, Object> updateGoods(Goods goods);

    /**
     * 删除商品
     * @param goodsId 商品ID
     * @return 操作结果
     */
    Map<String, Object> deleteGoods(Long goodsId);

    /**
     * 扣减库存
     * @param goodsId 商品ID
     * @param count 扣减数量
     * @return 操作结果
     */
    Map<String, Object> decreaseStock(Long goodsId, Integer count);

    /**
     * 恢复库存
     * @param goodsId 商品ID
     * @param count 恢复数量
     * @return 操作结果
     */
    Map<String, Object> increaseStock(Long goodsId, Integer count);

    /**
     * 检查库存是否足够
     * @param goodsId 商品ID
     * @param count 需要的数量
     * @return 操作结果
     */
    Map<String, Object> checkStock(Long goodsId, Integer count);
}