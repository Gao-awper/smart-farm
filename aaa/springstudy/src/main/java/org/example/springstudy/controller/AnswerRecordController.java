package org.example.springstudy.controller;

import org.example.springstudy.Bean.AnswerRecord;
import org.example.springstudy.service.AnswerRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import org.example.springstudy.Bean.AnswerDetail;

/**
 * 答题记录控制器
 */
@RestController
@RequestMapping("/api/answer-records")
@CrossOrigin(origins = "*")
public class AnswerRecordController {

    @Autowired
    private AnswerRecordService answerRecordService;

    // ================ 第一步：先定义 ALL 精准路由（避免被模糊路由拦截） ================
    /**
     * 检查用户每日答题限制
     * @param userId 用户ID
     * @param type 答题类型
     * @return 检查结果
     */
    @GetMapping("/daily-check")
    public Map<String, Object> checkDailyAnswerLimit(@RequestParam Long userId, @RequestParam String type) {
        return answerRecordService.checkDailyAnswerLimit(userId, type);
    }


    /**
     * 获取答题排行榜
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @return 排行榜数据
     */
    @GetMapping("/ranking")
    public Map<String, Object> getAnswerRanking(@RequestParam String type, @RequestParam(required = false, defaultValue = "heritage") String answerType) {
        return answerRecordService.getAnswerRanking(type, answerType);
    }

    /**
     * 根据用户ID获取答题记录列表
     * @param userId 用户ID
     * @return 答题记录列表
     */
    @GetMapping("/user/{id}")
    public Map<String, Object> getAnswerRecordsByUserId(@PathVariable("id") Long userId) {
        return answerRecordService.getAnswerRecordsByUserId(userId);
    }

    /**
     * 根据记录ID获取答题记录详情
     * @param recordId 记录ID
     * @return 答题记录详情
     */
    @GetMapping("/{id}")
    public Map<String, Object> getAnswerRecordById(@PathVariable("id") Long recordId) {
        return answerRecordService.getAnswerRecordById(recordId);
    }

    /**
     * 获取用户答题统计信息
     * @param userId 用户ID
     * @return 统计信息
     */
    @GetMapping("/statistics/user/{id}")
    public Map<String, Object> getAnswerStatisticsByUserId(@PathVariable("id") Long userId) {
        return answerRecordService.getAnswerStatisticsByUserId(userId);
    }

    /**
     * 获取用户答题排名
     * @param userId 用户ID
     * @param type 排行类型：daily-日榜 weekly-周榜 monthly-月榜
     * @param answerType 答题类型：farm-农场知识 agriculture-农业技术 technology-智慧农业
     * @return 用户排名信息
     */
    @GetMapping("/ranking/user/{id}")
    public Map<String, Object> getUserAnswerRanking(@PathVariable("id") Long userId, @RequestParam(required = false, defaultValue = "daily") String type, @RequestParam(required = false, defaultValue = "heritage") String answerType) {
        return answerRecordService.getUserAnswerRanking(userId, type, answerType);
    }

    // ================ 第三步：最后定义 POST 等其他请求方式的接口 ================
    /**
     * 创建答题记录（包含详情）
     * @param request 答题记录和详情信息
     * @return 操作结果
     */
    @PostMapping
    public Map<String, Object> createAnswerRecord(@RequestBody Map<String, Object> request) {
        // 参数有效性检查
        if (request == null) {
            return Map.of(
                    "success", false,
                    "message", "请求参数不能为空"
            );
        }

        // 检查record字段
        Map<String, Object> recordMap = (Map<String, Object>) request.get("record");
        if (recordMap == null || recordMap.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "答题记录信息不能为空"
            );
        }

        // 检查details字段
        List<Map<String, Object>> detailsList = (List<Map<String, Object>>) request.get("details");
        if (detailsList == null || detailsList.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "答题详情信息不能为空"
            );
        }

        AnswerRecord answerRecord = new AnswerRecord();
        try {
            // 绑定答题记录参数 - 增强类型转换处理
            answerRecord.setUserId(Long.parseLong(recordMap.get("userId").toString()));
            answerRecord.setType(recordMap.get("type").toString());
            answerRecord.setAnswerTime(java.time.LocalDateTime.now());
            answerRecord.setScore(Integer.parseInt(recordMap.get("score").toString()));
            answerRecord.setTotalScore(Integer.parseInt(recordMap.get("totalScore").toString()));
            answerRecord.setDuration(Integer.parseInt(recordMap.get("duration").toString()));
            answerRecord.setCorrectCount(Integer.parseInt(recordMap.get("correctCount").toString()));
            answerRecord.setErrorCount(Integer.parseInt(recordMap.get("errorCount").toString()));

            // 转换答题详情
            List<AnswerDetail> answerDetails = detailsList.stream().map(detailMap -> {
                if (detailMap == null || detailMap.isEmpty()) {
                    throw new IllegalArgumentException("答题详情项不能为空");
                }
                AnswerDetail detail = new AnswerDetail();
                detail.setQuestionId(Long.valueOf(detailMap.get("questionId").toString()));
                detail.setQuestionContent((String) detailMap.get("questionContent"));
                // 修复类型转换问题，questionType可能是数字类型，需要转换为字符串
                detail.setQuestionType(detailMap.get("questionType").toString());
                detail.setUserAnswer((String) detailMap.get("userAnswer"));
                detail.setCorrectAnswer((String) detailMap.get("correctAnswer"));
                detail.setCorrect(Boolean.valueOf(detailMap.get("isCorrect").toString()));
                detail.setScore(Integer.valueOf(detailMap.get("score").toString()));
                return detail;
            }).toList();

            return answerRecordService.createAnswerRecord(answerRecord, answerDetails);
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "message", "参数解析错误: " + e.getMessage(),
                    "error", e.toString()
            );
        }
    }
}