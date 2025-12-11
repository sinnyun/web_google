# 主页加载动画调试说明

## 🎯 调试目的
调试主页加载动画，优化从加载画面到主页幻灯片显示的完整流程。

## 📁 文件说明
- `components/LoadingDebug.tsx` - 独立的调试组件
- `pages/Home.tsx` - 原始主页组件（需要保持不变）

## 🚀 如何开始调试

### 1. 临时替换主页组件
在 `App.tsx` 或路由配置中：

```typescript
// 原始代码
import Home from './pages/Home';
// <Home />

// 调试代码
import LoadingDebug from './components/LoadingDebug';
<LoadingDebug />
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 观察循环动画
页面将自动循环播放：
1. 图片网格逐个淡入
2. 完整显示2秒
3. 所有图片滑出屏幕
4. 短暂停顿后重新开始

## 🎛️ 可调参数

在 `LoadingDebug.tsx` 中的 `DEBUG_CONFIG` 对象：

```typescript
const DEBUG_CONFIG = {
  minLoadingDelay: 1200,     // 最小加载延迟 (毫秒)
  displayDuration: 2000,     // 显示停留时间 (毫秒)
  cycleInterval: 1000,        // 循环间隔 (毫秒)
  staggerDelay: 0.02,         // 元素错开时间 (秒)
  exitDuration: 1.5,          // 退出动画时长 (秒)
  showDebugInfo: true,        // 显示调试信息
};
```

## 🎨 动画流程

1. **加载阶段** (`loading`)
   - 图片逐个淡入
   - 错开时间：0.02秒/个

2. **显示阶段** (`loaded`)
   - 完整网格停留
   - 时长：2秒

3. **退出阶段** (`exiting`)
   - 偶列向上滑出
   - 奇列向下滑出

4. **循环重启**
   - 延迟1秒后重新开始

## 📊 调试信息

左上角显示实时调试信息：
- 当前循环次数
- 动画阶段
- 主图路径
- 阶段说明

## ✅ 调试完成后的操作

1. **恢复原始路由**
```typescript
// 恢复为原始代码
import Home from './pages/Home';
<Home />
```

2. **合并优化参数**
将调试好的参数应用到 `pages/Home.tsx` 的 Preloader 组件中

3. **清理调试文件**
```bash
# 可选：删除调试文件
rm components/LoadingDebug.tsx
rm DEBUG_LOADING.md
```

## 🔧 常见问题

### Q: 动画卡顿怎么办？
A: 检查图片资源是否加载完成，可以增加 `minLoadingDelay`

### Q: 如何只播放一次？
A: 将 `LoadingDebug` 组件中的循环逻辑注释掉

### Q: 如何调整动画速度？
A: 修改 `staggerDelay` 和 `exitDuration` 参数

### Q: 调试信息太乱怎么办？
A: 设置 `showDebugInfo: false` 隐藏调试面板

## 📝 注意事项

- ⚠️ 调试期间不要提交代码
- ⚠️ 保持原始 Home.tsx 不变
- ⚠️ 确保所有图片路径正确
- ⚠️ 测试不同屏幕尺寸的效果
- ⚠️ 调试完成后清理所有调试代码

---

🎯 **目标**: 找到最佳的动画参数组合，创造流畅自然的加载体验