package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.springstudy.Bean.OrderGoods;

import java.util.List;

/**
 * 订单商品Mapper接口
 */
@Mapper
public interface OrderGoodsMapper {
    /**
     * 批量插入订单商品
     * @param orderGoodsList 订单商品列表
     * @return 影响行数
     */
    int batchInsert(List<OrderGoods> orderGoodsList);

    /**
     * 根据订单ID查询订单商品
     * @param orderId 订单ID
     * @return 订单商品列表
     */
    List<OrderGoods> selectByOrderId(Long orderId);

    /**
     * 根据订单ID删除订单商品
     * @param orderId 订单ID
     * @return 影响行数
     */
    int deleteByOrderId(Long orderId);
}