package org.example.springstudy.Bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user_permission")
public class UserPermission {

    @TableId(type = IdType.INPUT)
    private Long id;

    @TableField("Inheritor")
    private Integer inheritor;

    @TableField("RegularUser")
    private Integer regularUser;

    @TableField("Administrator")
    private Integer administrator;

    public static final int ROLE_NO = 0;
    public static final int ROLE_YES = 1;

    public boolean checkIsInheritor() {
        return ROLE_YES == inheritor;
    }

    public boolean checkIsRegularUser() {
        return ROLE_YES == regularUser;
    }

    public boolean checkIsAdministrator() {
        return ROLE_YES == administrator;
    }
}