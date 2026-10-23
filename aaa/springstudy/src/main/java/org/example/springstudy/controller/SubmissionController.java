package org.example.springstudy.controller;

import org.example.springstudy.Bean.ActivitySubmission;
import org.example.springstudy.Bean.GoodsSubmission;
import org.example.springstudy.Bean.HeritageSubmission;
import org.example.springstudy.service.ActivitySubmissionService;
import org.example.springstudy.service.GoodsSubmissionService;
import org.example.springstudy.service.HeritageSubmissionService;
import org.example.springstudy.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 投稿控制器
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SubmissionController {

    private static final Logger logger = LoggerFactory.getLogger(SubmissionController.class);

    @Autowired
    private HeritageSubmissionService heritageSubmissionService;

    @Autowired
    private ActivitySubmissionService activitySubmissionService;

    @Autowired
    private GoodsSubmissionService goodsSubmissionService;

    @Autowired
    private UserService userService;

    // ===================== 公共方法：管理员权限校验 =====================
    /**
     * 管理员权限校验
     * @param reviewedBy 审核人ID
     * @return 校验结果（null表示有权限，非null表示无权限/校验失败）
     */
    private Map<String, Object> checkAdminPermission(Long reviewedBy) {
        // 1. 查询用户权限
        Map<String, Object> permissionResult = userService.getUserPermission(reviewedBy);
        if (!"success".equals(permissionResult.get("status"))) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "error");
            errorResult.put("message", "查询用户权限失败：" + permissionResult.get("message"));
            logger.warn("查询用户 {} 权限失败", reviewedBy);
            return errorResult;
        }

        // 2. 提取权限数据并判断是否为管理员
        Map<String, Object> permissionData = (Map<String, Object>) permissionResult.get("data");
        boolean isAdmin = (Boolean) permissionData.get("isAdmin");
        if (!isAdmin) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "error");
            errorResult.put("message", "权限不足，只有管理员才能审核投稿");
            logger.warn("用户 {} 尝试审核投稿，但权限不足", reviewedBy);
            return errorResult;
        }

        // 3. 有权限返回null
        return null;
    }

    /**
     * 提交农场项目
     * 注意：实际项目中需替换硬编码userId，从登录Token中解析
     */
    @PostMapping("/heritage/submit")
    public Map<String, Object> submitHeritage(@RequestBody HeritageSubmission submission) {
        logger.info("开始提交农场项目，参数: {}", submission);
        try {
            // 设置默认状态为待审核
            submission.setStatus("pending");
            // 模拟用户ID（TODO：实际项目中从Token中获取当前登录用户ID，替换硬编码）
            submission.setUserId(13L);

            Map<String, Object> result = heritageSubmissionService.submitHeritage(submission);
            logger.info("提交农场项目成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("提交农场项目失败，参数: {}", submission, e);
            throw e;
        }
    }

    /**
     * 提交活动
     * 注意：实际项目中需替换硬编码userId，从登录Token中解析
     */
    @PostMapping("/activity/submit")
    public Map<String, Object> submitActivity(@RequestBody ActivitySubmission submission) {
        logger.info("开始提交活动，参数: {}", submission);
        try {
            // 设置默认状态为待审核
            submission.setStatus("pending");
            // 模拟用户ID（TODO：实际项目中从Token中获取当前登录用户ID，替换硬编码）
            submission.setUserId(13L);

            Map<String, Object> result = activitySubmissionService.submitActivity(submission);
            logger.info("提交活动成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("提交活动失败，参数: {}", submission, e);
            throw e;
        }
    }

    /**
     * 提交商品
     * 注意：实际项目中需替换硬编码userId，从登录Token中解析
     */
    @PostMapping("/goods/submit")
    public Map<String, Object> submitGoods(@RequestBody GoodsSubmission submission) {
        logger.info("开始提交商品，参数: {}", submission);
        try {
            // 设置默认状态为待审核
            submission.setStatus("pending");
            // 模拟用户ID（TODO：实际项目中从Token中获取当前登录用户ID，替换硬编码）
            submission.setUserId(13L);

            Map<String, Object> result = goodsSubmissionService.submitGoods(submission);
            logger.info("提交商品成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("提交商品失败，参数: {}", submission, e);
            throw e;
        }
    }

    /**
     * 审核农场项目投稿
     */
    @PostMapping("/heritage/review")
    public Map<String, Object> reviewHeritage(@RequestParam Long id,
                                              @RequestParam String status,
                                              @RequestParam(required = false) String comment,
                                              @RequestParam Long reviewedBy) {
        logger.info("开始审核农场项目投稿，id: {}, status: {}, reviewedBy: {}", id, status, reviewedBy);
        try {
            // 权限校验（复用公共方法）
            Map<String, Object> permissionError = checkAdminPermission(reviewedBy);
            if (permissionError != null) {
                return permissionError;
            }

            Map<String, Object> result = heritageSubmissionService.reviewSubmission(id, status, comment, reviewedBy);
            logger.info("审核农场项目投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("审核农场项目投稿失败，id: {}, status: {}", id, status, e);
            throw e;
        }
    }

    /**
     * 审核活动投稿
     */
    @PostMapping("/activity/review")
    public Map<String, Object> reviewActivity(@RequestParam Long id,
                                              @RequestParam String status,
                                              @RequestParam(required = false) String comment,
                                              @RequestParam Long reviewedBy) {
        logger.info("开始审核活动投稿，id: {}, status: {}, reviewedBy: {}", id, status, reviewedBy);
        try {
            // 权限校验（复用公共方法）
            Map<String, Object> permissionError = checkAdminPermission(reviewedBy);
            if (permissionError != null) {
                return permissionError;
            }

            Map<String, Object> result = activitySubmissionService.reviewSubmission(id, status, comment, reviewedBy);
            logger.info("审核活动投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("审核活动投稿失败，id: {}, status: {}", id, status, e);
            throw e;
        }
    }

    /**
     * 审核商品投稿
     */
    @PostMapping("/goods/review")
    public Map<String, Object> reviewGoods(@RequestParam Long id,
                                           @RequestParam String status,
                                           @RequestParam(required = false) String comment,
                                           @RequestParam Long reviewedBy) {
        logger.info("开始审核商品投稿，id: {}, status: {}, reviewedBy: {}", id, status, reviewedBy);
        try {
            // 权限校验（复用公共方法）
            Map<String, Object> permissionError = checkAdminPermission(reviewedBy);
            if (permissionError != null) {
                return permissionError;
            }

            Map<String, Object> result = goodsSubmissionService.reviewSubmission(id, status, comment, reviewedBy);
            logger.info("审核商品投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("审核商品投稿失败，id: {}, status: {}", id, status, e);
            throw e;
        }
    }

    /**
     * 获取所有农场项目投稿
     */
    @GetMapping("/heritage/submissions")
    public Map<String, Object> getAllHeritageSubmissions() {
        logger.info("开始查询所有农场项目投稿");
        try {
            Map<String, Object> result = heritageSubmissionService.getAllSubmissions();
            logger.info("查询所有农场项目投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询所有农场项目投稿失败", e);
            throw e;
        }
    }

    /**
     * 获取所有活动投稿
     */
    @GetMapping("/activity/submissions")
    public Map<String, Object> getAllActivitySubmissions() {
        logger.info("开始查询所有活动投稿");
        try {
            Map<String, Object> result = activitySubmissionService.getAllSubmissions();
            logger.info("查询所有活动投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询所有活动投稿失败", e);
            throw e;
        }
    }

    /**
     * 获取所有商品投稿
     */
    @GetMapping("/goods/submissions")
    public Map<String, Object> getAllGoodsSubmissions() {
        logger.info("开始查询所有商品投稿");
        try {
            Map<String, Object> result = goodsSubmissionService.getAllSubmissions();
            logger.info("查询所有商品投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询所有商品投稿失败", e);
            throw e;
        }
    }

    /**
     * 获取农场项目投稿详情
     */
    @GetMapping("/heritage/submission/{id}")
    public Map<String, Object> getHeritageSubmissionById(@PathVariable Long id) {
        logger.info("开始查询农场项目投稿详情，id: {}", id);
        try {
            Map<String, Object> result = heritageSubmissionService.getSubmissionById(id);
            logger.info("查询农场项目投稿详情成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询农场项目投稿详情失败，id: {}", id, e);
            throw e;
        }
    }

    /**
     * 获取活动投稿详情
     */
    @GetMapping("/activity/submission/{id}")
    public Map<String, Object> getActivitySubmissionById(@PathVariable Long id) {
        logger.info("开始查询活动投稿详情，id: {}", id);
        try {
            Map<String, Object> result = activitySubmissionService.getSubmissionById(id);
            logger.info("查询活动投稿详情成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询活动投稿详情失败，id: {}", id, e);
            throw e;
        }
    }

    /**
     * 获取商品投稿详情
     */
    @GetMapping("/goods/submission/{id}")
    public Map<String, Object> getGoodsSubmissionById(@PathVariable Long id) {
        logger.info("开始查询商品投稿详情，id: {}", id);
        try {
            Map<String, Object> result = goodsSubmissionService.getSubmissionById(id);
            logger.info("查询商品投稿详情成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询商品投稿详情失败，id: {}", id, e);
            throw e;
        }
    }

    /**
     * 获取用户的农场项目投稿
     */
    @GetMapping("/heritage/submissions/user/{userId}")
    public Map<String, Object> getHeritageSubmissionsByUserId(@PathVariable Long userId) {
        logger.info("开始查询用户的农场项目投稿，userId: {}", userId);
        try {
            Map<String, Object> result = heritageSubmissionService.getSubmissionsByUserId(userId);
            logger.info("查询用户的农场项目投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询用户的农场项目投稿失败，userId: {}", userId, e);
            throw e;
        }
    }

    /**
     * 获取用户的活动投稿
     */
    @GetMapping("/activity/submissions/user/{userId}")
    public Map<String, Object> getActivitySubmissionsByUserId(@PathVariable Long userId) {
        logger.info("开始查询用户的活动投稿，userId: {}", userId);
        try {
            Map<String, Object> result = activitySubmissionService.getSubmissionsByUserId(userId);
            logger.info("查询用户的活动投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询用户的活动投稿失败，userId: {}", userId, e);
            throw e;
        }
    }

    /**
     * 获取用户的商品投稿
     */
    @GetMapping("/goods/submissions/user/{userId}")
    public Map<String, Object> getGoodsSubmissionsByUserId(@PathVariable Long userId) {
        logger.info("开始查询用户的商品投稿，userId: {}", userId);
        try {
            Map<String, Object> result = goodsSubmissionService.getSubmissionsByUserId(userId);
            logger.info("查询用户的商品投稿成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询用户的商品投稿失败，userId: {}", userId, e);
            throw e;
        }
    }

    /**
     * 获取所有审核列表（统一接口）
     */
    @GetMapping("/reviews")
    public Map<String, Object> getAllReviews(@RequestParam(required = false) String status) {
        logger.info("开始查询所有审核列表，status: {}", status);
        try {
            Map<String, Object> result = new HashMap<>();
            List<Map<String, Object>> allReviews = new ArrayList<>();

            // 查询农场项目投稿
            Map<String, Object> heritageResult = heritageSubmissionService.getAllSubmissions();
            if ("success".equals(heritageResult.get("status"))) {
                List<HeritageSubmission> heritageSubmissions = (List<HeritageSubmission>) heritageResult.get("data");
                for (HeritageSubmission submission : heritageSubmissions) {
                    if (status == null || status.isEmpty() || status.equals(submission.getStatus())) {
                        Map<String, Object> reviewItem = new HashMap<>();
                        reviewItem.put("id", submission.getId());
                        reviewItem.put("type", "heritage");
                        reviewItem.put("name", submission.getName());
                        reviewItem.put("userId", submission.getUserId());
                        reviewItem.put("submitTime", submission.getCreatedAt());
                        reviewItem.put("status", submission.getStatus());
                        reviewItem.put("reviewComment", submission.getReviewComment());
                        reviewItem.put("reviewedBy", submission.getReviewedBy());
                        reviewItem.put("reviewedAt", submission.getReviewedAt());
                        reviewItem.put("level", submission.getLevel());
                        reviewItem.put("origin", submission.getOrigin());
                        reviewItem.put("declareYear", submission.getDeclareYear());
                        reviewItem.put("inheritor", submission.getInheritor());
                        reviewItem.put("typeLabel", submission.getTypeLabel());
                        reviewItem.put("image", submission.getImage());
                        reviewItem.put("brief", submission.getBrief());
                        reviewItem.put("detail", submission.getDetail());
                        reviewItem.put("value", submission.getValue());
                        reviewItem.put("protection", submission.getProtection());
                        allReviews.add(reviewItem);
                    }
                }
            }

            // 查询活动投稿
            Map<String, Object> activityResult = activitySubmissionService.getAllSubmissions();
            if ("success".equals(activityResult.get("status"))) {
                List<ActivitySubmission> activitySubmissions = (List<ActivitySubmission>) activityResult.get("data");
                for (ActivitySubmission submission : activitySubmissions) {
                    if (status == null || status.isEmpty() || status.equals(submission.getStatus())) {
                        Map<String, Object> reviewItem = new HashMap<>();
                        reviewItem.put("id", submission.getId());
                        reviewItem.put("type", "activity");
                        reviewItem.put("name", submission.getTitle());
                        reviewItem.put("userId", submission.getUserId());
                        reviewItem.put("submitTime", submission.getCreatedAt());
                        reviewItem.put("status", submission.getStatus());
                        reviewItem.put("reviewComment", submission.getReviewComment());
                        reviewItem.put("reviewedBy", submission.getReviewedBy());
                        reviewItem.put("reviewedAt", submission.getReviewedAt());
                        reviewItem.put("description", submission.getDescription());
                        reviewItem.put("startTime", submission.getStartTime());
                        reviewItem.put("endTime", submission.getEndTime());
                        reviewItem.put("location", submission.getLocation());
                        reviewItem.put("capacity", submission.getCapacity());
                        reviewItem.put("image", submission.getImage());
                        reviewItem.put("detail", submission.getDetail());
                        allReviews.add(reviewItem);
                    }
                }
            }

            // 查询商品投稿
            Map<String, Object> goodsResult = goodsSubmissionService.getAllSubmissions();
            if ("success".equals(goodsResult.get("status"))) {
                List<GoodsSubmission> goodsSubmissions = (List<GoodsSubmission>) goodsResult.get("data");
                for (GoodsSubmission submission : goodsSubmissions) {
                    if (status == null || status.isEmpty() || status.equals(submission.getStatus())) {
                        Map<String, Object> reviewItem = new HashMap<>();
                        reviewItem.put("id", submission.getId());
                        reviewItem.put("type", "goods");
                        reviewItem.put("name", submission.getName());
                        reviewItem.put("userId", submission.getUserId());
                        reviewItem.put("submitTime", submission.getCreatedAt());
                        reviewItem.put("status", submission.getStatus());
                        reviewItem.put("reviewComment", submission.getReviewComment());
                        reviewItem.put("reviewedBy", submission.getReviewedBy());
                        reviewItem.put("reviewedAt", submission.getReviewedAt());
                        reviewItem.put("tag", submission.getTag());
                        reviewItem.put("price", submission.getPrice());
                        reviewItem.put("stock", submission.getStock());
                        reviewItem.put("category", submission.getCategory());
                        reviewItem.put("image", submission.getImage());
                        allReviews.add(reviewItem);
                    }
                }
            }

            result.put("status", "success");
            result.put("message", "查询审核列表成功");
            result.put("data", allReviews);
            logger.info("查询所有审核列表成功，结果数量: {}", allReviews.size());
            return result;
        } catch (Exception e) {
            logger.error("查询所有审核列表失败", e);
            throw e;
        }
    }

    /**
     * 通过审核（统一接口）
     */
    @PostMapping("/reviews/{id}/approve")
    public Map<String, Object> approveReview(@PathVariable Long id,
                                             @RequestParam String type,
                                             @RequestParam Long reviewedBy,
                                             @RequestParam(required = false) String comment) {
        logger.info("开始通过审核，id: {}, type: {}, reviewedBy: {}", id, type, reviewedBy);
        try {
            // 权限校验（补充缺失的权限检查）
            Map<String, Object> permissionError = checkAdminPermission(reviewedBy);
            if (permissionError != null) {
                return permissionError;
            }

            Map<String, Object> result;
            switch (type) {
                case "heritage":
                    result = heritageSubmissionService.reviewSubmission(id, "approved", comment, reviewedBy);
                    break;
                case "activity":
                    result = activitySubmissionService.reviewSubmission(id, "approved", comment, reviewedBy);
                    break;
                case "goods":
                    result = goodsSubmissionService.reviewSubmission(id, "approved", comment, reviewedBy);
                    break;
                default:
                    result = new HashMap<>();
                    result.put("status", "error");
                    result.put("message", "无效的类型");
                    return result;
            }
            logger.info("通过审核成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("通过审核失败，id: {}, type: {}", id, type, e);
            throw e;
        }
    }

    /**
     * 拒绝审核（统一接口）
     */
    @PostMapping("/reviews/{id}/reject")
    public Map<String, Object> rejectReview(@PathVariable Long id,
                                            @RequestParam String type,
                                            @RequestParam Long reviewedBy,
                                            @RequestParam(required = false) String comment) {
        logger.info("开始拒绝审核，id: {}, type: {}, reviewedBy: {}", id, type, reviewedBy);
        try {
            // 权限校验（补充缺失的权限检查）
            Map<String, Object> permissionError = checkAdminPermission(reviewedBy);
            if (permissionError != null) {
                return permissionError;
            }

            Map<String, Object> result;
            switch (type) {
                case "heritage":
                    result = heritageSubmissionService.reviewSubmission(id, "rejected", comment, reviewedBy);
                    break;
                case "activity":
                    result = activitySubmissionService.reviewSubmission(id, "rejected", comment, reviewedBy);
                    break;
                case "goods":
                    result = goodsSubmissionService.reviewSubmission(id, "rejected", comment, reviewedBy);
                    break;
                default:
                    result = new HashMap<>();
                    result.put("status", "error");
                    result.put("message", "无效的类型");
                    return result;
            }
            logger.info("拒绝审核成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("拒绝审核失败，id: {}, type: {}", id, type, e);
            throw e;
        }
    }

    /**
     * 获取审核详情（统一接口）
     */
    @GetMapping("/reviews/{id}")
    public Map<String, Object> getReviewDetail(@PathVariable Long id, @RequestParam String type) {
        logger.info("开始查询审核详情，id: {}, type: {}", id, type);
        try {
            Map<String, Object> result;
            switch (type) {
                case "heritage":
                    result = heritageSubmissionService.getSubmissionById(id);
                    break;
                case "activity":
                    result = activitySubmissionService.getSubmissionById(id);
                    break;
                case "goods":
                    result = goodsSubmissionService.getSubmissionById(id);
                    break;
                default:
                    result = new HashMap<>();
                    result.put("status", "error");
                    result.put("message", "无效的类型");
                    return result;
            }
            logger.info("查询审核详情成功，结果: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("查询审核详情失败，id: {}, type: {}", id, type, e);
            throw e;
        }
    }
}