package org.example.springstudy.service;

import org.example.springstudy.Bean.User;

import java.util.Map;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 注册用户
     * @param user 用户信息
     * @param identity 身份选择 (regular/inheritor/admin)
     * @return 注册结果
     */
    Map<String, Object> register(User user, String identity);

    /**
     * 通过昵称登录
     * @param nickname 昵称
     * @param password 密码
     * @return 登录结果
     */
    Map<String, Object> loginByNickname(String nickname, String password);

    /**
     * 通过邮箱登录
     * @param email 邮箱
     * @param password 密码
     * @return 登录结果
     */
    Map<String, Object> loginByEmail(String email, String password);

    /**
     * 通过手机号登录
     * @param phone 手机号
     * @param password 密码
     * @return 登录结果
     */
    Map<String, Object> loginByPhone(String phone, String password);

    /**
     * 根据昵称查询用户
     * @param nickname 昵称
     * @return 用户信息
     */
    User findByNickname(String nickname);
    
    /**
     * 根据用户名查询用户（备用方法）
     * @param username 用户名
     * @return 用户信息
     */
    User findByUsername(String username);

    /**
     * 根据邮箱查询用户
     * @param email 邮箱
     * @return 用户信息
     */
    User findByEmail(String email);

    /**
     * 根据手机号查询用户
     * @param phone 手机号
     * @return 用户信息
     */
    User findByPhone(String phone);

    /**
     * 根据用户ID查询用户信息
     * @param id 用户ID
     * @return 用户信息
     */
    Map<String, Object> findUserById(Long id);

    /**
     * 更新用户信息
     * @param id 用户ID
     * @param userData 用户数据
     * @return 更新结果
     */
    Map<String, Object> updateUserInfo(Long id, Map<String, Object> userData);
    
    /**
     * 获取所有用户
     * @return 所有用户列表
     */
    Map<String, Object> getAllUsers();
    
    /**
     * 搜索用户
     * @param keyword 搜索关键词
     * @return 用户列表
     */
    Map<String, Object> searchUsers(String keyword);
    
    /**
     * 删除用户
     * @param id 用户ID
     * @return 删除结果
     */
    Map<String, Object> deleteUser(Long id);
    
    /**
     * 获取用户权限
     * @param userId 用户ID
     * @return 用户权限信息
     */
    Map<String, Object> getUserPermission(Long userId);
}

