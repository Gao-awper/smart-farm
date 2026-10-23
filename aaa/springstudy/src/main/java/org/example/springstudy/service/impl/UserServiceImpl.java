package org.example.springstudy.service.impl;

import org.example.springstudy.Bean.User;
import org.example.springstudy.Bean.UserPermission;
import org.example.springstudy.Mapper.UserMapper;
import org.example.springstudy.Mapper.UserPermissionMapper;
import org.example.springstudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserPermissionMapper userPermissionMapper;

    /**
     * 密码加密（使用MD5）
     *
     * @param password 原始密码
     * @return 加密后的密码
     */
    private String encryptPassword(String password) {
        // 使用MD5加密，实际项目中建议使用更安全的加密方式如bcrypt
        return DigestUtils.md5DigestAsHex(password.getBytes());
    }

    @Override
    public Map<String, Object> register(User user, String identity) {
        Map<String, Object> result = new HashMap<>();

        // 验证参数
        if (user == null) {
            result.put("status", "error");
            result.put("message", "用户信息不能为空");
            return result;
        }

        if (user.getNickname() == null || user.getNickname().trim().isEmpty()) {
            result.put("status", "error");
            result.put("message", "用户名不能为空");
            return result;
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            result.put("status", "error");
            result.put("message", "密码不能为空");
            return result;
        }

        // 验证身份参数
        if (identity == null || !identity.equals("regular") && !identity.equals("inheritor") && !identity.equals("admin")) {
            System.out.println(identity);
            result.put("status", "error");
            result.put("message", "无效的身份选择");
            return result;
        }

        // 检查昵称是否已存在
        if (findByNickname(user.getNickname()) != null) {
            result.put("status", "error");
            result.put("message", "昵称已存在");
            return result;
        }

        // 检查邮箱是否已存在（仅当邮箱不为空时）
        if (user.getEmail() != null && !user.getEmail().isEmpty() && findByEmail(user.getEmail()) != null) {
            result.put("status", "error");
            result.put("message", "邮箱已被注册");
            return result;
        }

        // 检查手机号是否已存在（仅当手机号不为空时）
        if (user.getPhone() != null && !user.getPhone().isEmpty() && findByPhone(user.getPhone()) != null) {
            result.put("status", "error");
            result.put("message", "手机号已被注册");
            return result;
        }

        user.setNickname(user.getNickname());

        // 加密密码
        user.setPassword(encryptPassword(user.getPassword()));

        // 设置默认状态
        user.setStatus(1); // 1: 正常

        // 设置创建和更新时间
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        // 保存用户
        int insertResult = userMapper.insert(user);
        if (insertResult > 0) {
            // 根据身份参数创建对应的权限记录
            UserPermission userPermission = new UserPermission();
            userPermission.setId(user.getId());

            boolean isInheritor = "inheritor".equals(identity);
            boolean isAdmin = "admin".equals(identity);

            userPermission.setInheritor(isInheritor ? UserPermission.ROLE_YES : UserPermission.ROLE_NO);
            userPermission.setRegularUser(UserPermission.ROLE_YES); // 所有用户都是普通用户
            userPermission.setAdministrator(isAdmin ? UserPermission.ROLE_YES : UserPermission.ROLE_NO);
            userPermissionMapper.insert(userPermission);

            // 简化返回数据格式，与登录接口保持一致
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("avatar", user.getAvatar());
            userData.put("sex", user.getSex());
            userData.put("nickname", user.getNickname());
            userData.put("birthday", user.getBirthday());
            userData.put("status", user.getStatus());
            userData.put("createTime", user.getCreateTime());
            userData.put("updateTime", user.getUpdateTime());

            // 添加权限信息
            userData.put("isInheritor", isInheritor);
            userData.put("isRegularUser", true);
            userData.put("isAdmin", isAdmin);

            result.put("status", "success");
            result.put("message", "注册成功");
            result.put("data", userData);
        } else {
            result.put("status", "error");
            result.put("message", "注册失败，请稍后重试");
        }

        return result;
    }

    @Override
    public Map<String, Object> loginByNickname(String nickname, String password) {
        // 根据昵称查找用户
        User user = findByNickname(nickname);
        return login(user, password);
    }

    @Override
    public Map<String, Object> loginByEmail(String email, String password) {
        // 根据邮箱查找用户
        User user = findByEmail(email);
        return login(user, password);
    }

    @Override
    public Map<String, Object> loginByPhone(String phone, String password) {
        // 根据手机号查找用户
        User user = findByPhone(phone);
        return login(user, password);
    }

    /**
     * 登录验证
     *
     * @param user     用户信息
     * @param password 密码
     * @return 登录结果
     */
    private Map<String, Object> login(User user, String password) {
        Map<String, Object> result = new HashMap<>();

        // 验证用户是否存在
        if (user == null) {
            result.put("status", "error");
            result.put("message", "用户不存在");
            return result;
        }

        // 验证密码
        if (!user.getPassword().equals(encryptPassword(password))) {
            result.put("status", "error");
            result.put("message", "密码错误");
            return result;
        }

        // 验证用户状态
        if (user.getStatus() != 1) {
            result.put("status", "error");
            result.put("message", "用户账号已禁用");
            return result;
        }

        // 查询用户权限信息
        UserPermission userPermission = userPermissionMapper.selectById(user.getId());

        // 如果权限信息不存在，创建默认权限（普通用户）
        if (userPermission == null) {
            userPermission = new UserPermission();
            userPermission.setId(user.getId());
            userPermission.setInheritor(UserPermission.ROLE_NO);
            userPermission.setRegularUser(UserPermission.ROLE_YES);
            userPermission.setAdministrator(UserPermission.ROLE_NO);
            userPermissionMapper.insert(userPermission);
        }

        // 登录成功，将用户信息和权限信息合并返回
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("avatar", user.getAvatar());
        userData.put("sex", user.getSex());
        userData.put("nickname", user.getNickname());
        userData.put("realname", user.getRealname());
        userData.put("birthday", user.getBirthday());
        userData.put("status", user.getStatus());
        userData.put("createTime", user.getCreateTime());
        userData.put("updateTime", user.getUpdateTime());

        // 添加权限信息
        userData.put("isInheritor", userPermission.getInheritor() == UserPermission.ROLE_YES);
        userData.put("isRegularUser", userPermission.getRegularUser() == UserPermission.ROLE_YES);
        userData.put("isAdmin", userPermission.getAdministrator() == UserPermission.ROLE_YES);

        result.put("status", "success");
        result.put("message", "登录成功");
        result.put("data", userData);

        return result;
    }

    @Override
    public User findByNickname(String nickname) {
        return userMapper.findByNickname(nickname);
    }

    @Override
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        return userMapper.findByEmail(email);
    }

    @Override
    public User findByPhone(String phone) {
        return userMapper.findByPhone(phone);
    }

    @Override
    public Map<String, Object> findUserById(Long id) {
        Map<String, Object> result = new HashMap<>();

        // 根据ID查询用户
        User user = userMapper.selectById(id);
        if (user == null) {
            result.put("status", "error");
            result.put("message", "用户不存在");
            return result;
        }

        // 查询用户权限信息
        UserPermission userPermission = userPermissionMapper.selectById(id);

        // 如果权限信息不存在，创建默认权限（普通用户）
        if (userPermission == null) {
            userPermission = new UserPermission();
            userPermission.setId(id);
            userPermission.setInheritor(UserPermission.ROLE_NO);
            userPermission.setRegularUser(UserPermission.ROLE_YES);
            userPermission.setAdministrator(UserPermission.ROLE_NO);
            userPermissionMapper.insert(userPermission);
        }

        // 组装用户信息和权限信息
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("avatar", user.getAvatar());
        userData.put("sex", user.getSex());
        userData.put("nickname", user.getNickname());
        userData.put("realname",user.getRealname());
        userData.put("birthday", user.getBirthday());
        userData.put("status", user.getStatus());
        userData.put("createTime", user.getCreateTime());
        userData.put("updateTime", user.getUpdateTime());
        userData.put("isInheritor", userPermission.getInheritor() == UserPermission.ROLE_YES);
        userData.put("isRegularUser", userPermission.getRegularUser() == UserPermission.ROLE_YES);
        userData.put("isAdmin", userPermission.getAdministrator() == UserPermission.ROLE_YES);

        result.put("status", "success");
        result.put("message", "查询成功");
        result.put("data", userData);

        return result;
    }

    @Override
    public Map<String, Object> updateUserInfo(Long id, Map<String, Object> userData) {
        Map<String, Object> result = new HashMap<>();

        // 根据ID查询用户
        User user = userMapper.selectById(id);
        if (user == null) {
            result.put("status", "error");
            result.put("message", "用户不存在");
            return result;
        }

        // 更新用户信息（优化：先判断新值是否与旧值一致，避免无效更新）
        if (userData.containsKey("nickname")) {
            String nickname = (String) userData.get("nickname");
            if (nickname != null && !nickname.isEmpty() && !nickname.equals(user.getNickname())) {
                // 昵称更新前，先检查是否已存在
                User existUser = findByNickname(nickname);
                if (existUser != null && !existUser.getId().equals(id)) {
                    result.put("status", "error");
                    result.put("message", "昵称已被占用");
                    return result;
                }
                user.setNickname(nickname);
            }
        }
        if (userData.containsKey("email")) {
            String email = (String) userData.get("email");
            if (email != null && !email.isEmpty() && !email.equals(user.getEmail())) {
                // 邮箱更新前，先检查是否已存在
                User existUser = findByEmail(email);
                if (existUser != null && !existUser.getId().equals(id)) {
                    result.put("status", "error");
                    result.put("message", "邮箱已被注册");
                    return result;
                }
                user.setEmail(email);
            }
        }
        if (userData.containsKey("phone")) {
            String phone = (String) userData.get("phone");
            if (phone != null && !phone.isEmpty() && !phone.equals(user.getPhone())) {
                // 手机号更新前，先检查是否已存在
                User existUser = findByPhone(phone);
                if (existUser != null && !existUser.getId().equals(id)) {
                    result.put("status", "error");
                    result.put("message", "手机号已被注册");
                    return result;
                }
                user.setPhone(phone);
            }
        }
        if (userData.containsKey("avatar")) {
            String avatar = (String) userData.get("avatar");
            if (avatar != null && !avatar.equals(user.getAvatar())) {
                user.setAvatar(avatar);
            }
        }
        if (userData.containsKey("sex")) {
            String sex = (String) userData.get("sex");
            if (sex != null && !sex.isEmpty() && !sex.equals(user.getSex())) {
                user.setSex(sex);
            }
        }
        if (userData.containsKey("birthday")) {
            String birthday = (String) userData.get("birthday");
            if (birthday != null && !birthday.isEmpty() && !birthday.equals(user.getBirthday())) {
                user.setBirthday(birthday);
            }
        }
        if (userData.containsKey("realname")) {
            String realname = (String) userData.get("realname");
            if (realname != null && !realname.isEmpty() && !realname.equals(user.getRealname())) {
                user.setRealname(realname);
            }
        }

        // 更新时间
        user.setUpdateTime(LocalDateTime.now());

        // 保存更新
        int updateResult = userMapper.updateById(user);
        if (updateResult > 0) {
            // 查询更新后的用户信息返回
            return findUserById(id);
        } else {
            result.put("status", "error");
            result.put("message", "更新失败，请稍后重试");
            return result;
        }
    }

    @Override
    public Map<String, Object> getUserPermission(Long userId) {
        Map<String, Object> result = new HashMap<>();

        try {
            User user = userMapper.selectById(userId);
            if (user == null) {
                result.put("status", "error");
                result.put("message", "用户不存在");
                return result;
            }

            UserPermission userPermission = userPermissionMapper.selectById(userId);

            if (userPermission == null) {
                userPermission = new UserPermission();
                userPermission.setId(userId);
                userPermission.setInheritor(UserPermission.ROLE_NO);
                userPermission.setRegularUser(UserPermission.ROLE_YES);
                userPermission.setAdministrator(UserPermission.ROLE_NO);
                userPermissionMapper.insert(userPermission);
            }

            Map<String, Object> permissionData = new HashMap<>();
            permissionData.put("userId", userId);
            permissionData.put("isInheritor", userPermission.getInheritor() == UserPermission.ROLE_YES);
            permissionData.put("isRegularUser", userPermission.getRegularUser() == UserPermission.ROLE_YES);
            permissionData.put("isAdmin", userPermission.getAdministrator() == UserPermission.ROLE_YES);

            result.put("status", "success");
            result.put("message", "查询权限成功");
            result.put("data", permissionData);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询权限失败：" + e.getMessage());
        }

        return result;
    }

    @Override
    public Map<String, Object> getAllUsers() {
        Map<String, Object> result = new HashMap<>();

        try {
            // 获取所有用户
            List<User> userList = userMapper.selectList(null);

            // 组装包含权限信息的用户列表
            List<Map<String, Object>> usersWithPermission = new ArrayList<>();
            for (User user : userList) {
                // 查询用户权限信息
                UserPermission userPermission = userPermissionMapper.selectById(user.getId());

                // 如果权限信息不存在，创建默认权限（普通用户）
                if (userPermission == null) {
                    userPermission = new UserPermission();
                    userPermission.setId(user.getId());
                    userPermission.setInheritor(UserPermission.ROLE_NO);
                    userPermission.setRegularUser(UserPermission.ROLE_YES);
                    userPermission.setAdministrator(UserPermission.ROLE_NO);
                    userPermissionMapper.insert(userPermission);
                }

                // 组装用户信息和权限信息
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("email", user.getEmail());
                userData.put("phone", user.getPhone());
                userData.put("avatar", user.getAvatar());
                userData.put("sex", user.getSex());
                userData.put("nickname", user.getNickname());
                userData.put("realname", user.getRealname());
                userData.put("birthday", user.getBirthday());
                userData.put("status", user.getStatus());
                userData.put("createTime", user.getCreateTime());
                userData.put("updateTime", user.getUpdateTime());
                userData.put("isInheritor", userPermission.getInheritor() == UserPermission.ROLE_YES);
                userData.put("isRegularUser", userPermission.getRegularUser() == UserPermission.ROLE_YES);
                userData.put("isAdmin", userPermission.getAdministrator() == UserPermission.ROLE_YES);

                usersWithPermission.add(userData);
            }

            result.put("status", "success");
            result.put("message", "查询成功");
            result.put("data", usersWithPermission);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询失败：" + e.getMessage());
        }

        return result;
    }

    @Override
    public Map<String, Object> searchUsers(String keyword) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 优化：建议在Mapper中添加模糊查询SQL，避免内存中过滤（大数据量时性能差）
            List<User> userList = userMapper.selectList(null);

            // 组装包含权限信息的用户列表
            List<Map<String, Object>> usersWithPermission = new ArrayList<>();
            for (User user : userList) {
                // 检查是否匹配关键词（昵称、邮箱、手机号）
                boolean matches = false;
                if (user.getNickname() != null && user.getNickname().toLowerCase().contains(keyword.toLowerCase())) {
                    matches = true;
                }
                if (user.getEmail() != null && user.getEmail().toLowerCase().contains(keyword.toLowerCase())) {
                    matches = true;
                }
                if (user.getPhone() != null && user.getPhone().contains(keyword)) {
                    matches = true;
                }

                if (matches) {
                    // 查询用户权限信息
                    UserPermission userPermission = userPermissionMapper.selectById(user.getId());

                    // 如果权限信息不存在，创建默认权限（普通用户）
                    if (userPermission == null) {
                        userPermission = new UserPermission();
                        userPermission.setId(user.getId());
                        userPermission.setInheritor(UserPermission.ROLE_NO);
                        userPermission.setRegularUser(UserPermission.ROLE_YES);
                        userPermission.setAdministrator(UserPermission.ROLE_NO);
                        userPermissionMapper.insert(userPermission);
                    }

                    // 组装用户信息和权限信息
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("email", user.getEmail());
                    userData.put("phone", user.getPhone());
                    userData.put("avatar", user.getAvatar());
                    userData.put("sex", user.getSex());
                    userData.put("nickname", user.getNickname());
                    userData.put("realname", user.getRealname());
                    userData.put("birthday", user.getBirthday());
                    userData.put("status", user.getStatus());
                    userData.put("createTime", user.getCreateTime());
                    userData.put("updateTime", user.getUpdateTime());
                    userData.put("isInheritor", userPermission.getInheritor() == UserPermission.ROLE_YES);
                    userData.put("isRegularUser", userPermission.getRegularUser() == UserPermission.ROLE_YES);
                    userData.put("isAdmin", userPermission.getAdministrator() == UserPermission.ROLE_YES);

                    usersWithPermission.add(userData);
                }
            }

            result.put("status", "success");
            result.put("message", "查询成功");
            result.put("data", usersWithPermission);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "查询失败：" + e.getMessage());
        }

        return result;
    }

    @Override
    public Map<String, Object> deleteUser(Long id) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 检查用户是否存在
            User user = userMapper.selectById(id);
            if (user == null) {
                result.put("status", "error");
                result.put("message", "用户不存在");
                return result;
            }

            // 优化：先判断权限记录是否存在，再删除
            UserPermission userPermission = userPermissionMapper.selectById(id);
            if (userPermission != null) {
                userPermissionMapper.deleteById(id);
            }

            // 删除用户记录
            int deleteResult = userMapper.deleteById(id);
            if (deleteResult > 0) {
                result.put("status", "success");
                result.put("message", "删除成功");
            } else {
                result.put("status", "error");
                result.put("message", "删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "删除失败：" + e.getMessage());
        }

        return result;
    }
}