# LINE-CERT
access.line.meで自動的にID,Password,Certを設定するためのChrome拡張。

## ユーザーの追加
assets/line_accounts.jsonに以下の形式で保存。

```$json
[
    {
        "id": 255,
        "email": "aaa@example.com",
        "password": "hogefuga",
        "cert": "xxxxx"
    },
    {
        "id": 65535,
        "email": "xxx@example.com",
        "password": "hogehoge",
        "cert": "zzzzzz"
    }
]
```