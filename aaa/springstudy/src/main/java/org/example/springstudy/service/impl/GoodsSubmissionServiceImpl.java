package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Goods;
import org.example.springstudy.Bean.GoodsSubmission;
import org.example.springstudy.Mapper.GoodsMapper;
import org.example.springstudy.Mapper.GoodsSubmissionMapper;
import org.example.springstudy.service.GoodsSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商品投稿服务实现类
 */
@Service
public class GoodsSubmissionServiceImpl implements GoodsSubmissionService {

    @Autowired
    private GoodsSubmissionMapper goodsSubmissionMapper;

    @Autowired
    private GoodsMapper goodsMapper;

    @Override
    public Map<String, Object> submitGoods(GoodsSubmission submission) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 设置默认值
            submission.setStatus("pending");
            submission.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            submission.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            
            int insertResult = goodsSubmissionMapper.insert(submission);
            if (insertResult > 0) {
                result.put("status", "success");
                result.put("message", "提交商品成功，等待审核");
                result.put("data", submission);
            } else {
                result.put("status", "error");
                result.put("message", "提交商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "提交商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getAllSubmissions() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<GoodsSubmission> submissions = goodsSubmissionMapper.selectAll();
            result.put("status", "success");
            result.put("message", "查询投稿列表成功");
            result.put("data", submissions);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询投稿列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getSubmissionsByUserId(Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<GoodsSubmission> submissions = goodsSubmissionMapper.selectByUserId(userId);
            result.put("status", "success");
            result.put("message", "查询用户投稿列表成功");
            result.put("data", submissions);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询用户投稿列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getSubmissionById(Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            GoodsSubmission submission = goodsSubmissionMapper.selectById(id);
            if (submission != null) {
                result.put("status", "success");
                result.put("message", "查询投稿详情成功");
                result.put("data", submission);
            } else {
                result.put("status", "error");
                result.put("message", "投稿不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询投稿详情失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> reviewSubmission(Long id, String status, String comment, Long reviewedBy) {
        Map<String, Object> result = new HashMap<>();
        try {
            GoodsSubmission submission = goodsSubmissionMapper.selectById(id);
            if (submission != null) {
                submission.setStatus(status);
                submission.setReviewComment(comment);
                submission.setReviewedBy(reviewedBy);
                submission.setReviewedAt(new Timestamp(System.currentTimeMillis()));
                submission.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                
                int updateResult = goodsSubmissionMapper.updateStatus(submission);
                if (updateResult > 0) {
                    if ("approved".equals(status)) {
                        Goods goods = new Goods();
                        goods.setName(submission.getName());
                        goods.setTag(submission.getTag());
                        goods.setImage(submission.getImage());
                        goods.setPrice(submission.getPrice());
                        goods.setSales(0);
                        goods.setCategory(submission.getCategory());
                        goods.setStock(submission.getStock());
                        
                        goodsMapper.insert(goods);
                    }
                    result.put("status", "success");
                    result.put("message", "审核商品投稿成功");
                    result.put("data", submission);
                } else {
                    result.put("status", "error");
                    result.put("message", "审核商品投稿失败");
                }
            } else {
                result.put("status", "error");
                result.put("message", "投稿不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "审核商品投稿失败：" + e.getMessage());
        }
        return result;
    }
}