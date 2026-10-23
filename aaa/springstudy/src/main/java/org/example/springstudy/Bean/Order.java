package org.example.springstudy.Bean;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单实体类
 */
public class Order {
    private Long id; // 订单ID
    private Long userId; // 用户ID
    private String orderNo; // 订单编号
    private LocalDateTime createTime; // 创建时间
    private String status; // 订单状态：pending-待付款 paid-待发货 shipped-待收货 completed-已完成 cancelled-已取消
    private double totalPrice; // 订单总金额
    private double shippingFee; // 运费
    private String paymentMethod; // 支付方式：alipay-支付宝 wechat-微信支付 bank-银行卡支付
    private Long addressId; // 收货地址ID
    private List<OrderGoods> goodsList; // 订单商品列表
    private Address address; // 收货地址

    // getter和setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<OrderGoods> getGoodsList() {
        return goodsList;
    }

    public void setGoodsList(List<OrderGoods> goodsList) {
        this.goodsList = goodsList;
    }

    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", userId=" + userId +
                ", orderNo='" + (orderNo != null ? orderNo : "null") + '\'' +
                ", createTime=" + createTime +
                ", status='" + (status != null ? status : "null") + '\'' +
                ", totalPrice=" + totalPrice +
                ", shippingFee=" + shippingFee +
                ", paymentMethod='" + (paymentMethod != null ? paymentMethod : "null") + '\'' +
                ", addressId=" + addressId +
                ", goodsList=" + (goodsList != null ? goodsList.toString() : "null") +
                ", address=" + (address != null ? address.toString() : "null") +
                '}';
    }
}