/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : farm

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 25/12/2025 17:33:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for crops
-- ----------------------------
DROP TABLE IF EXISTS `crops`;
CREATE TABLE `crops`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '作物ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作物名称',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作物类型',
  `planting_date` date NOT NULL COMMENT '种植日期',
  `expected_harvest_date` date NULL DEFAULT NULL COMMENT '预计收获日期',
  `actual_harvest_date` date NULL DEFAULT NULL COMMENT '实际收获日期',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '生长中' COMMENT '作物状态：种植中、生长中、成熟、已收获',
  `yield` decimal(10, 2) NULL DEFAULT NULL COMMENT '产量（公斤）',
  `area` decimal(10, 2) NOT NULL COMMENT '种植面积（亩）',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '种植位置',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '作物表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of crops
-- ----------------------------
INSERT INTO `crops` VALUES (1, '小麦', '粮食作物', '2025-10-01', '2026-05-01', NULL, '生长中', NULL, 50.00, '农场A区', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `crops` VALUES (2, '玉米', '粮食作物', '2025-11-01', '2026-06-01', NULL, '生长中', NULL, 30.00, '农场B区', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `crops` VALUES (3, '水稻', '粮食作物', '2025-09-15', '2026-04-15', NULL, '生长中', NULL, 40.00, '农场C区', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `crops` VALUES (4, '西红柿', '蔬菜', '2025-11-15', '2026-02-15', NULL, '生长中', NULL, 10.00, '农场D区', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `crops` VALUES (5, '黄瓜', '蔬菜', '2025-11-20', '2026-02-20', NULL, '生长中', NULL, 8.00, '农场E区', '2025-12-23 19:40:50', '2025-12-23 19:40:50');

-- ----------------------------
-- Table structure for irrigation_zones
-- ----------------------------
DROP TABLE IF EXISTS `irrigation_zones`;
CREATE TABLE `irrigation_zones`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '灌溉区域ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '区域名称',
  `area` decimal(10, 2) NOT NULL COMMENT '区域面积（亩）',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '正常' COMMENT '状态：正常、维护中',
  `last_irrigation_time` datetime NULL DEFAULT NULL COMMENT '上次灌溉时间',
  `next_irrigation_time` datetime NULL DEFAULT NULL COMMENT '下次灌溉时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '灌溉区域表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of irrigation_zones
-- ----------------------------
INSERT INTO `irrigation_zones` VALUES (1, 'A区灌溉', 30.00, '正常', '2025-12-20 10:00:00', '2025-12-27 10:00:00', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `irrigation_zones` VALUES (2, 'B区灌溉', 25.00, '正常', '2025-12-19 14:00:00', '2025-12-26 14:00:00', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `irrigation_zones` VALUES (3, 'C区灌溉', 20.00, '正常', '2025-12-21 08:00:00', '2025-12-28 08:00:00', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `irrigation_zones` VALUES (4, 'D区灌溉', 15.00, '正常', '2025-12-22 16:00:00', '2025-12-29 16:00:00', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `irrigation_zones` VALUES (5, 'E区灌溉', 10.00, '正常', '2025-12-18 12:00:00', '2025-12-25 12:00:00', '2025-12-23 19:40:50', '2025-12-23 19:40:50');

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '设备ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设备名称',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设备类型：传感器、控制器、灌溉设备',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '在线' COMMENT '设备状态：在线、离线、故障',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设备位置',
  `last_maintenance` date NULL DEFAULT NULL COMMENT '上次维护日期',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '设备表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (1, '温度传感器1', '传感器', '在线', '农场A区', '2025-12-01', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `devices` VALUES (2, '湿度传感器1', '传感器', '在线', '农场A区', '2025-12-01', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `devices` VALUES (3, '温度传感器2', '传感器', '在线', '农场B区', '2025-12-01', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `devices` VALUES (4, '湿度传感器2', '传感器', '在线', '农场B区', '2025-12-01', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `devices` VALUES (5, '灌溉控制器1', '控制器', '在线', '农场A区', '2025-11-15', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `devices` VALUES (6, '灌溉控制器2', '控制器', '在线', '农场B区', '2025-11-15', '2025-12-23 19:40:50', '2025-12-23 19:40:50');

-- ----------------------------
-- Table structure for monitoring_data
-- ----------------------------
DROP TABLE IF EXISTS `monitoring_data`;
CREATE TABLE `monitoring_data`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '数据ID',
  `device_id` int NOT NULL COMMENT '设备ID',
  `data_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据类型：温度、湿度、土壤湿度、光照',
  `value` decimal(10, 2) NOT NULL COMMENT '数据值',
  `unit` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '单位',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '采集时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id` ASC) USING BTREE,
  CONSTRAINT `monitoring_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '监控数据表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of monitoring_data
-- ----------------------------
INSERT INTO `monitoring_data` VALUES (1, 1, '温度', 25.50, '℃', '2025-12-25 00:00:00');
INSERT INTO `monitoring_data` VALUES (2, 2, '湿度', 65.00, '%', '2025-12-25 00:00:00');
INSERT INTO `monitoring_data` VALUES (3, 3, '温度', 26.00, '℃', '2025-12-25 00:00:00');
INSERT INTO `monitoring_data` VALUES (4, 4, '湿度', 60.00, '%', '2025-12-25 00:00:00');
INSERT INTO `monitoring_data` VALUES (5, 1, '温度', 25.80, '℃', '2025-12-25 01:00:00');
INSERT INTO `monitoring_data` VALUES (6, 2, '湿度', 64.00, '%', '2025-12-25 01:00:00');
INSERT INTO `monitoring_data` VALUES (7, 3, '温度', 26.20, '℃', '2025-12-25 01:00:00');
INSERT INTO `monitoring_data` VALUES (8, 4, '湿度', 59.00, '%', '2025-12-25 01:00:00');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user' COMMENT '角色：admin、user',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电话',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '123456', 'admin', '管理员', '13800138000', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `users` VALUES (2, 'user1', '123456', 'user', '用户1', '13900139001', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `users` VALUES (3, 'user2', '123456', 'user', '用户2', '13900139002', '2025-12-23 19:40:50', '2025-12-23 19:40:50');

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设置键',
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设置值',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '设置描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `key`(`key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统设置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of settings
-- ----------------------------
INSERT INTO `settings` VALUES (1, 'farm_name', '智慧农场', '农场名称', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `settings` VALUES (2, 'farm_area', '120', '农场总面积（亩）', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `settings` VALUES (3, 'irrigation_time', '10:00', '默认灌溉时间', '2025-12-23 19:40:50', '2025-12-23 19:40:50');
INSERT INTO `settings` VALUES (4, 'notification_email', 'admin@farm.com', '通知邮箱', '2025-12-23 19:40:50', '2025-12-23 19:40:50');

SET FOREIGN_KEY_CHECKS = 1;