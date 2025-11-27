import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase'; 
import { Map, Users, Eye, ListTodo, BookOpen, LineChart } from 'lucide-react'; // 导入所有图标

// 导入所有页面和组件
import { Dashboard } from './pages/Dashboard';
import { Daily } from './pages/Daily';
import { Review } from './pages/Review';
import { Learning } from './pages/Learning';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { SettingsPage } from './pages/settings';
import Layout from './components/Layout'; 
import { ModularPage } from './components/ModularPage';
import { StorageService } from './services/storage';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', backgroundColor: '#1e1e1e', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>加载中...</div>;
  }

  // 如果用户未登录，导航到登录页
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 如果用户已登录，显示被保护的组件（手动包裹 Layout）
  return <Layout>{element}</Layout>; // ⬅️ 关键：这里已经手动包裹了一次 Layout
};


// ----------------------------------------------------
// 2. 主应用路由
// ----------------------------------------------------
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        {/* A. 认证路由 (不需要 Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* B. 受保护的主应用路由 (使用 ProtectedRoute 自动检查登录并添加 Layout) */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/daily" element={<ProtectedRoute element={<Daily />} />} />
        <Route path="/review" element={<ProtectedRoute element={<Review />} />} />
        <Route path="/learning" element={<ProtectedRoute element={<Learning />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} /> 

        {/* C. 受保护的 ModularPage 路由 */}
        <Route path="/life" element={<ProtectedRoute element={
            <ModularPage 
              storageKey={StorageService.KEYS.LIFE_PAGES}
              title="Life Planning"
              icon={Map}
              color="gold"
            />
        } />} />
        
        <Route path="/social" element={<ProtectedRoute element={
            <ModularPage 
              storageKey={StorageService.KEYS.SOCIAL_PAGES}
              title="Social CRM"
              icon={Users}
              color="purple-500"
            />
        } />} />

        <Route path="/self" element={<ProtectedRoute element={
            <ModularPage 
              storageKey={StorageService.KEYS.SELF_OBS_PAGES}
              title="Self Observation"
              icon={Eye}
              color="pink-500"
            />
        } />} />

        {/* 404 页面 */}
        <Route path="*" element={<Layout><div>404 Not Found</div></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;