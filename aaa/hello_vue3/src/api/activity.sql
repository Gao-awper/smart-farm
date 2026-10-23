-- 创建农场活动表
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '活动ID',
    farm_id INT NOT NULL COMMENT '关联的农场项目ID',
    title VARCHAR(100) NOT NULL COMMENT '活动标题',
    description VARCHAR(500) COMMENT '活动描述',
    start_time DATETIME NOT NULL COMMENT '活动开始时间',
    end_time DATETIME NOT NULL COMMENT '活动结束时间',
    location VARCHAR(200) NOT NULL COMMENT '活动地点',
    capacity INT NOT NULL DEFAULT 0 COMMENT '活动容量',
    registrations INT NOT NULL DEFAULT 0 COMMENT '已报名人数',
    status VARCHAR(20) NOT NULL DEFAULT '未开始' COMMENT '活动状态：未开始、进行中、已结束',
    image VARCHAR(255) COMMENT '活动图片URL',
    detail TEXT COMMENT '活动详细内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农场活动表';

-- 创建活动亮点表
CREATE TABLE IF NOT EXISTS activity_highlights (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '亮点ID',
    activity_id INT NOT NULL COMMENT '关联的活动ID',
    content VARCHAR(200) NOT NULL COMMENT '亮点内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动亮点表';

-- 创建活动报名表
CREATE TABLE IF NOT EXISTS activity_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '报名ID',
    activity_id INT NOT NULL COMMENT '关联的活动ID',
    user_id INT NOT NULL COMMENT '报名用户ID',
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
    status VARCHAR(20) NOT NULL DEFAULT '已报名' COMMENT '报名状态：已报名、已取消',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY uk_activity_user (activity_id, user_id) -- 确保一个用户只能报名一次
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动报名表';

-- 创建活动标签表
CREATE TABLE IF NOT EXISTS activity_tags (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动标签表';

-- 创建活动标签关联表
CREATE TABLE IF NOT EXISTS activity_tag_relations (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    activity_id INT NOT NULL COMMENT '关联的活动ID',
    tag_id INT NOT NULL COMMENT '关联的标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES activity_tags(id) ON DELETE CASCADE,
    UNIQUE KEY uk_activity_tag (activity_id, tag_id) -- 确保一个活动不会重复关联同一个标签
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动标签关联表';

-- 插入示例数据
INSERT INTO activities (farm_id, title, description, start_time, end_time, location, capacity, registrations, status, image, detail) VALUES
(1, '2024年新春文化庙会', '体验传统年味，品味地道年味', '2025-01-28 09:00:00', '2025-02-12 18:00:00', '北京市朝阳区市民广场', 5000, 1281, '未开始', 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=新春庙会', '新春庙会将于春节期间在市民广场举办，届时将有丰富的传统活动和美食等你来体验。'),
(2, '绿野智农技术体验工坊', '亲手体验智慧农业技术，感受科技种植魅力', '2025-02-15 10:00:00', '2025-02-15 17:00:00', '上海市浦东新区农业科技中心', 50, 35, '未开始', 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=智慧农业体验', '绿野智农技术体验工坊邀请了多位农业专家现场教学，让您亲手体验智慧农业技术的魅力。'),
(3, '端午龙舟文化节', '观龙舟竞渡，品端午粽香', '2025-06-01 08:00:00', '2025-06-03 18:00:00', '湖北省宜昌市滨江公园', 2000, 892, '未开始', 'https://via.placeholder.com/300x200/228B22/FFFFFF?text=龙舟文化节', '端午龙舟文化节将在滨江公园举办，届时将有精彩的龙舟竞渡比赛和丰富的端午文化活动。');

-- 插入活动亮点示例数据
INSERT INTO activity_highlights (activity_id, content) VALUES
(1, '传统民俗表演'),
(1, '农场技术展示'),
(1, '特色小吃品尝'),
(1, '年货大集'),
(2, '剪纸艺术体验'),
(2, '传统编织教学'),
(2, '陶瓷制作工坊'),
(2, '书法绘画展示'),
(3, '龙舟竞渡比赛'),
(3, '端午粽子制作'),
(3, '传统服饰展示'),
(3, '民俗文化讲座');