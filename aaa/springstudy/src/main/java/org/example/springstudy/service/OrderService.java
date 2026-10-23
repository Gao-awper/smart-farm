package org.example.springstudy.service;

import org.example.springstudy.Bean.Order;

import java.util.List;
import java.util.Map;

/**
 * 订单服务接口
 */
public interface OrderService {
    /**
     * 根据用户ID获取订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    Map<String, Object> getOrdersByUserId(Long userId);

    /**
     * 根据订单ID获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    Map<String, Object> getOrderById(Long orderId);

    /**
     * 取消订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    Map<String, Object> cancelOrder(Long orderId);

    /**
     * 支付订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    Map<String, Object> payOrder(Long orderId);

    /**
     * 确认收货
     * @param orderId 订单ID
     * @return 操作结果
     */
    Map<String, Object> confirmReceipt(Long orderId);

    /**
     * 创建订单
     * @param order 订单信息
     * @return 操作结果
     */
    Map<String, Object> createOrder(Order order);

    /**
     * 删除订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    Map<String, Object> deleteOrder(Long orderId);
    
    /**
     * 获取所有订单
     * @return 所有订单列表
     */
    Map<String, Object> getAllOrders();
    
    /**
     * 搜索订单
     * @param keyword 搜索关键词
     * @return 订单列表
     */
    Map<String, Object> searchOrders(String keyword);
}