package org.example.springstudy.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类，用于配置静态资源访问和请求拦截器
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 配置静态资源访问路径
     * @param registry 资源处理器注册器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置上传文件的访问路径：访问 /uploads/xxx 对应本地 uploads/ 文件夹下的文件
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    /**
     * 注册请求体缓存过滤器：解决请求体重复读取问题
     * @return 过滤器注册对象
     */


    /**
     * 注册API请求日志拦截器：记录请求全生命周期信息
     * @param registry 拦截器注册器
     */


}