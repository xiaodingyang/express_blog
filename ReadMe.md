

## 1.1 需求

### 1.1.1 首页



![1553660488589](F:\我的学习\My Study\05-Node\demo\assets\1553660488589.png)







### 1.1.2 作者主页



![1553660517242](F:\我的学习\My Study\05-Node\demo\assets\1553660517242.png)



### 1.1.3 博客详情页



![1553660542154](F:\我的学习\My Study\05-Node\demo\assets\1553660542154.png)



### 1.1.4 登录页



![1553660569962](F:\我的学习\My Study\05-Node\demo\assets\1553660569962.png)

### 1.1.5 管理中心



![1553660594753](F:\我的学习\My Study\05-Node\demo\assets\1553660594753.png)



### 1.1.6 编辑博客



![1553660633608](F:\我的学习\My Study\05-Node\demo\assets\1553660633608.png)



### 1.1.7 存储博客



![1553661200815](F:\我的学习\My Study\05-Node\demo\assets\1553661200815.png)





### 1.1.8 存储用户



![1553661216046](F:\我的学习\My Study\05-Node\demo\assets\1553661216046.png)



### 1.1.9 接口设计



![1553661265979](F:\我的学习\My Study\05-Node\demo\assets\1553661265979.png)





### 1.1.20 搭建开发环境

#### 1.1.20.1 cross-env

- 使可以使用 `npm run dev` 启动 node

- 安装

  ```
  npm i cross-env
  ```

- 配置，在 `package.json` 中配置dev，以下代码表示使用 `npm run dev` 可以使用  `nodemon` 启动 www.js 文件。

  ```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js", // 开发环境
    "prd": "cross-env NODE_ENV=production nodemon ./bin/www.js" // 生产环境
  }
  ```

- 可以通过 `process.env.NODE_ENV` 识别是否是开发环境

  ```js
  process.env.NODE_ENV  // dev
  ```

  

## 1.2 开发接口

- node 处理 http 请求
- 搭建开发环境
- 开发接口（暂不连接数据库，暂不考虑登录）



### 1.2.1 http请求概述

#### 1.2.1.1 第一步

- `DNS解析`：将域名解析，解析为真正的 IP 地址，对应着一台服务器。`建立TCP`：客户端和服务器建立 TCP 连接，三次握手，`发送 http 请求`。

![1553662422820](F:\我的学习\My Study\05-Node\demo\assets\1553662422820.png)

- 如上图，域名为百度，但是通过解析，解析为 `119.75.217.26:443`

![1553662663283](F:\我的学习\My Study\05-Node\demo\assets\1553662663283.png)

- 如上图，发起的 http 请求，向后端发送的数据

#### 1.2.1.2 第二步

- server 接收到 http 请求，处理并返回 。

![1553662864563](F:\我的学习\My Study\05-Node\demo\assets\1553662864563.png)

- 如上图，服务端会返回数据。至于怎么处理的我们就不知道了。

#### 1.2.1.3 第三步

- 客户端接收到返回数据，处理数据（如渲染页面，执行js）



### 1.2.2 三种请求方式用法

> - get 请求和 querystring
> - post 请求和 postdata
> - 路由



#### 1.2.2.1 nodejs 处理 get 请求

> - get 请求，即客户要向 server 端获取数据，如查询博客列表
> - 通过 querystring 来传递数据，a.html?a=100&b=200
> - 浏览器直接访问，发送 get 请求



```js
const http = require('http');
const querystring = require('querystring');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    console.log(req.method); //请求方式
    const url = req.url; // 获取请求完整的 url
    console.log(url);

    req.query = querystring.parse(url.split('?')[1]); // 将 url 通过 ？ 进行拆分，并且拿到 ？ 以后的数据，然后通过 querystring.parse 转为字符串类型的 json

    res.end(JSON.stringify(req.query)); // 将字符串类型的 json 转为 json

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
```



#### 1.2.2.2 nodejs 处理 post 请求

> post 请求，即客户端要向服务端传递数据，如新建博客
>
> 通过 post data 传递数据
>
> 浏览器无法直接模拟，需要手写 js，或者使用 postman



