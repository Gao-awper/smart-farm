const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT密钥
const JWT_SECRET = 'smart_farm_secret_key_2026';

// 生成JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, nickname: user.nickname, identity: user.identity },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'error', message: '未提供认证token' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: '无效的token' });
  }
};

// 管理员权限中间件
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.identity === 'admin') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: '需要管理员权限' });
  }
};

// 存储用户数据的文件路径
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
}

// 读取用户数据
let users = [];
try {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(data);
  } else {
    // 初始用户数据（密码已加密）
    users = [
      {
        id: 1,
        nickname: 'admin',
        email: 'admin@smartfarm.com',
        phone: '13800138001',
        sex: '男',
        identity: 'admin',
        password: bcrypt.hashSync('admin123', 10)
      },
      {
        id: 2,
        nickname: 'farmer',
        email: 'farmer@smartfarm.com',
        phone: '13800138002',
        sex: '男',
        identity: 'regular',
        password: bcrypt.hashSync('farmer123', 10)
      },
      {
        id: 3,
        nickname: 'technician',
        email: 'technician@smartfarm.com',
        phone: '13800138003',
        sex: '女',
        identity: 'regular',
        password: bcrypt.hashSync('technician123', 10)
      }
    ];
    // 写入初始数据到文件
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }
} catch (error) {
  console.error('读取用户数据失败:', error);
  // 使用默认数据
  users = [
    {
      id: 1,
      nickname: 'admin',
      email: 'admin@smartfarm.com',
      phone: '13800138001',
      sex: '男',
      identity: 'admin',
      password: bcrypt.hashSync('admin123', 10)
    },
    {
      id: 2,
      nickname: 'farmer',
      email: 'farmer@smartfarm.com',
      phone: '13800138002',
      sex: '男',
      identity: 'regular',
      password: bcrypt.hashSync('farmer123', 10)
    },
    {
      id: 3,
      nickname: 'technician',
      email: 'technician@smartfarm.com',
      phone: '13800138003',
      sex: '女',
      identity: 'regular',
      password: bcrypt.hashSync('technician123', 10)
    }
  ];
}

// 保存用户数据到文件
const saveUsers = () => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('保存用户数据失败:', error);
  }
};

// 获取所有用户（需要管理员权限）
router.get('/users', authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    status: 'success',
    data: users
  });
});

// 添加用户（需要管理员权限）
router.post('/users', authMiddleware, adminMiddleware, (req, res) => {
  const { nickname, email, phone, password, sex, identity } = req.body;
  
  // 检查用户是否已存在
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: '用户已存在'
    });
  }
  
  // 创建新用户（密码加密）
  const newUser = {
    id: users.length + 1,
    nickname,
    email,
    phone,
    password: bcrypt.hashSync(password, 10),
    sex,
    identity: identity || 'regular'
  };
  
  users.push(newUser);
  saveUsers();
  
  res.json({
    status: 'success',
    data: newUser
  });
});

// 搜索用户（需要认证）
router.get('/users/search', authMiddleware, (req, res) => {
  const { keyword } = req.query;
  const result = users.filter(user => 
    user.nickname.includes(keyword) || 
    user.email.includes(keyword) ||
    user.phone.includes(keyword)
  );
  
  res.json({
    status: 'success',
    data: result
  });
});

// 注册用户
router.post('/register', (req, res) => {
  const { nickname, email, phone, password, sex, identity } = req.body;
  
  // 检查用户是否已存在
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: '用户已存在'
    });
  }
  
  // 创建新用户（密码加密）
  const newUser = {
    id: users.length + 1,
    nickname,
    email,
    phone,
    password: bcrypt.hashSync(password, 10),
    sex,
    identity: identity || 'regular'
  };
  
  users.push(newUser);
  saveUsers();
  
  // 生成token
  const token = generateToken(newUser);
  
  res.json({
    status: 'success',
    data: {
      id: newUser.id,
      nickname: newUser.nickname,
      email: newUser.email,
      phone: newUser.phone,
      sex: newUser.sex,
      identity: newUser.identity,
      token
    }
  });
});

// 登录
router.post('/login', (req, res) => {
  const { nickname, password } = req.body;
  
  const user = users.find(user => user.nickname === nickname);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    // 生成token
    const token = generateToken(user);
    
    const userInfo = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      sex: user.sex,
      identity: user.identity,
      avatar: 'https://picsum.photos/id/237/60/60',
      createTime: new Date().toISOString(),
      isAdmin: user.identity === 'admin',
      isUser: user.identity === 'regular',
      token
    };
    
    res.json({
      status: 'success',
      data: userInfo
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: '用户名或密码错误'
    });
  }
});

// 更新用户信息（需要认证）
router.put('/user/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nickname, email, phone, sex, identity, password } = req.body;
  
  const userIndex = users.findIndex(item => item.id === parseInt(id));
  
  if (userIndex !== -1) {
    // 检查权限：只能更新自己的信息，或者管理员可以更新所有用户
    if (req.user.id !== parseInt(id) && req.user.identity !== 'admin') {
      return res.status(403).json({ status: 'error', message: '没有权限更新其他用户信息' });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      nickname,
      email,
      phone,
      sex,
      identity,
      ...(password && { password: bcrypt.hashSync(password, 10) })
    };
    saveUsers();
    
    res.json({
      status: 'success',
      data: users[userIndex]
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '用户不存在'
    });
  }
});

// 删除用户（需要管理员权限）
router.delete('/user/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(item => item.id === parseInt(id));
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveUsers();
    
    res.json({
      status: 'success',
      message: '用户删除成功'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '用户不存在'
    });
  }
});

// 根据ID获取用户（需要认证）
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const user = users.find(item => item.id === parseInt(id));
  
  if (user) {
    // 检查权限：只能查看自己的信息，或者管理员可以查看所有用户
    if (req.user.id !== parseInt(id) && req.user.identity !== 'admin') {
      return res.status(403).json({ status: 'error', message: '没有权限查看其他用户信息' });
    }
    
    res.json({
      status: 'success',
      data: user
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '用户不存在'
    });
  }
});

module.exports = router;