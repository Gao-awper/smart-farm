package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Notice;
import org.example.springstudy.Mapper.NoticeMapper;
import org.example.springstudy.service.NoticeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 公告Service实现类
 */
@Service
public class NoticeServiceImpl implements NoticeService {

    private static final Logger logger = LoggerFactory.getLogger(NoticeServiceImpl.class);

    @Autowired
    private NoticeMapper noticeMapper;

    /**
     * 获取所有公告列表
     * @return 公告列表
     */
    @Override
    public List<Notice> getAllNotices() {
        logger.info("查询所有公告列表");
        List<Notice> notices = noticeMapper.selectAll();
        logger.info("成功查询到{}个公告", notices.size());
        return notices;
    }

    /**
     * 根据ID获取公告详情
     * @param id 公告ID
     * @return 公告详情
     */
    @Override
    public Notice getNoticeById(Long id) {
        logger.info("根据ID查询公告详情，ID: {}", id);
        Notice notice = noticeMapper.selectById(id);
        if (notice != null) {
            logger.info("成功查询到公告，标题: {}", notice.getTitle());
        } else {
            logger.warn("未查询到公告，ID: {}", id);
        }
        return notice;
    }

    /**
     * 根据类型获取公告列表
     * @param type 公告类型
     * @return 公告列表
     */
    @Override
    public List<Notice> getNoticesByType(String type) {
        logger.info("根据类型查询公告列表，类型: {}", type);
        List<Notice> notices = noticeMapper.selectByType(type);
        logger.info("成功查询到{}个{}类型的公告", notices.size(), type);
        return notices;
    }

    /**
     * 创建公告
     * @param notice 公告对象
     * @return 公告ID
     */
    @Override
    public Long createNotice(Notice notice) {
        logger.info("创建公告，标题: {}", notice.getTitle());
        noticeMapper.insertNotice(notice);
        logger.info("成功创建公告，ID: {}", notice.getId());
        return notice.getId();
    }

    /**
     * 更新公告
     * @param notice 公告对象
     * @return 是否更新成功
     */
    @Override
    public boolean updateNotice(Notice notice) {
        logger.info("更新公告，ID: {}, 标题: {}", notice.getId(), notice.getTitle());
        int result = noticeMapper.updateNotice(notice);
        boolean success = result > 0;
        logger.info("更新公告结果，ID: {}, 成功: {}", notice.getId(), success);
        return success;
    }

    /**
     * 删除公告
     * @param id 公告ID
     * @return 是否删除成功
     */
    @Override
    public boolean deleteNotice(Long id) {
        logger.info("删除公告，ID: {}", id);
        int result = noticeMapper.deleteNotice(id);
        boolean success = result > 0;
        logger.info("删除公告结果，ID: {}, 成功: {}", id, success);
        return success;
    }
}