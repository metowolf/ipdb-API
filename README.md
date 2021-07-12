<p align="center"><img src="https://user-images.githubusercontent.com/2666735/87228491-2d607280-c3d4-11ea-8e44-97353bc78dff.png"></p>

<h1 align="center">IP database REST API</h1>

<h3 align="center">
Open Source REST API for IP database, includes qqwry, ipipdotnet.
</h3>

## Usage

```http
GET http://localhost:3000/v1/qqwry/119.29.29.29
```

```json
{
  "ip": "119.29.29.29",
  "country_name": "中国",
  "region_name": "广东",
  "city_name": "广州",
  "owner_domain": "cloud.tencent.com",
  "isp_domain": ""
}
```

```http
GET http://localhost:3000/v1/qqwry/me
```

```json
{
  "ip": "127.0.0.1",
  "country_name": "本机地址",
  "region_name": "本机地址",
  "city_name": "",
  "owner_domain": "",
  "isp_domain": ""
}
```