package org.example.springstudy.service;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import jakarta.annotation.Resource;
import org.example.springstudy.Bean.UserPermission;
import org.example.springstudy.Mapper.UserPermissionMapper;
import org.springframework.stereotype.Service;


@Service
public class UserPermissionService extends ServiceImpl<UserPermissionMapper, UserPermission> {

    @Resource
    private UserPermissionMapper permissionMapper;

    /**
     * 根据用户ID获取权限信息
     */
    public UserPermission getPermissionByUserId(Long userId) {
        return permissionMapper.selectById(userId);
    }

    /**
     * 判断用户是否有某个角色
     */
    public boolean hasRole(Long userId, String roleName) {
        UserPermission permission = getPermissionByUserId(userId);
        if (permission == null) {
            return false;
        }

        switch (roleName.toLowerCase()) {
            case "inheritor":
                return permission.checkIsInheritor();
            case "regularuser":
                return permission.checkIsRegularUser();
            case "administrator":
                return permission.checkIsAdministrator();
            default:
                return false;
        }
    }

    /**
     * 为用户分配角色
     */
    public boolean assignRole(Long userId, String roleName, boolean hasRole) {
        UserPermission permission = getPermissionByUserId(userId);
        if (permission == null) {
            permission = new UserPermission();
            permission.setId(userId);
            // 默认为普通用户
            permission.setRegularUser(UserPermission.ROLE_YES);
            permission.setInheritor(UserPermission.ROLE_NO);
            permission.setAdministrator(UserPermission.ROLE_NO);
        }

        int roleValue = hasRole ? UserPermission.ROLE_YES : UserPermission.ROLE_NO;

        switch (roleName.toLowerCase()) {
            case "inheritor":
                permission.setInheritor(roleValue);
                break;
            case "regularuser":
                permission.setRegularUser(roleValue);
                break;
            case "administrator":
                permission.setAdministrator(roleValue);
                break;
            default:
                return false;
        }

        if (permissionMapper.selectById(userId) == null) {
            return permissionMapper.insert(permission) > 0;
        } else {
            return permissionMapper.updateById(permission) > 0;
        }
    }
}