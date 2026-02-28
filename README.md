# AR眼镜应用下载中心

智能眼镜及AR设备应用下载中心，汇集XREAL、Rokid、INMO、VITURE等品牌官方应用及社区应用。

## 功能特性

- 📱 收录主流AR/AI智能眼镜品牌应用
- 🔍 实时搜索和品牌筛选
- 🎨 现代暗色主题设计，契合AR/VR风格
- ⚡ 静态网站，快速加载
- 🌐 支持GitHub Pages免费托管

## 支持的品牌

- ClassicOldSong（AirBeam、Apollo、GameStream）
- EVEN Realities（EVEN G1 App、EVEN App）
- INAIR（INAIR Space、INAIR App）
- INMO（INMO App、Go App、INMOLENS）
- LaWake（李未可 Go App）
- Mentra（MentraOS）
- MLVision（玄景秘视、MLVision）
- RayNeo（雷鸟XR眼镜App、雷鸟AR眼镜App）
- Rokid（Rokid AI App、Rokid AR App）
- VertoXR
- VITURE（SpaceWalker、Immersive 3D）
- XREAL（Nebula）
- 形意智能

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/ar-glasses-apk-hub.git
cd ar-glasses-apk-hub

# 使用Python启动本地服务器
python3 -m http.server 8080

# 或使用Node.js
npx serve
```

然后访问 http://localhost:8080

## 部署到GitHub Pages

1. 在GitHub上创建新仓库
2. 推送代码到main分支
3. 进入仓库设置 → Pages
4. Source选择"Deploy from a branch"
5. Branch选择"main"，目录选择"/ (root)"
6. 保存后即可通过 `https://你的用户名.github.io/仓库名` 访问

## 添加新应用

编辑 `data/apps.json` 文件，添加新的应用条目：

```json
{
    "id": "unique-id",
    "name": "应用名称",
    "brand": "品牌名称",
    "version": "版本号",
    "description": "应用描述",
    "downloadUrl": "下载链接",
    "source": "来源(GitHub/官网/APKPure)",
    "tags": ["标签1", "标签2"]
}
```

## 托管APK文件

如需直接在GitHub上托管APK文件：

1. 进入仓库的Releases页面
2. 创建新版本（Draft a new release）
3. 上传APK文件
4. 发布后获取下载链接
5. 将链接更新到 `data/apps.json` 中

注意：GitHub单个文件限制2GB，建议用于小型APK或作为官方链接的备份。

## 注意事项

- 本项目仅提供应用下载链接，所有应用版权归各品牌厂商所有
- 部分应用可能需要特定地区的应用商店账户
- 建议优先下载官方渠道的应用

## 许可证

MIT License

---

最后更新：2026年2月28日