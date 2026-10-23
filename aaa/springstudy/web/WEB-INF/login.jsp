<%--
  Created by IntelliJ IDEA.
  User: 23118
  Date: 2025/10/30
  Time: 14:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>欢迎登录</title>
</head>
<body>
<form action="userlogin" method="post">
    <label>用户名：</label><input name="username"><br/>
    <label>密码：</label><input name="password" type="password"><br/>
    <input type="submit" value="登录">
</form>
</body>
</html>
