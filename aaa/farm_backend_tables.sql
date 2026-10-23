-- =============================================================
-- 智慧农场后端业务表初始化脚本（补充 farm.sql 中缺失的表）
-- 依据 springstudy 项目的 Mapper XML / Bean 定义生成
-- 字符集：utf8mb4
-- =============================================================
USE farm;

SET NAMES utf8mb4;

-- ----------------------------
-- 用户表（后端登录/注册用，MyBatis-Plus 实体 User -> user）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户唯一ID',
  `username` VARCHAR(50) NULL DEFAULT NULL COMMENT '用户名',
  `password` VARCHAR(64) NOT NULL COMMENT '密码(MD5)',
  `email` VARCHAR(100) NULL DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NULL DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) NULL DEFAULT NULL COMMENT '头像',
  `sex` VARCHAR(10) NULL DEFAULT NULL COMMENT '性别',
  `nickname` VARCHAR(50) NULL DEFAULT NULL COMMENT '昵称',
  `realname` VARCHAR(50) NULL DEFAULT NULL COMMENT '真实姓名',
  `birthday` VARCHAR(20) NULL DEFAULT NULL COMMENT '生日',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态(0:禁用,1:正常)',
  `create_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_nickname` (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';

-- 默认管理员账号：admin / 123456
INSERT INTO `user` (`username`, `password`, `email`, `phone`, `sex`, `nickname`, `status`)
VALUES ('admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin@smartfarm.com', '13800138001', '男', '管理员', 1);

-- ----------------------------
-- 用户权限表（登录后查询权限用）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user_permission` (
  `id` BIGINT NOT NULL COMMENT '用户ID',
  `Inheritor` TINYINT NOT NULL DEFAULT 0 COMMENT '非遗传承人权限(0否/1是)',
  `RegularUser` TINYINT NOT NULL DEFAULT 1 COMMENT '普通用户权限(0否/1是)',
  `Administrator` TINYINT NOT NULL DEFAULT 0 COMMENT '管理员权限(0否/1是)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户权限表';

INSERT INTO `user_permission` (`id`, `Inheritor`, `RegularUser`, `Administrator`) VALUES (1, 0, 1, 1);

-- ----------------------------
-- 商品表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `goods` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `tag` VARCHAR(100) NULL DEFAULT NULL COMMENT '商品标签',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '商品图片URL',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '价格',
  `sales` INT NOT NULL DEFAULT 0 COMMENT '销量',
  `category` VARCHAR(50) NULL DEFAULT NULL COMMENT '分类：vegetables/fruits/grains/processed/tools',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品表';

INSERT INTO `goods` (`name`, `tag`, `price`, `sales`, `category`, `stock`) VALUES
('有机小番茄', '新鲜采摘/当日发货', 12.80, 356, 'vegetables', 200),
('水果黄瓜', '清脆爽口', 8.50, 289, 'vegetables', 150),
('生态菠菜', '无农药残留', 6.00, 178, 'vegetables', 120),
('水蜜桃', '果园直供', 19.90, 512, 'fruits', 300),
('红心猕猴桃', '维C丰富', 15.60, 430, 'fruits', 260),
('阳光玫瑰葡萄', '香甜多汁', 29.90, 601, 'fruits', 180),
('富硒小米', '当季新米', 13.50, 245, 'grains', 400),
('有机小麦粉', '石磨研磨', 9.90, 320, 'grains', 350),
('甜糯玉米', '非转基因', 5.80, 480, 'grains', 500),
('农家自酿蜂蜜', '纯天然', 45.00, 96, 'processed', 80),
('红薯粉条', '传统工艺', 16.80, 154, 'processed', 130),
('多功能园艺剪', '不锈钢刀头', 25.00, 88, 'tools', 90),
('滴灌套装', '节水灌溉', 89.00, 65, 'tools', 60),
('土壤检测仪', '高精度传感器', 129.00, 42, 'tools', 45);

-- ----------------------------
-- 地址表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `name` VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NULL DEFAULT NULL COMMENT '省',
  `city` VARCHAR(50) NULL DEFAULT NULL COMMENT '市',
  `district` VARCHAR(50) NULL DEFAULT NULL COMMENT '区',
  `detail_address` VARCHAR(200) NULL DEFAULT NULL COMMENT '详细地址',
  `is_default` TINYINT NOT NULL DEFAULT 0 COMMENT '是否默认地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='收货地址表';

-- ----------------------------
-- 订单表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `user_id` BIGINT NOT NULL COMMENT '下单用户ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `create_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '总价',
  `shipping_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '运费',
  `payment_method` VARCHAR(30) NULL DEFAULT NULL COMMENT '支付方式',
  `address_id` BIGINT NULL DEFAULT NULL COMMENT '收货地址ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单表';

-- ----------------------------
-- 订单商品表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `order_goods` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `goods_id` BIGINT NULL DEFAULT NULL COMMENT '商品ID',
  `name` VARCHAR(100) NULL DEFAULT NULL COMMENT '商品名称快照',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '商品图片快照',
  `price` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '成交单价',
  `count` INT NOT NULL DEFAULT 1 COMMENT '购买数量',
  `spec` VARCHAR(100) NULL DEFAULT NULL COMMENT '规格',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单商品表';

-- ----------------------------
-- 公告表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `notices` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(100) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `type` VARCHAR(20) NOT NULL COMMENT '公告类型：政府通知、公示、活动通知',
  `time` TIMESTAMP NOT NULL COMMENT '发布时间',
  `author` VARCHAR(50) NOT NULL COMMENT '发布者',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='公告表';

INSERT INTO `notices` (`title`, `content`, `type`, `time`, `author`) VALUES
('关于开展2026年绿野智农推广月活动的通知', '为加强智慧农业技术推广，提高农业生产效率，我市将于2026年6月举办智慧农业推广月活动。活动期间将开展农业技术展览、智慧农场展示、学术讲座等多种形式的活动，欢迎广大农民朋友积极参与。活动详情请关注我局官方网站或微信公众号。', '政府通知', '2026-05-18 18:33:00', '市农业农村局'),
('2026年度智慧农业示范项目评审结果公示', '根据《智慧农业示范项目评审办法》，经专家评审，现将2026年度智慧农业示范项目评审结果予以公示。公示期为2026年5月10日至5月20日。如有异议，请在公示期内以书面形式向我局反映。', '公示', '2026-05-17 10:20:00', '市农业农村局'),
('第三届智慧农场开放日活动通知', '为展示我市智慧农场建设成果，促进农业科技交流，我市将于2026年6月举办第三届智慧农场开放日活动。活动包括无人机植保演示、智能灌溉参观、农产品品鉴等内容。诚挚邀请社会各界人士参与！', '活动通知', '2026-05-16 15:45:00', '绿野智农农场'),
('关于加强农产品质量安全监管工作的通知', '为进一步规范农产品生产经营管理工作，提升农产品质量安全水平，现对各农业生产主体提出以下要求：一、严格执行安全用药标准；二、完善生产记录档案；三、落实产品溯源制度。', '政府通知', '2026-05-15 09:15:00', '市农业农村局'),
('2026年新型职业农民培训计划公示', '为加强智慧农业人才队伍建设，我局制定了2026年新型职业农民培训计划。现将培训计划予以公示，欢迎符合条件的人员报名参加。培训时间：2026年7月15日至8月15日。', '公示', '2026-05-14 14:30:00', '市农业农村局'),
('农场音乐节暨丰收节活动即将举行', '为弘扬农耕文化，丰富市民精神文化生活，农场将于2026年6月举办音乐节暨丰收节活动。届时将有田园音乐会、农产品市集、亲子采摘等多个活动，欢迎广大市民前来参加。活动地点：绿野智农农场。', '活动通知', '2026-05-13 11:00:00', '绿野智农农场');

-- ----------------------------
-- 题目表（农业知识问答）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `questions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '题目ID',
  `type` VARCHAR(20) NOT NULL DEFAULT 'single' COMMENT '题型：single单选/multiple多选/judge判断',
  `content` VARCHAR(500) NOT NULL COMMENT '题目内容',
  `category` VARCHAR(50) NOT NULL COMMENT '题目分类',
  `difficulty` VARCHAR(20) NOT NULL DEFAULT 'easy' COMMENT '难度：easy/medium/hard',
  `score` INT NOT NULL DEFAULT 10 COMMENT '分值',
  `option_a` VARCHAR(200) NULL DEFAULT NULL COMMENT '选项A',
  `option_b` VARCHAR(200) NULL DEFAULT NULL COMMENT '选项B',
  `option_c` VARCHAR(200) NULL DEFAULT NULL COMMENT '选项C',
  `option_d` VARCHAR(200) NULL DEFAULT NULL COMMENT '选项D',
  `correct_answer` VARCHAR(10) NOT NULL COMMENT '正确答案',
  `explain` VARCHAR(500) NULL DEFAULT NULL COMMENT '答案解析',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='题目表';

INSERT INTO `questions` (`type`, `content`, `category`, `difficulty`, `score`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explain`) VALUES
('single', '土壤pH值在什么范围内最适合大多数农作物生长？', '土壤肥料', 'easy', 10, '3.0-4.5', '5.5-7.0', '8.0-9.0', '9.0-10.0', 'B', '大多数作物适宜在微酸性至中性土壤中生长，pH 5.5-7.0 最佳。'),
('single', '滴灌技术相比传统漫灌最大的优点是什么？', '灌溉技术', 'easy', 10, '美观大方', '节水节肥', '成本最低', '操作最简单', 'B', '滴灌将水肥直接输送到作物根部，可节水30%-50%，节肥20%以上。'),
('judge', '无人机植保作业只能在无风天气进行。', '智慧农机', 'medium', 10, '正确', NULL, NULL, NULL, 'A', '大风会造成药液漂移，影响作业效果并污染周边环境，一般要求风速小于3级。'),
('single', '下列哪种属于物联网在农业中的典型应用？', '智慧农业', 'easy', 10, '人工巡田', '土壤墒情传感器实时监测', '人工记账', '手工采摘', 'B', '土壤墒情传感器通过无线网络实时上传数据，是农业物联网的典型应用。'),
('single', '作物缺氮的典型症状是？', '植物保护', 'medium', 10, '叶片紫红色', '老叶先黄化', '叶缘焦枯', '果实畸形', 'B', '氮素可移动，缺氮时老叶中的氮转移到新叶，老叶先出现黄化。'),
('judge', '温室大棚二氧化碳浓度越高越有利于作物增产。', '设施农业', 'medium', 10, '错误', NULL, NULL, NULL, 'A', '二氧化碳浓度需控制在适宜范围（800-1500ppm），过高反而抑制作物光合作用。'),
('single', '有机农业允许使用下列哪种物质？', '生态种植', 'hard', 10, '化学除草剂', '化学合成氮肥', '生物农药', '生长调节剂', 'C', '有机农业禁止化学合成的农药化肥，允许使用生物农药等天然来源物质。'),
('single', '农业物联网系统一般不包括以下哪个部分？', '智慧农业', 'easy', 10, '传感器', '传输网络', '云平台', '电视广告', 'D', '农业物联网由感知层（传感器）、传输层（网络）、应用层（平台）组成。');

-- ----------------------------
-- 答题记录表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `answer_records` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `type` VARCHAR(50) NULL DEFAULT NULL COMMENT '答题类型',
  `answer_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '答题时间',
  `score` INT NOT NULL DEFAULT 0 COMMENT '得分',
  `total_score` INT NOT NULL DEFAULT 0 COMMENT '总分',
  `duration` INT NULL DEFAULT NULL COMMENT '用时(秒)',
  `correct_count` INT NOT NULL DEFAULT 0 COMMENT '答对题数',
  `error_count` INT NOT NULL DEFAULT 0 COMMENT '答错题数',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_answer_time` (`answer_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='答题记录表';

-- ----------------------------
-- 答题详情表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `answer_detail` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '详情ID',
  `record_id` BIGINT NOT NULL COMMENT '答题记录ID',
  `question_id` BIGINT NULL DEFAULT NULL COMMENT '题目ID',
  `question_content` VARCHAR(500) NULL DEFAULT NULL COMMENT '题目内容快照',
  `question_type` VARCHAR(20) NULL DEFAULT NULL COMMENT '题型快照',
  `user_answer` VARCHAR(50) NULL DEFAULT NULL COMMENT '用户答案',
  `correct_answer` VARCHAR(50) NULL DEFAULT NULL COMMENT '正确答案',
  `is_correct` TINYINT NOT NULL DEFAULT 0 COMMENT '是否正确(0否/1是)',
  `score` INT NOT NULL DEFAULT 0 COMMENT '该题得分',
  `create_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_record_id` (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='答题详情表';

-- 兼容视图：AnswerRecordMapper.selectStatisticsByUserId 中 JOIN answer_details 并引用 ad.correct
CREATE OR REPLACE VIEW `answer_details` AS
SELECT d.*, d.is_correct AS `correct` FROM `answer_detail` d;

-- ----------------------------
-- 农场活动表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `farm_id` INT NULL DEFAULT NULL COMMENT '关联的农场项目ID',
  `title` VARCHAR(100) NOT NULL COMMENT '活动标题',
  `description` VARCHAR(500) NULL DEFAULT NULL COMMENT '活动描述',
  `start_time` DATETIME NOT NULL COMMENT '活动开始时间',
  `end_time` DATETIME NOT NULL COMMENT '活动结束时间',
  `location` VARCHAR(200) NOT NULL COMMENT '活动地点',
  `capacity` INT NOT NULL DEFAULT 0 COMMENT '活动容量',
  `registrations` INT NOT NULL DEFAULT 0 COMMENT '已报名人数',
  `status` VARCHAR(20) NOT NULL DEFAULT 'upcoming' COMMENT '活动状态',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '活动图片URL',
  `detail` TEXT NULL COMMENT '活动详细内容',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='农场活动表';

INSERT INTO `activities` (`farm_id`, `title`, `description`, `start_time`, `end_time`, `location`, `capacity`, `registrations`, `status`, `detail`) VALUES
(1, '智慧农业技术开放日', '参观智能温室、水肥一体化系统和无人机植保演示，体验智慧农场科技魅力。', '2026-11-05 09:00:00', '2026-11-05 16:00:00', '农场A区智能温室', 100, 32, 'upcoming', '开放日当天安排：上午智能温室参观与讲解，下午无人机植保演示与体验。参与观众可免费品尝有机农产品。'),
(1, '有机采摘节', '果园桃子、猕猴桃成熟，欢迎家庭亲子游园采摘，体验田园乐趣。', '2026-11-15 08:30:00', '2026-11-16 17:00:00', '农场D区果园', 200, 76, 'upcoming', '采摘节期间入园免门票，采摘果品按斤计价，满50元赠送农场伴手礼一份。'),
(1, '农业知识竞赛', '线上答题+现场决赛，赢取有机蔬菜大礼包。', '2026-12-01 14:00:00', '2026-12-01 17:00:00', '农场培训中心', 50, 18, 'upcoming', '竞赛题目涵盖土壤肥料、灌溉技术、智慧农业等知识，现场设一二三等奖。');

-- ----------------------------
-- 活动亮点表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `activity_highlights` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '亮点ID',
  `activity_id` INT NOT NULL COMMENT '关联的活动ID',
  `content` VARCHAR(200) NOT NULL COMMENT '亮点内容',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_activity_id` (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动亮点表';

INSERT INTO `activity_highlights` (`activity_id`, `content`) VALUES
(1, '无人机植保飞行演示'),
(1, '智能温室环境调控体验'),
(2, '亲子采摘互动'),
(2, '农场美食品鉴'),
(3, '丰厚奖品设置');

-- ----------------------------
-- 活动标签表及关联表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `activity_tags` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动标签表';

CREATE TABLE IF NOT EXISTS `activity_tag_relations` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_id` INT NOT NULL COMMENT '活动ID',
  `tag_id` INT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`id`),
  KEY `idx_activity_id` (`activity_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动标签关联表';

INSERT INTO `activity_tags` (`name`) VALUES ('科普教育'), ('亲子活动'), ('农事体验'), ('科技示范');
INSERT INTO `activity_tag_relations` (`activity_id`, `tag_id`) VALUES (1, 1), (1, 4), (2, 2), (2, 3), (3, 1);

-- ----------------------------
-- 活动报名表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `activity_registrations` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  `activity_id` INT NOT NULL COMMENT '关联的活动ID',
  `user_id` BIGINT NOT NULL COMMENT '报名用户ID',
  `registration_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  `status` INT NOT NULL DEFAULT 1 COMMENT '报名状态(1已报名/2已取消)',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_activity_user` (`activity_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动报名表';

-- ----------------------------
-- 活动投稿表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `activity_submissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '投稿ID',
  `farm_id` INT NULL DEFAULT NULL COMMENT '关联农场ID',
  `title` VARCHAR(100) NOT NULL COMMENT '活动标题',
  `description` VARCHAR(500) NULL DEFAULT NULL COMMENT '活动描述',
  `start_time` DATETIME NULL DEFAULT NULL COMMENT '活动开始时间',
  `end_time` DATETIME NULL DEFAULT NULL COMMENT '活动结束时间',
  `location` VARCHAR(200) NULL DEFAULT NULL COMMENT '活动地点',
  `capacity` INT NULL DEFAULT NULL COMMENT '活动容量',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '活动图片URL',
  `detail` TEXT NULL COMMENT '活动详细内容',
  `user_id` BIGINT NOT NULL COMMENT '投稿用户ID',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '审核状态：pending/approved/rejected',
  `review_comment` VARCHAR(500) NULL DEFAULT NULL COMMENT '审核意见',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '审核时间',
  `reviewed_by` BIGINT NULL DEFAULT NULL COMMENT '审核人ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动投稿表';

-- ----------------------------
-- 商品投稿表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `goods_submissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '投稿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `tag` VARCHAR(100) NULL DEFAULT NULL COMMENT '商品标签',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '商品图片URL',
  `price` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '价格',
  `stock` INT NULL DEFAULT NULL COMMENT '库存',
  `category` VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  `user_id` BIGINT NOT NULL COMMENT '投稿用户ID',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '审核状态：pending/approved/rejected',
  `review_comment` VARCHAR(500) NULL DEFAULT NULL COMMENT '审核意见',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '审核时间',
  `reviewed_by` BIGINT NULL DEFAULT NULL COMMENT '审核人ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品投稿表';

-- ----------------------------
-- 非遗相关表（项目遗留模块，保留以兼容旧接口）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `category_name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `category_code` VARCHAR(50) NULL DEFAULT NULL COMMENT '分类编码',
  `parent_id` BIGINT NULL DEFAULT NULL COMMENT '父分类ID',
  `level` INT NOT NULL DEFAULT 1 COMMENT '分类层级',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='分类表';

CREATE TABLE IF NOT EXISTS `heritages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '非遗项目ID',
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `level` VARCHAR(50) NULL DEFAULT NULL COMMENT '项目级别',
  `origin` VARCHAR(200) NULL DEFAULT NULL COMMENT '申报地区',
  `declare_year` INT NULL DEFAULT NULL COMMENT '申报年份',
  `inheritor` VARCHAR(100) NULL DEFAULT NULL COMMENT '传承人',
  `category_id` BIGINT NULL DEFAULT NULL COMMENT '分类ID',
  `sub_category_id` BIGINT NULL DEFAULT NULL COMMENT '子分类ID',
  `type_label` VARCHAR(50) NULL DEFAULT NULL COMMENT '类型标签',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '图片URL',
  `brief` VARCHAR(500) NULL DEFAULT NULL COMMENT '简介',
  `detail` TEXT NULL COMMENT '详细介绍',
  `value` TEXT NULL COMMENT '价值意义',
  `protection` TEXT NULL COMMENT '保护措施',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='非遗项目表';

CREATE TABLE IF NOT EXISTS `heritage_submissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '投稿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `level` VARCHAR(50) NULL DEFAULT NULL COMMENT '项目级别',
  `origin` VARCHAR(200) NULL DEFAULT NULL COMMENT '申报地区',
  `declare_year` INT NULL DEFAULT NULL COMMENT '申报年份',
  `inheritor` VARCHAR(100) NULL DEFAULT NULL COMMENT '传承人',
  `category_id` BIGINT NULL DEFAULT NULL COMMENT '分类ID',
  `sub_category_id` BIGINT NULL DEFAULT NULL COMMENT '子分类ID',
  `type_label` VARCHAR(50) NULL DEFAULT NULL COMMENT '类型标签',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT '图片URL',
  `brief` VARCHAR(500) NULL DEFAULT NULL COMMENT '简介',
  `detail` TEXT NULL COMMENT '详细介绍',
  `value` TEXT NULL COMMENT '价值意义',
  `protection` TEXT NULL COMMENT '保护措施',
  `user_id` BIGINT NOT NULL COMMENT '投稿用户ID',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '审核状态：pending/approved/rejected',
  `review_comment` VARCHAR(500) NULL DEFAULT NULL COMMENT '审核意见',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '审核时间',
  `reviewed_by` BIGINT NULL DEFAULT NULL COMMENT '审核人ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='非遗项目投稿表';
