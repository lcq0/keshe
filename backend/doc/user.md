# Part1 用户管理

## 1.1. 用户注册

### HTTP请求

`post /api/v1/register`

### Request 请求参数

| 参数名                            | 是否必需| 描述                        |
| -------------------------------- | ------ | -------------------------- |
| name                             |    是  |  用户名称                    |
| description                      |    否  |  个性签名                    |
| birthday                         |    否  |  生日 year-month-day        |
| sex                              |    否  |  性别                       |
| phone                            |    否  |  phone                      |
| weixin                           |    否  |  微信号                      |
| tag                              |    否  |  标签                       |
| question                         |    否  |  问题                       |
| address                          |    否  |  住址                       |
| headImg                          |    否  |  头像                       |
| password                         |    是  |  密码                       |
| checkpass                        |    是  |  确认密码                    |

#### 请求示例
`post /api/v1/register`
```json
{
  "name": "顾华年",
  "password": "xiafeng37513",
  "checkpass": "xiafeng37513",
  "sex": "男",
  "phone": "17075253856",
  "description": "夫子有多高",
  "birthday": "1993-12-03",
  "weixin": "guhuanian",
  "tag": ["优雅", "风趣"],
  "question": [{
		"question": "你喜欢周杰伦",
		"answer": [
			{
				"type": 1,
				"answer": "喜欢"
			}, {
				"type": 2,
				"answer": "不确定"
			}, {
				"type": 0,
				"answer": "不喜欢"
			}
		]
	}],
	"address": "上海",
	"headImg": "http://www.material-ui.com/images/jsa-128.jpg"
}
```

### Response 响应

> 响应数据:

```json
true
```