package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.springstudy.Bean.Order;

import java.util.List;

/**
 * 订单Mapper接口
 */
@Mapper
public interface OrderMapper {
    /**
     * 根据用户ID查询订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    List<Order> selectByUserId(Long userId);

    /**
     * 根据订单ID查询订单
     * @param id 订单ID
     * @return 订单信息
     */
    Order selectById(Long id);

    /**
     * 插入订单
     * @param order 订单信息
     * @return 影响行数
     */
    int insert(Order order);

    /**
     * 更新订单
     * @param order 订单信息
     * @return 影响行数
     */
    int updateById(Order order);

    /**
     * 根据订单ID删除订单
     * @param id 订单ID
     * @return 影响行数
     */
    int deleteById(Long id);

    /**
     * 查询所有订单（支持排序）
     * @return 订单列表
     */
    List<Order> selectAll();

}