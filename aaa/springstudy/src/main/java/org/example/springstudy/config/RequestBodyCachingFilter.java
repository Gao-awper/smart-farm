package org.example.springstudy.config;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 请求体缓存过滤器：将请求包装为可重复读取的ContentCachingRequestWrapper
 */
public class RequestBodyCachingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 包装请求（仅对非文件上传请求包装，multipart/form-data类型不支持）
        String contentType = request.getContentType();
        HttpServletRequest wrappedRequest = request;
        if (contentType != null && !contentType.contains("multipart/form-data")) {
            wrappedRequest = new ContentCachingRequestWrapper(request);
        }
        
        // 包装响应以支持响应体读取
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);
        
        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // 必须调用此方法将缓存的响应体写入实际响应
            wrappedResponse.copyBodyToResponse();
        }
    }
}