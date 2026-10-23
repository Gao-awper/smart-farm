package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Address;
import org.example.springstudy.Bean.Order;
import org.example.springstudy.Bean.OrderGoods;
import org.example.springstudy.Mapper.AddressMapper;
import org.example.springstudy.Mapper.OrderGoodsMapper;
import org.example.springstudy.Mapper.OrderMapper;
import org.example.springstudy.service.GoodsService;
import org.example.springstudy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private AddressMapper addressMapper;

    @Autowired
    private OrderGoodsMapper orderGoodsMapper;

    @Autowired
    private GoodsService goodsService;

    @Override
    public Map<String, Object> getOrdersByUserId(Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Order> orders = orderMapper.selectByUserId(userId);
            System.out.println("查询出的订单"+orders);
            
            // 为每个订单加载商品信息并设置默认值
            for (Order order : orders) {
                List<OrderGoods> goodsList = orderGoodsMapper.selectByOrderId(order.getId());
                order.setGoodsList(goodsList);
                
                // 确保商品列表不为null
                if (order.getGoodsList() == null) {
                    order.setGoodsList(new ArrayList<>());
                }
                
                // 确保支付方式不为null
                if (order.getPaymentMethod() == null) {
                    order.setPaymentMethod("");
                }
                
                // 确保状态不为null
                if (order.getStatus() == null) {
                    order.setStatus("");
                }
                
                // 确保订单编号不为null
                if (order.getOrderNo() == null) {
                    order.setOrderNo("");
                }
            }
            
            result.put("status", "success");
            result.put("message", "查询订单列表成功");
            result.put("data", orders);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询订单列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getOrderById(Long orderId) {
        Map<String, Object> result = new HashMap<>();

        try {
            Order order = orderMapper.selectById(orderId);
            if (order != null) {
                // 如果有地址ID，查询地址信息
                if (order.getAddressId() != null) {
                    Address address = addressMapper.selectById(order.getAddressId());
                    order.setAddress(address);
                }
                
                // 查询订单商品信息
                List<OrderGoods> goodsList = orderGoodsMapper.selectByOrderId(orderId);
                order.setGoodsList(goodsList);
                
                // 确保商品列表不为null
                if (order.getGoodsList() == null) {
                    order.setGoodsList(new ArrayList<>());
                }
                
                // 确保支付方式不为null
                if (order.getPaymentMethod() == null) {
                    order.setPaymentMethod("");
                }
                
                // 确保状态不为null
                if (order.getStatus() == null) {
                    order.setStatus("");
                }
                
                // 确保订单编号不为null
                if (order.getOrderNo() == null) {
                    order.setOrderNo("");
                }
                
                result.put("status", "success");
                result.put("message", "查询订单详情成功");
                result.put("data", order);
            } else {
                result.put("status", "error");
                result.put("message", "订单不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询订单详情失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional // 添加事务支持
    public Map<String, Object> cancelOrder(Long orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Order order = orderMapper.selectById(orderId);
            if (order != null) {
                // 只有待付款的订单可以取消
                if ("pending".equals(order.getStatus())) {
                    // 查询订单商品列表
                    List<OrderGoods> goodsList = orderGoodsMapper.selectByOrderId(orderId);
                    
                    // 恢复库存
                    for (OrderGoods goods : goodsList) {
                        Map<String, Object> increaseResult = goodsService.increaseStock(goods.getGoodsId(), goods.getCount());
                        if (!"success".equals(increaseResult.get("status"))) {
                            throw new RuntimeException("恢复库存失败：" + increaseResult.get("message"));
                        }
                    }
                    
                    order.setStatus("cancelled");
                    int updateResult = orderMapper.updateById(order);
                    if (updateResult > 0) {
                        result.put("status", "success");
                        result.put("message", "订单取消成功");
                    } else {
                        result.put("status", "error");
                        result.put("message", "订单取消失败");
                    }
                } else {
                    result.put("status", "error");
                    result.put("message", "只有待付款的订单可以取消");
                }
            } else {
                result.put("status", "error");
                result.put("message", "订单不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "取消订单失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> payOrder(Long orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Order order = orderMapper.selectById(orderId);
            if (order != null) {
                // 只有待付款的订单可以支付
                if ("pending".equals(order.getStatus())) {
                    order.setStatus("paid");
                    int updateResult = orderMapper.updateById(order);
                    if (updateResult > 0) {
                        result.put("status", "success");
                        result.put("message", "订单支付成功");
                    } else {
                        result.put("status", "error");
                        result.put("message", "订单支付失败");
                    }
                } else {
                    result.put("status", "error");
                    result.put("message", "只有待付款的订单可以支付");
                }
            } else {
                result.put("status", "error");
                result.put("message", "订单不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "支付订单失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> confirmReceipt(Long orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Order order = orderMapper.selectById(orderId);
            if (order != null) {
                // 只有待收货的订单可以确认收货
                if ("shipped".equals(order.getStatus())) {
                    order.setStatus("completed");
                    int updateResult = orderMapper.updateById(order);
                    if (updateResult > 0) {
                        result.put("status", "success");
                        result.put("message", "确认收货成功");
                    } else {
                        result.put("status", "error");
                        result.put("message", "确认收货失败");
                    }
                } else {
                    result.put("status", "error");
                    result.put("message", "只有待收货的订单可以确认收货");
                }
            } else {
                result.put("status", "error");
                result.put("message", "订单不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "确认收货失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional // 添加事务支持
    public Map<String, Object> createOrder(Order order) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 校验参数
            if (order == null) {
                result.put("status", "error");
                result.put("message", "订单信息不能为空");
                return result;
            }
            if (order.getUserId() == null) {
                result.put("status", "error");
                result.put("message", "用户ID不能为空");
                return result;
            }
            if (order.getGoodsList() == null || order.getGoodsList().isEmpty()) {
                result.put("status", "error");
                result.put("message", "订单商品列表不能为空");
                return result;
            }
            
            // 检查库存是否充足
            for (OrderGoods goods : order.getGoodsList()) {
                Map<String, Object> stockCheck = goodsService.checkStock(goods.getGoodsId(), goods.getCount());
                if (!"success".equals(stockCheck.get("status"))) {
                    result.put("status", "error");
                    result.put("message", "商品【" + goods.getName() + "】" + stockCheck.get("message"));
                    return result;
                }
            }
            
            // 生成唯一订单号
            String orderNo = "ORD" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            
            // 设置订单基本信息
            order.setOrderNo(orderNo);
            order.setStatus("pending"); // 待付款状态
            order.setCreateTime(LocalDateTime.now());
            
            // 保存订单到数据库
            int insertResult = orderMapper.insert(order);
            if (insertResult > 0) {
                // 检查订单ID是否生成
                if (order.getId() == null) {
                    throw new RuntimeException("订单ID生成失败");
                }
                
                // 设置每个订单商品的订单ID并批量插入
                List<OrderGoods> orderGoodsList = new ArrayList<>();
                for (OrderGoods goods : order.getGoodsList()) {
                    OrderGoods orderGoods = new OrderGoods();
                    orderGoods.setOrderId(order.getId());
                    orderGoods.setGoodsId(goods.getGoodsId());
                    orderGoods.setName(goods.getName());
                    orderGoods.setPrice(goods.getPrice());
                    orderGoods.setCount(goods.getCount());
                    orderGoods.setImage(goods.getImage());
                    orderGoods.setSpec(goods.getSpec());
                    orderGoodsList.add(orderGoods);
                }
                
                // 批量插入订单商品
                if (!orderGoodsList.isEmpty()) {
                    orderGoodsMapper.batchInsert(orderGoodsList);
                }
                
                // 扣减库存
                for (OrderGoods goods : order.getGoodsList()) {
                    Map<String, Object> decreaseResult = goodsService.decreaseStock(goods.getGoodsId(), goods.getCount());
                    if (!"success".equals(decreaseResult.get("status"))) {
                        throw new RuntimeException("扣减库存失败：" + decreaseResult.get("message"));
                    }
                }
                
                result.put("status", "success");
                result.put("message", "订单创建成功");
                result.put("data", order);
            } else {
                result.put("status", "error");
                result.put("message", "订单创建失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "创建订单失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional // 添加事务支持
    public Map<String, Object> deleteOrder(Long orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 检查订单是否存在
            Order order = orderMapper.selectById(orderId);
            if (order == null) {
                result.put("status", "error");
                result.put("message", "订单不存在");
                return result;
            }

            // 2. 检查订单状态（只有已取消或已完成的订单可以删除）
            String status = order.getStatus();
            if (!"cancelled".equals(status) && !"completed".equals(status)) {
                result.put("status", "error");
                result.put("message", "只有已取消或已完成的订单可以删除");
                return result;
            }

            // 3. 先删除订单商品
            orderGoodsMapper.deleteByOrderId(orderId);

            // 4. 再删除订单
            int deleteResult = orderMapper.deleteById(orderId);
            if (deleteResult > 0) {
                result.put("status", "success");
                result.put("message", "订单删除成功");
            } else {
                result.put("status", "error");
                result.put("message", "订单删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "删除订单失败：" + e.getMessage());
        }
        return result;
    }
    
    @Override
    public Map<String, Object> getAllOrders() {
        Map<String, Object> result = new HashMap<>();
        try {
            // 获取所有订单
            List<Order> orders = orderMapper.selectAll();
            
            // 为每个订单加载商品信息并设置默认值
            for (Order order : orders) {
                List<OrderGoods> goodsList = orderGoodsMapper.selectByOrderId(order.getId());
                order.setGoodsList(goodsList);
                
                // 确保商品列表不为null
                if (order.getGoodsList() == null) {
                    order.setGoodsList(new ArrayList<>());
                }
                
                // 确保支付方式不为null
                if (order.getPaymentMethod() == null) {
                    order.setPaymentMethod("");
                }
                
                // 确保状态不为null
                if (order.getStatus() == null) {
                    order.setStatus("");
                }
                
                // 确保订单编号不为null
                if (order.getOrderNo() == null) {
                    order.setOrderNo("");
                }
            }
            
            result.put("status", "success");
            result.put("message", "查询所有订单成功");
            result.put("data", orders);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询所有订单失败：" + e.getMessage());
        }
        return result;
    }
    
    @Override
    public Map<String, Object> searchOrders(String keyword) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 获取所有订单
            List<Order> allOrders = orderMapper.selectAll();
            
            // 筛选匹配的订单
            List<Order> filteredOrders = new ArrayList<>();
            for (Order order : allOrders) {
                boolean matches = false;
                
                // 检查订单编号
                if (order.getOrderNo() != null && order.getOrderNo().toLowerCase().contains(keyword.toLowerCase())) {
                    matches = true;
                }
                
                // 检查用户ID
                if (order.getUserId() != null && order.getUserId().toString().contains(keyword)) {
                    matches = true;
                }
                
                // 检查订单状态
                if (order.getStatus() != null && order.getStatus().toLowerCase().contains(keyword.toLowerCase())) {
                    matches = true;
                }
                
                // 检查订单商品名称
                if (order.getGoodsList() != null) {
                    for (OrderGoods goods : order.getGoodsList()) {
                        if (goods.getName() != null && goods.getName().toLowerCase().contains(keyword.toLowerCase())) {
                            matches = true;
                            break;
                        }
                    }
                }
                
                if (matches) {
                    // 为订单加载商品信息并设置默认值
                    List<OrderGoods> goodsList = orderGoodsMapper.selectByOrderId(order.getId());
                    order.setGoodsList(goodsList);
                    
                    // 确保商品列表不为null
                    if (order.getGoodsList() == null) {
                        order.setGoodsList(new ArrayList<>());
                    }
                    
                    // 确保支付方式不为null
                    if (order.getPaymentMethod() == null) {
                        order.setPaymentMethod("");
                    }
                    
                    // 确保状态不为null
                    if (order.getStatus() == null) {
                        order.setStatus("");
                    }
                    
                    // 确保订单编号不为null
                    if (order.getOrderNo() == null) {
                        order.setOrderNo("");
                    }
                    
                    filteredOrders.add(order);
                }
            }
            
            result.put("status", "success");
            result.put("message", "搜索订单成功");
            result.put("data", filteredOrders);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "搜索订单失败：" + e.getMessage());
        }
        return result;
    }
}