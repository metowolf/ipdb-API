<p align="center"><img src="https://user-images.githubusercontent.com/2666735/87228491-2d607280-c3d4-11ea-8e44-97353bc78dff.png"></p>

<h1 align="center">IP database REST API</h1>

<h3 align="center">
Open Source REST API for IP database, includes qqwry, ipipdotnet.
</h3>

## Usage

```http
GET https://api.i-meto.com/ip/v1/qqwry/119.29.29.29
```

```json
{
  "ip": "119.29.29.29",
  "country_name": "中国",
  "region_name": "广东",
  "city_name": "广州",
  "owner_domain": "cloud.tencent.com",
  "isp_domain": "",
  "range": {
    "from": "119.29.0.0",
    "to": "119.29.127.255"
  }
}
```

```http
GET https://api.i-meto.com/ip/v1/ipip/119.29.29.29
```

```json
{
  "ip": "119.29.29.29",
  "country_name": "DNSPOD.COM",
  "region_name": "DNSPOD.COM",
  "city_name": "",
  "owner_domain": "",
  "isp_domain": "",
  "range": {
    "from": "119.29.29.0",
    "to": "119.29.29.255"
  }
}
```