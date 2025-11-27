// App.tsx (修复后的主路由文件)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // 导入认证状态检查
import { auth } from './services/firebase'; // 导入 Firebase 认证实例

// 导入所有页面
import { Dashboard as DashboardPage } from './pages/Dashboard'; // 假设这是您的主页
import { LoginPage } from './pages/login';      // 新建的登录页
import { SignupPage } from './pages/signup';    // 新建的注册页
import { SettingsPage } from './pages/settings';  // 新建的设置页

// 导入布局组件
import { Layout } from './components/Layout'; // 假设您的布局组件在这里

// ----------------------------------------------------
// 1. 认证状态包装器 (用于保护需要登录才能访问的路由)
// ----------------------------------------------------
interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [user, setUser] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 监听用户的登录状态变化
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // 可以在这里显示一个加载动画
    return <div style={{ color: 'white', backgroundColor: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>加载中...</div>;
  }

  // 如果用户未登录，导航到登录页
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 如果用户已登录，显示被保护的组件（带 Layout）
  return <Layout>{element}</Layout>;
};


// ----------------------------------------------------
// 2. 主应用路由
// ----------------------------------------------------
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ------------------------------------------------- */}
        {/* A. 认证路由 (不需要 Layout, 且不需要登录即可访问) */}
        {/* ------------------------------------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ------------------------------------------------- */}
        {/* B. 受保护的路由 (需要登录才能访问, 且需要 Layout 布局) */}
        {/* ------------------------------------------------- */}
        {/* DashboardPage 是主页 */}
        <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
        
        {/* SettingsPage 可以在 Layout 内访问 */}
        <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} /> 

        {/* 404 页面 */}
        <Route path="*" element={<Layout><div>404 Not Found</div></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;