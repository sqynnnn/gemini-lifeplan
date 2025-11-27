// services/database.ts (数据同步逻辑)

import { db, auth } from './firebase'; 
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import React from 'react'; // 导入 React，因为 setStateAction 需要它

const PLANS_COLLECTION = "plans"; 

interface Plan { // 定义计划的结构
    id: string;
    content: string;
    completed: boolean;
}

// 1. 保存计划到云端
export const saveNewPlan = async (planContent: string) => {
  const user = auth.currentUser;
  if (!user) { throw new Error("用户未登录，无法保存数据。"); }
  
  await addDoc(collection(db, PLANS_COLLECTION), {
    userId: user.uid, // 关联到用户ID
    content: planContent,
    createdAt: serverTimestamp()
  });
};

// 2. 实时从云端读取计划
export const subscribeToUserPlans = (setPlans: React.Dispatch<React.SetStateAction<Plan[]>>) => {
  const user = auth.currentUser;
  if (!user) return () => {}; 

  const userPlansQuery = query(
    collection(db, PLANS_COLLECTION),
    where("userId", "==", user.uid) // 只读取当前用户的数据
  );

  const unsubscribe = onSnapshot(userPlansQuery, (querySnapshot) => {
    const plansArray: Plan[] = [];
    querySnapshot.forEach((doc) => {
      plansArray.push({ id: doc.id, ...doc.data() } as Plan);
    });
    setPlans(plansArray); // 实时更新前端列表
  });
  return unsubscribe;
};