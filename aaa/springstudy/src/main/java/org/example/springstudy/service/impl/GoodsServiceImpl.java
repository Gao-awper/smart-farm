package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.Goods;
import org.example.springstudy.Mapper.GoodsMapper;
import org.example.springstudy.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商品服务实现类
 */
@Service
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    private GoodsMapper goodsMapper;

    @Override
    public Map<String, Object> getAllGoods() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Goods> goodsList = goodsMapper.selectAll();
            result.put("status", "success");
            result.put("message", "查询商品列表成功");
            result.put("data", goodsList);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询商品列表失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getGoodsByCategory(String category) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Goods> goodsList = goodsMapper.selectByCategory(category);
            result.put("status", "success");
            result.put("message", "根据分类查询商品成功");
            result.put("data", goodsList);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "根据分类查询商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getGoodsById(Long goodsId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Goods goods = goodsMapper.selectById(goodsId);
            if (goods != null) {
                result.put("status", "success");
                result.put("message", "查询商品详情成功");
                result.put("data", goods);
            } else {
                result.put("status", "error");
                result.put("message", "商品不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询商品详情失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> searchGoods(String keyword) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Goods> goodsList = goodsMapper.searchByKeyword(keyword);
            result.put("status", "success");
            result.put("message", "搜索商品成功");
            result.put("data", goodsList);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "搜索商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> addGoods(Goods goods) {
        Map<String, Object> result = new HashMap<>();
        try {
            int insertResult = goodsMapper.insert(goods);
            if (insertResult > 0) {
                result.put("status", "success");
                result.put("message", "添加商品成功");
                result.put("data", goods);
            } else {
                result.put("status", "error");
                result.put("message", "添加商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "添加商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> updateGoods(Goods goods) {
        Map<String, Object> result = new HashMap<>();
        try {
            int updateResult = goodsMapper.updateById(goods);
            if (updateResult > 0) {
                result.put("status", "success");
                result.put("message", "更新商品成功");
                result.put("data", goods);
            } else {
                result.put("status", "error");
                result.put("message", "更新商品失败或商品不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "更新商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> deleteGoods(Long goodsId) {
        Map<String, Object> result = new HashMap<>();
        try {
            int deleteResult = goodsMapper.deleteById(goodsId);
            if (deleteResult > 0) {
                result.put("status", "success");
                result.put("message", "删除商品成功");
            } else {
                result.put("status", "error");
                result.put("message", "删除商品失败或商品不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "删除商品失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> decreaseStock(Long goodsId, Integer count) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (count == null || count <= 0) {
                result.put("status", "error");
                result.put("message", "扣减数量必须大于0");
                return result;
            }
            int updateResult = goodsMapper.decreaseStock(goodsId, count);
            if (updateResult > 0) {
                result.put("status", "success");
                result.put("message", "扣减库存成功");
            } else {
                result.put("status", "error");
                result.put("message", "扣减库存失败，库存不足或商品不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "扣减库存失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> increaseStock(Long goodsId, Integer count) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (count == null || count <= 0) {
                result.put("status", "error");
                result.put("message", "恢复数量必须大于0");
                return result;
            }
            int updateResult = goodsMapper.increaseStock(goodsId, count);
            if (updateResult > 0) {
                result.put("status", "success");
                result.put("message", "恢复库存成功");
            } else {
                result.put("status", "error");
                result.put("message", "恢复库存失败，商品不存在");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "恢复库存失败：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> checkStock(Long goodsId, Integer count) {
        Map<String, Object> result = new HashMap<>();
        try {
            Goods goods = goodsMapper.selectById(goodsId);
            if (goods == null) {
                result.put("status", "error");
                result.put("message", "商品不存在");
                return result;
            }
            Integer currentStock = goods.getStock();
            if (currentStock == null) {
                currentStock = 0;
            }
            if (currentStock >= count) {
                result.put("status", "success");
                result.put("message", "库存充足");
                result.put("data", currentStock);
            } else {
                result.put("status", "error");
                result.put("message", "库存不足，当前库存：" + currentStock + "，需要：" + count);
                result.put("data", currentStock);
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "检查库存失败：" + e.getMessage());
        }
        return result;
    }
}