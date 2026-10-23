package org.example.springstudy.controller;

import lombok.extern.java.Log;
import org.example.springstudy.Bean.Order;
import org.example.springstudy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     * @param order 订单信息
     * @return 操作结果
     */
    @PostMapping
    public Map<String, Object> createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    /**
     * 根据用户ID获取订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    @GetMapping("/user/{id}")
    public Map<String, Object> getOrdersByUserId(@PathVariable("id") Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    /**
     * 根据订单ID获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    @GetMapping("/{id}")
    public Map<String, Object> getOrderById(@PathVariable("id") Long orderId) {

       System.out.println("查询了订单详情");
        return orderService.getOrderById(orderId);
    }

    /**
     * 取消订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    @PutMapping("/{id}/cancel")
    public Map<String, Object> cancelOrder(@PathVariable("id") Long orderId) {
        return orderService.cancelOrder(orderId);
    }

    /**
     * 支付订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    @PutMapping("/{id}/pay")
    public Map<String, Object> payOrder(@PathVariable("id") Long orderId) {
        return orderService.payOrder(orderId);
    }

    /**
     * 确认收货
     * @param orderId 订单ID
     * @return 操作结果
     */
    @PutMapping("/{id}/confirm")
    public Map<String, Object> confirmReceipt(@PathVariable("id") Long orderId) {
        return orderService.confirmReceipt(orderId);
    }

    /**
     * 删除订单
     * @param orderId 订单ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}/delete")
    public Map<String, Object> deleteOrder(@PathVariable("id") Long orderId) {
        System.out.println("接收到删除订单请求，订单ID：{}"+orderId);
        return orderService.deleteOrder(orderId);
    }
    
    /**
     * 获取所有订单接口（管理员专用）
     * @return 所有订单列表
     */
    @GetMapping
    public Map<String, Object> getAllOrders() {
        return orderService.getAllOrders();
    }
    
    /**
     * 搜索订单接口（管理员专用）
     * @param keyword 搜索关键词
     * @return 订单列表
     */
    @GetMapping("/search")
    public Map<String, Object> searchOrders(@RequestParam String keyword) {
        return orderService.searchOrders(keyword);
    }
}