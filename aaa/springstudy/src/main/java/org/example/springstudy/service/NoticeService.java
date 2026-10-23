package org.example.springstudy.service;

import org.example.springstudy.Bean.Notice;

import java.util.List;

/**
 * 公告Service接口
 */
public interface NoticeService {

    /**
     * 获取所有公告列表
     * @return 公告列表
     */
    List<Notice> getAllNotices();

    /**
     * 根据ID获取公告详情
     * @param id 公告ID
     * @return 公告详情
     */
    Notice getNoticeById(Long id);

    /**
     * 根据类型获取公告列表
     * @param type 公告类型
     * @return 公告列表
     */
    List<Notice> getNoticesByType(String type);

    /**
     * 创建公告
     * @param notice 公告对象
     * @return 公告ID
     */
    Long createNotice(Notice notice);

    /**
     * 更新公告
     * @param notice 公告对象
     * @return 是否更新成功
     */
    boolean updateNotice(Notice notice);

    /**
     * 删除公告
     * @param id 公告ID
     * @return 是否删除成功
     */
    boolean deleteNotice(Long id);
}