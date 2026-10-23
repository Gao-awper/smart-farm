package org.example.springstudy.controller;

import org.example.springstudy.Bean.Notice;
import org.example.springstudy.service.NoticeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公告Controller
 */
@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class NoticeController {

    private static final Logger logger = LoggerFactory.getLogger(NoticeController.class);

    @Autowired
    private NoticeService noticeService;

    /**
     * 获取所有公告列表
     * @return 公告列表
     */
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        logger.info("获取所有公告列表");
        List<Notice> notices = noticeService.getAllNotices();
        logger.info("成功获取{}个公告", notices.size());
        return ResponseEntity.ok(notices);
    }

    /**
     * 根据ID获取公告详情
     * @param id 公告ID
     * @return 公告详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        logger.info("根据ID获取公告详情，ID: {}", id);
        Notice notice = noticeService.getNoticeById(id);
        if (notice == null) {
            logger.warn("公告不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("成功获取公告详情，ID: {}", id);
        return ResponseEntity.ok(notice);
    }

    /**
     * 根据类型获取公告列表
     * @param type 公告类型
     * @return 公告列表
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notice>> getNoticesByType(@PathVariable String type) {
        logger.info("根据类型获取公告列表，类型: {}", type);
        List<Notice> notices = noticeService.getNoticesByType(type);
        logger.info("成功获取{}个{}类型的公告", notices.size(), type);
        return ResponseEntity.ok(notices);
    }

    /**
     * 创建公告（管理员功能）
     * @param notice 公告对象
     * @return 创建的公告
     */
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        logger.info("创建公告，标题: {}", notice.getTitle());
        Long noticeId = noticeService.createNotice(notice);
        Notice createdNotice = noticeService.getNoticeById(noticeId);
        logger.info("成功创建公告，ID: {}", noticeId);
        return ResponseEntity.ok(createdNotice);
    }

    /**
     * 更新公告（管理员功能）
     * @param id 公告ID
     * @param notice 公告对象
     * @return 更新后的公告
     */
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        logger.info("更新公告，ID: {}", id);
        notice.setId(id);
        boolean updated = noticeService.updateNotice(notice);
        if (!updated) {
            logger.warn("公告不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        Notice updatedNotice = noticeService.getNoticeById(id);
        logger.info("成功更新公告，ID: {}", id);
        return ResponseEntity.ok(updatedNotice);
    }

    /**
     * 删除公告（管理员功能）
     * @param id 公告ID
     * @return 是否删除成功
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        logger.info("删除公告，ID: {}", id);
        boolean deleted = noticeService.deleteNotice(id);
        if (!deleted) {
            logger.warn("公告不存在，ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("成功删除公告，ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}