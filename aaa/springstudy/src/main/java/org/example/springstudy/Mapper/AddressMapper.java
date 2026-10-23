package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.springstudy.Bean.Address;

/**
 * 地址Mapper接口
 */
@Mapper
public interface AddressMapper {
    /**
     * 根据地址ID查询地址
     * @param id 地址ID
     * @return 地址信息
     */
    Address selectById(Long id);

    /**
     * 插入地址
     * @param address 地址信息
     * @return 影响行数
     */
    int insert(Address address);

    /**
     * 更新地址
     * @param address 地址信息
     * @return 影响行数
     */
    int updateById(Address address);

    /**
     * 根据地址ID删除地址
     * @param id 地址ID
     * @return 影响行数
     */
    int deleteById(Long id);
}