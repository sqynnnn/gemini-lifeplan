// pages/settings.tsx (设置与同步页面)

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { auth } from '../services/firebase'; 
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
            } else {
                setUserId(null);
                setEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("已成功退出登录！");
            navigate('/login');
        } catch (error: any) {
            alert("退出登录失败：" + error.message);
        }
    };

    if (loading) {
        return <div>设置与同步页面加载中...</div>;
    }

    return (
        <div className="p-8 text-white bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">设置与同步</h1>
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">云端同步状态: {userId ? "✅ 已连接" : "❌ 未连接"}</h2>
            
            {userId ? (
                <div className="space-y-3 p-4 border border-gray-700 rounded-lg bg-gray-800">
                    <p>邮箱: <strong>{email}</strong></p>
                    <p>用户ID (UID): <code className="bg-gray-700 p-1 rounded text-sm">{userId}</code></p>
                    <p className="text-green-400">所有数据都在 **实时自动同步** 中。</p>
                    <button 
                        onClick={handleLogout} 
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
                    >
                        退出登录
                    </button>
                </div>
            ) : (
                <div className="space-y-3 p-4 border border-red-700 rounded-lg bg-gray-800">
                    <p className="text-red-400">数据同步功能需要登录。</p>
                    <p>
                        <button onClick={() => navigate('/login')} className="font-medium text-cyan-400 hover:text-cyan-300 mr-4">去登录</button>
                        <button onClick={() => navigate('/signup')} className="font-medium text-cyan-400 hover:text-cyan-300">去注册</button>
                    </p>
                </div>
            )}
        </div>
    );
};