package org.example.springstudy.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*", maxAge = 3600) // 允许跨域请求
public class FileUploadController {
    
    // 图片保存路径
    private static final String UPLOAD_DIR = "uploads/avatars/";
    
    @Autowired
    private ResourceLoader resourceLoader;
    
    /**
     * 上传头像
     * @param file 头像文件
     * @return 上传结果
     */
    @PostMapping("/avatars")
    public Map<String, Object> uploadAvatar(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        
        // 检查文件是否为空
        if (file.isEmpty()) {
            result.put("status", "error");
            result.put("message", "上传文件不能为空");
            return result;
        }
        
        try {
            // 获取项目根路径
            File path = new File(ResourceUtils.getURL("classpath:").getPath());
            if (!path.exists()) path = new File("");
            
            // 创建上传目录
            File uploadDir = new File(path.getAbsolutePath(), UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            
            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            // 保存文件
            Path filePath = Paths.get(uploadDir.getAbsolutePath(), uniqueFilename);
            System.out.println(filePath);
            Files.write(filePath, file.getBytes());
            
            // 构建文件访问路径
            String fileUrl = "http://localhost:5173/api/" + UPLOAD_DIR + uniqueFilename;
            
            // 返回成功结果
            result.put("status", "success");
            result.put("message", "文件上传成功");
            result.put("data", Map.of(
                "path", fileUrl,
                "filename", uniqueFilename,
                "originalFilename", originalFilename,
                "size", file.getSize()
            ));
            
        } catch (IOException e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "文件上传失败：" + e.getMessage());
        }
        
        return result;
    }

    /**
     * 查看图片
     * @param filename 文件名
     * @return 图片资源
     */
    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<?> viewAvatar(@PathVariable String filename) {
        try {
            // 获取项目根路径
            File path = new File(ResourceUtils.getURL("classpath:").getPath());
            if (!path.exists()) path = new File("");
            
            // 构建文件路径
            Path filePath = Paths.get(path.getAbsolutePath(), UPLOAD_DIR + filename);
            
            // 检查文件是否存在
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            // 返回图片资源
            return ResponseEntity.ok().body(resourceLoader.getResource("file:" + filePath.toString()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}