```js
const http = require('http');
const querystring = require('querystring');
http.createServer(function (req, res) {

    if (req.method === 'POST') {
        console.log('req content-type', req.headers['content-type']); //请求头

        /* 接收数据: 如果我们不使用 toString 转译,获取到的值将是编码的类型 */
        let postData = '';
        req.on('data', chunk => {

            postData += chunk.toString();
        })
        // end 可以拿到编译成功后的数据
        req.on('end', () => {
            console.log('postData:', postData);
            res.end('postData');
        })
    }
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
```

- 我们使用 postman 发送数据

  ![1556240197212](F:\我的学习\My Study\05-Node\demo\assets\1556240197212.png)

- 控制台打印

  ```js
  req content-type application/json
  postData: {
          "name": "张三"
  }
  ```

- 以上代码我们可以看到，我们的node已经成功接收到数据



### 1.2.3 处理 http 请求综合示例



```js
const http = require('http');
const querystring = require('querystring');
http.createServer(function (req, res) {
    const url = req.url;
    const method = req.method;
    const path = url.split('?')[0];
    const query = querystring.parse(url.split('?')[1]);

    /* 设置返回格式为 JSON */
    res.setHeader('Content-type', 'application/json');

    /* 返回的数据 */
    const resData = {
        method,
        url,
        path,
        query
    }
    if (req.method === 'GET') {
        res.end(JSON.stringify(resData));
    } else if (req.method === 'POST') {
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        });

        req.on('end', () => {
            resData.postData = postData;
            res.end(JSON.stringify(resData));
        });
    }
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
```







## 1.3 Mysql 数据库

### 1.3.1 建表

#### 1.3.1.1 user

- 表的结构

![1559548290273](C:\Users\34662\Desktop\我的文档\NodeBlog\assets\1559548290273.png)

- 数据库中的表的结构

![1559548228116](C:\Users\34662\Desktop\我的文档\NodeBlog\assets\1559548228116.png)

- 以上，第二列是数据类型，`varchar(20)` 表示最大长度为20，`Y` 表示yes。

#### 1.3.1.2 博客内容

- 表的结构

  ![1559548447631](C:\Users\34662\Desktop\我的文档\NodeBlog\assets\1559548447631.png)



- 数据库表的结构

  ![1559548672609](C:\Users\34662\Desktop\我的文档\NodeBlog\assets\1559548672609.png)

- 上图，`longtext` 用于存储大量数据，最多可达4G。`bigint(20)` 存储超过 int 的数字。





### 1.3.2 数据库操作

#### 1.3.2.1 增加和查询

```mysql
use myblog; /* 使用 myblog 表 */ 
show tables; /* 展示表 */
-- show tables; // 注释

/********** 增加 **************/
insert into users(username, `password`, realname) values ('lisi', '123456', '李四'); /* 增加数据 关键字要用``包裹*/ 

/********** 查询数据 **********/
select * from users; /* 查询 users 中所有列 */
select idusers,username from users; /* 查询 指定列  */
select * from users where username='zhangsan'; /* 查询指定的数据 */
select * from users where username='zhangsan' and `password`='123456'; /* 多条件查询指定的数据 */
select * from users where username='zhangsan' or `password`='123456'; /* or表示或者 */
select * from users where username like '%zhang%'; /* 模糊查询 */
select * from users where username like '%zhang%' order by id; /* order by id 以ID排序，默认正序，接上desc为倒叙 */
```



#### 1.3.2.2 更新 和 删除

- 鉴于以前出现的数据大表误更新和全表误删除操作。影响服务使用和数据安全。为了防止线上业务出现以下3种情况影响线上服务的正常使用和不小心全表数据删除:

  > 1:没有加where条件的全表更新操作 ;
  >
  > 2:加了where 条件字段，但是where 字段 没有走索引的表更新 ;
  >
  > 3:全表delete 没有加where 条件 或者where 条件没有 走索引。
  >
  > 以上3种情况现在都不能正常进行操作。

- 会出现以下错误提示:

  > MySQL:
  >
  > ERROR 1175 (HY000): You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column

- 解决方案:

  > 对应错误的表需要增加对应where 条件字段的索引， 如果真要删除全表记录。联系DBA 进行处理。



- 语法的设置，管理员进入MySQL

  ```mysql
  SET SQL_SAFE_UPDATES=0;
  ```

  

