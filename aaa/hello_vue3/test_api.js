import http from 'http';

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
  res.on('end', () => {
    console.log('\n请求完成');
  });
});

req.on('error', (error) => {
  console.error(`请求错误: ${error}`);
  console.error(`错误类型: ${error.name}`);
  console.error(`错误信息: ${error.message}`);
  if (error.cause) {
    console.error(`错误原因: ${error.cause}`);
  }
});

console.log('正在发送请求到 http://127.0.0.1:8080/api/health...');
req.end();