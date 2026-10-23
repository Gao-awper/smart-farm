package org.example.springstudy.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;

@RestController
public class Test02 {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/datasource")
    public String getDataSourceInfo() {
        return "当前使用的数据源类型是: " + dataSource.getClass().getName();
    }
}