- 更新操作

  ```mysql
  update users set realname='李四2' where username='lisi'; /* 将username等于lisi的realname替换为 '李四2' */
  update users set realname='李四2',username='xiaoyang' where username='lisi'; /* 更新多个 */
  ```



- 删除操作

  ```mysql
  delete from users where username='lisi';
  ```

  

- 在真正的查询和删除操作的时候我们通常需要添加一列叫做`state`的状态，类型为 INT，默认值为1。值为1的时候说明是可用的。在需要删除一个数据的时候我们只需要将state设置为0，也就是假删除。那么查询数据的时候只需要查state值为1的就行了。

  ```mysql
  select * from users where state='1'; /* 展示 state 等于1的数据 */
  update users set state='0' where username='lisi'; /* 将username为 lisi 的数据的 state值改为0 */
  select * from users where state='1'; /* 再次展示 state 为1的数据，发现 lisi 已经不见了 */
  select * from users where state<>'1'; /* state不等于0 */
  ```

- 以上这种删除称之为软删除



### 1.3.3 Node.js 操作数据库

- 启动 mysql 

  ```shell
  net start mysql
  ```

- 安装 MySQL

  ```shell
  npm i mysql
  ```

- 操作

  ```js
  const mysql = require('mysql');
  
  // 创建连接对象
  const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2691716451Yang',
      port: '3306',
      database: 'myblog'
  })
  
  // 开始连接
  con.connect();
  
  // 执行sql 语句
  const sql = 'select * from users;'
  con.query(sql, (err, result) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log(result);
  
  })
  
  // 关闭连接
  con.end();
  ```


- 封装函数

  ```js
  const mysql = require('mysql');
  const {
      MYSQL_CONFIG
  } = require('../config/db');
  
  // 创建连接对象
  const con = mysql.createConnection(MYSQL_CONFIG)
  
  // 开始连接
  con.connect();
  
  // 统一 执行sql 的函数
  
  function exec(sql) {
      return new Promise((resolve, reject) => {
          con.query(sql, (err, result) => {
              if (err) {
                  reject(err);
                  return;
              }
              resolve(result);
          })
      })
  }
  
  module.exports = {
      exec
  }
  ```

- 其中 `MYSQL_CONFIG` 为环境变量配置

  ```js
  /* mysql 环境配置 */
  const env = process.env.NODE_ENV // 环境参数
  
  let MYSQL_CONFIG
  
  // 开发环境
  if (env === 'dev') {
      MYSQL_CONFIG = {
          host: 'localhost',
          user: 'root',
          password: '2691716451Yang',
          port: '3306',
          database: 'myBlog'
      }
  }
  
  // 线上环境
  if (env === 'prd') {
      MYSQL_CONFIG = {
          host: 'localhost',
          user: 'root',
          password: '2691716451Yang',
          port: '3306',
          database: 'myBlog'
      }
  }
  
  module.exports = {
      MYSQL_CONFIG
  }
  ```

  



## 1.4 登录

### 1.4.1 cookie 用于登录验证

- 查看 cookie
- 修改 cookie
- 实现登录验证

```js
res.setHeader('Set-Cookie', `username=${data.username};path=/;httpOnly;expires=${setCookieExpires()}`) //path保证这个路径下的都可以访问cookie httpOnly保证客服端不能修改 expires设置过期时间
```

```js
// 设置 cookie 过期时间
const setCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + 24 * 3600 * 1000)
    return d.toGMTString()
}
```



![1564556663839](C:\Users\34662\Desktop\我的开发\Node_Project\assets\1564556663839.png)

![1564556696677](C:\Users\34662\Desktop\我的开发\Node_Project\assets\1564556696677.png)



![1564647581846](C:\Users\34662\Desktop\我的开发\Node_Project\assets\1564647581846.png)



```
location / {
	proxy_pass http://localhost:8001;
	}
	 location /api/ {
	proxy_pass http://localhost:8000;
	proxy_set_header Host $host;
	}
```





### 1.4.2 express-session 和 express-radis

- session 设置

```
// session 设置
app.use(session({
  secret: 'XiaoDingYang',
  cookie: {
    path: '/', // 默认配置
    httpOnly: true, // 默认配置
    maxAge: 24 * 3600 * 1000 // 过期时间，24小时之后过期
  }

}))
```



















































