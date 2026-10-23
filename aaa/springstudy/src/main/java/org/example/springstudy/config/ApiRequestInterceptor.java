package org.example.springstudy.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import java.util.UUID;

import java.util.Enumeration;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * API请求日志拦截器
 * 用于记录前端访问API的详细信息（支持安全打印POST/PUT请求体）
 */
public class ApiRequestInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ApiRequestInterceptor.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 请求处理前调用
     * @param request 请求对象
     * @param response 响应对象
     * @param handler 处理程序
     * @return 是否继续执行
     * @throws Exception 异常
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 生成并设置traceId（用于日志追踪）
        String traceId = UUID.randomUUID().toString().replace("-", "");
        request.setAttribute("traceId", traceId);
        // 记录请求开始时间
        LocalDateTime startTime = LocalDateTime.now();
        request.setAttribute("startTime", startTime);

        // 获取请求基本信息
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String clientIp = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        // 记录请求基本信息（包含traceId）
        logger.info("API Request Start | TraceId: {} | Time: {} | Method: {} | URI: {} | IP: {} | User-Agent: {}",
                traceId, formatter.format(startTime), method, uri, clientIp, userAgent);

        // 记录请求头信息
        logRequestHeaders(request);

        // 记录请求参数信息（优化：支持安全打印POST/PUT请求体）
        logRequestParams(request);

        return true; // 继续执行
    }

    /**
     * 请求处理后调用
     * @param request 请求对象
     * @param response 响应对象
     * @param handler 处理程序
     * @param modelAndView 模型和视图
     * @throws Exception 异常
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 记录响应信息
        String traceId = (String) request.getAttribute("traceId");
        logger.debug("[{}] API Request Handled | Response Status: {}", traceId, response.getStatus());
    }

    /**
     * 整个请求完成后调用
     * @param request 请求对象
     * @param response 响应对象
     * @param handler 处理程序
     * @param ex 异常
     * @throws Exception 异常
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 获取请求开始时间和traceId
        LocalDateTime startTime = (LocalDateTime) request.getAttribute("startTime");
        String traceId = (String) request.getAttribute("traceId");
        LocalDateTime endTime = LocalDateTime.now();

        // 计算请求处理时间
        long duration = java.time.Duration.between(startTime, endTime).toMillis();

        // 获取请求和响应信息
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int statusCode = response.getStatus();

        // 记录响应体信息
        logResponseBody(request, response, traceId);

        // 记录请求完成信息（包含traceId）
        if (ex != null) {
            logger.error("API Request End | TraceId: {} | Time: {} | Method: {} | URI: {} | Status: {} | Duration: {}ms | Exception: {}",
                    traceId, formatter.format(endTime), method, uri, statusCode, duration, ex.getMessage(), ex);
        } else {
            logger.info("API Request End | TraceId: {} | Time: {} | Method: {} | URI: {} | Status: {} | Duration: {}ms | Exception: None",
                    traceId, formatter.format(endTime), method, uri, statusCode, duration);
        }
    }

    /**
     * 获取客户端真实IP地址
     * @param request 请求对象
     * @return 客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && ip.length() > 0 && !"unknown".equalsIgnoreCase(ip)) {
            // 如果有多个代理，X-Forwarded-For格式为：client, proxy1, proxy2
            // 取第一个IP地址
            if (ip.contains(",")) {
                ip = ip.split(",")[0].trim();
            }
        } else {
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
        }
        return ip;
    }

    /**
     * 记录请求头信息
     * @param request 请求对象
     */
    private void logRequestHeaders(HttpServletRequest request) {
        StringBuilder headers = new StringBuilder("Request Headers: {");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            // 过滤敏感信息
            if (headerName.toLowerCase().contains("authorization") || headerName.toLowerCase().contains("token")) {
                headers.append(headerName).append(": [REDACTED], ");
            } else {
                headers.append(headerName).append(": '").append(headerValue).append("', ");
            }
        }
        if (headers.length() > 18) { // 如果有请求头（"Request Headers: {"长度为18）
            headers.setLength(headers.length() - 2); // 移除最后一个逗号和空格
        }
        headers.append("}");
        logger.debug(headers.toString());
    }

    /**
     * 记录请求参数信息（优化：安全打印POST/PUT请求体）
     * @param request 请求对象
     */
    private void logRequestParams(HttpServletRequest request) {
        String method = request.getMethod();
        // GET请求参数
        if (method.equalsIgnoreCase("GET")) {
            Map<String, String[]> params = request.getParameterMap();
            if (!params.isEmpty()) {
                StringBuilder getParams = new StringBuilder("Request Params: {");
                for (Map.Entry<String, String[]> entry : params.entrySet()) {
                    String paramName = entry.getKey();
                    String[] paramValues = entry.getValue();
                    getParams.append(paramName).append(": [");
                    for (int i = 0; i < paramValues.length; i++) {
                        String paramValue = paramValues[i];
                        // 过滤敏感参数
                        if (isSensitiveParam(paramName)) {
                            paramValue = "[REDACTED]";
                        }
                        getParams.append("'").append(paramValue).append("'");
                        if (i < paramValues.length - 1) {
                            getParams.append(", ");
                        }
                    }
                    getParams.append("], ");
                }
                getParams.setLength(getParams.length() - 2); // 移除最后一个逗号和空格
                getParams.append("}");
                logger.debug(getParams.toString());
            }
        } else if (method.equalsIgnoreCase("POST") || method.equalsIgnoreCase("PUT") || method.equalsIgnoreCase("DELETE")) {
            // POST/PUT/DELETE请求体：通过ContentCachingRequestWrapper安全读取
            logRequestBody(request);
        }
    }

    /**
     * 安全打印请求体
     * @param request 请求对象
     */
    private void logRequestBody(HttpServletRequest request) {
        // 判断请求是否被ContentCachingRequestWrapper包装
        if (!(request instanceof ContentCachingRequestWrapper)) {
            logger.debug("Request Body: [Request body logging skipped (request not wrapped with ContentCachingRequestWrapper)]");
            return;
        }

        // 强制转换为包装后的请求对象
        ContentCachingRequestWrapper wrappedRequest = (ContentCachingRequestWrapper) request;
        byte[] requestBodyBytes = wrappedRequest.getContentAsByteArray();

        // 无请求体时直接返回
        if (requestBodyBytes.length == 0) {
            logger.debug("Request Body: [Empty]");
            return;
        }

        // 转换为字符串（默认UTF-8编码，可根据请求头调整）
        String requestBody = new String(requestBodyBytes, java.nio.charset.StandardCharsets.UTF_8);

        // 过滤敏感信息（简单示例：可根据实际需求扩展，如JSON解析后过滤）
        String filteredRequestBody = filterSensitiveContent(requestBody);

        logger.debug("Request Body: {}", filteredRequestBody);
    }

    /**
     * 判断是否为敏感参数
     * @param paramName 参数名
     * @return 是否为敏感参数
     */
    private boolean isSensitiveParam(String paramName) {
        String lowerParamName = paramName.toLowerCase();
        String[] sensitiveKeywords = {"password", "pwd", "passwd", "secret", "token", "authorization", "card", "idcard", "身份证", "密码"};
        for (String keyword : sensitiveKeywords) {
            if (lowerParamName.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 过滤请求体中的敏感内容（简单字符串替换，复杂场景建议用JSON解析）
     * @param requestBody 原始请求体
     * @return 过滤后的请求体
     */
    private String filterSensitiveContent(String requestBody) {
        String lowerRequestBody = requestBody.toLowerCase();
        String[] sensitiveKeywords = {"password", "pwd", "passwd", "secret", "token", "authorization", "card", "idcard", "身份证", "密码"};
        String filteredBody = requestBody;

        // 简单字符串匹配替换（JSON格式建议用Jackson解析后替换）
        for (String keyword : sensitiveKeywords) {
            // 匹配 "password":"xxx" 或 "password": "xxx" 格式（简单场景）
            filteredBody = filteredBody.replaceAll("(\"" + keyword + "\":\\s*\")([^\"]*)(\"?)", "$1[REDACTED]$3");
            filteredBody = filteredBody.replaceAll("('" + keyword + "':\\s*')([^']*)('?)", "$1[REDACTED]$3");
        }

        return filteredBody;
    }
    
    /**
     * 记录响应体信息
     * @param request 请求对象
     * @param response 响应对象
     * @param traceId 跟踪ID
     */
    private void logResponseBody(HttpServletRequest request, HttpServletResponse response, String traceId) {
        // 判断响应是否被ContentCachingResponseWrapper包装
        if (!(response instanceof ContentCachingResponseWrapper)) {
            logger.debug("[{}] Response Body: [Response body logging skipped (response not wrapped with ContentCachingResponseWrapper)]", traceId);
            return;
        }

        // 强制转换为包装后的响应对象
        ContentCachingResponseWrapper wrappedResponse = (ContentCachingResponseWrapper) response;
        byte[] responseBodyBytes = wrappedResponse.getContentAsByteArray();

        // 无响应体时直接返回
        if (responseBodyBytes.length == 0) {
            logger.debug("[{}] Response Body: [Empty]", traceId);
            return;
        }

        // 转换为字符串（默认UTF-8编码，可根据响应头调整）
        String responseBody = new String(responseBodyBytes, java.nio.charset.StandardCharsets.UTF_8);
        
        // 限制响应体日志长度（避免过大的响应体导致日志文件过大）
        if (responseBody.length() > 1000) {
            responseBody = responseBody.substring(0, 1000) + "... [TRUNCATED]";
        }

        logger.debug("[{}] Response Body: {}", traceId, responseBody);
    }
}