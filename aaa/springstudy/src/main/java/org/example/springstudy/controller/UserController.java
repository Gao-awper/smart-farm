package org.example.springstudy.controller;

import org.example.springstudy.Bean.User;
import org.example.springstudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600) // 允许跨域请求
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册接口
     * @param registerData 注册数据
     * @return 注册结果
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, Object> registerData) {
        User user = new User();
        user.setPassword((String) registerData.get("password"));
        user.setEmail((String) registerData.get("email"));
        user.setPhone((String) registerData.get("phone"));
        user.setAvatar((String) registerData.get("avatar"));
        user.setSex((String) registerData.get("sex"));
        user.setNickname((String) registerData.get("nickname"));
        user.setBirthday((String) registerData.get("birthday"));
        
        // 调用服务层注册方法，传递用户信息和身份信息
        return userService.register(user, (String) registerData.get("identity"));
    }
    
    /**
     * 用户登录接口（支持昵称/邮箱/手机号）
     * @param loginData 登录数据
     * @return 登录结果
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String nickname = loginData.get("nickname");
        String email = loginData.get("email");
        String phone = loginData.get("phone");
        String password = loginData.get("password");
        
        // 验证密码
        if (password == null || password.isEmpty()) {
            return Map.of("status", "error", "message", "密码不能为空");
        }
        
        // 根据提供的参数选择登录方式
        if (nickname != null && !nickname.isEmpty()) {
            return userService.loginByNickname(nickname, password);
        } else if (email != null && !email.isEmpty()) {
            return userService.loginByEmail(email, password);
        } else if (phone != null && !phone.isEmpty()) {
            return userService.loginByPhone(phone, password);
        } else {
            return Map.of("status", "error", "message", "昵称/邮箱/手机号至少提供一个");
        }
    }
    
    /**
     * 健康检查接口
     * @return 服务器状态
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "message", "Server is running");
    }

    @GetMapping("/user/{id}")
    public Map<String, Object> getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }

    /**
     * 更新用户信息接口
     * @param id 用户ID
     * @param userData 用户数据
     * @return 更新结果
     */
    @PutMapping("/user/{id}")
    public Map<String, Object> updateUserInfo(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        System.out.println("userData"+userData);
        return userService.updateUserInfo(id, userData);
    }
    
    /**
     * 获取所有用户接口（管理员专用）
     * @return 所有用户列表
     */
    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        return userService.getAllUsers();
    }
    
    /**
     * 搜索用户接口（管理员专用）
     * @param keyword 搜索关键词
     * @return 用户列表
     */
    @GetMapping("/users/search")
    public Map<String, Object> searchUsers(@RequestParam String keyword) {
        return userService.searchUsers(keyword);
    }
    
    /**
     * 删除用户接口（管理员专用）
     * @param id 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/user/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
    
    /**
     * 退出登录接口
     * @return 退出结果
     */
    @PostMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of(
            "status", "success",
            "message", "退出登录成功"
        );
    }
}