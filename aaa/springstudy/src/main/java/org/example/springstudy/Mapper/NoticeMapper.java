package org.example.springstudy.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springstudy.Bean.Notice;

import java.util.List;

@Mapper
public interface NoticeMapper {
    List<Notice> selectAll();
    Notice selectById(@Param("id") Long id);
    List<Notice> selectByType(@Param("type") String type);
    int insertNotice(Notice notice);
    int updateNotice(Notice notice);
    int deleteNotice(@Param("id") Long id);
}