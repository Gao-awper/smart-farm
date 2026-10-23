package org.example.springstudy.controller;

import org.example.springstudy.Bean.Goods;
import org.example.springstudy.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 商品控制器
 */
@RestController
@RequestMapping("/api/goods")
@CrossOrigin(origins = "*")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    /**
     * 获取所有商品
     * @return 商品列表
     */
    @GetMapping("")
    public Map<String, Object> getGoodsList(@RequestParam(required = false) String category, @RequestParam(required = false) String keyword) {
        if (category != null && !category.isEmpty()) {
            return goodsService.getGoodsByCategory(category);
        } else if (keyword != null && !keyword.isEmpty()) {
            return goodsService.searchGoods(keyword);
        } else {
            return goodsService.getAllGoods();
        }
    }

    /**
     * 根据分类获取商品
     * @param category 商品分类
     * @return 商品列表
     */
    @GetMapping("/category/{category}")
    public Map<String, Object> getGoodsByCategory(@PathVariable String category) {
        return goodsService.getGoodsByCategory(category);
    }

    /**
     * 获取商品详情
     * @param id 商品ID/**
     * 获取商品详情
     */
    @GetMapping("/{id}")
    public Map<String, Object> getGoodsDetail(@PathVariable Long id) {
        return goodsService.getGoodsById(id);
    }
    /**
     * 根据关键词搜索商品
     * @param keyword 搜索关键词
     * @return 商品列表
     */
    @GetMapping("/search")
    public Map<String, Object> searchGoods(@RequestParam String keyword) {
        return goodsService.searchGoods(keyword);
    }

    /**
     * 添加商品
     * @param goods 商品信息
     * @return 操作结果
     */
    @PostMapping
    public Map<String, Object> addGoods(@RequestBody Goods goods) {
        return goodsService.addGoods(goods);
    }

    /**
     * 更新商品
     * @param goods 商品信息
     * @return 操作结果
     */
    @PutMapping
    public Map<String, Object> updateGoods(@RequestBody Goods goods) {
        return goodsService.updateGoods(goods);
    }

    /**
     * 删除商品
     * @param id 商品ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteGoods(@PathVariable Long id) {
        return goodsService.deleteGoods(id);
    }

    /**
     * 扣减库存
     * @param id 商品ID
     * @param count 扣减数量
     * @return 操作结果
     */
    @PutMapping("/{id}/stock/decrease")
    public Map<String, Object> decreaseStock(@PathVariable Long id, @RequestParam Integer count) {
        return goodsService.decreaseStock(id, count);
    }

    /**
     * 恢复库存
     * @param id 商品ID
     * @param count 恢复数量
     * @return 操作结果
     */
    @PutMapping("/{id}/stock/increase")
    public Map<String, Object> increaseStock(@PathVariable Long id, @RequestParam Integer count) {
        return goodsService.increaseStock(id, count);
    }

    /**
     * 检查库存
     * @param id 商品ID
     * @param count 需要的数量
     * @return 操作结果
     */
    @GetMapping("/{id}/stock/check")
    public Map<String, Object> checkStock(@PathVariable Long id, @RequestParam Integer count) {
        return goodsService.checkStock(id, count);
    }

    /**
     * 上传商品图片
     * @param file 图片文件
     * @return 图片URL
     */
    @PostMapping("/upload")
    public Map<String, Object> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (file.isEmpty()) {
                result.put("status", "error");
                result.put("message", "请选择要上传的图片");
                return result;
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;

            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "goods";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File destFile = new File(uploadDir + File.separator + newFilename);
            file.transferTo(destFile);

            String imageUrl = "http://localhost:8080/uploads/goods/" + newFilename;

            result.put("status", "success");
            result.put("message", "图片上传成功");
            result.put("data", imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "图片上传失败：" + e.getMessage());
        }
        return result;
    }
}