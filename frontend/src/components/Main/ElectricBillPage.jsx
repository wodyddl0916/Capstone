import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ElectricBillEstimator from './ElectricBillEstimator';

const now = new Date();
const SUMMARY_YEAR = now.getFullYear();
const SUMMARY_MONTH = now.getMonth() + 1;

const ElectricBillPage = ({ view = 'tariff' }) => {
  const [monthlyUsage, setMonthlyUsage] = useState(0);

  useEffect(() => {
    const fetchMonthlyUsage = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setMonthlyUsage(0);
        return;
      }

      try {
        const response = await axios.get('http://43.201.202.195:8080/api/power/monthly', {
          params: {
            userId: parseInt(userId, 10),
            year: SUMMARY_YEAR,
          },
        });

        const monthData = response.data.find((item) => Number(item.month) === SUMMARY_MONTH);
        setMonthlyUsage(monthData ? Number(parseFloat(monthData.usage).toFixed(2)) : 0);
      } catch (error) {
        console.error('전기요금 예측용 월간 사용량 로드 실패:', error);
        setMonthlyUsage(0);
      }
    };

    fetchMonthlyUsage();
  }, []);

  return (
    <div className="bill-page">
      <ElectricBillEstimator
        monthlyUsage={monthlyUsage}
        summaryYear={SUMMARY_YEAR}
        summaryMonth={SUMMARY_MONTH}
        view={view}
      />
    </div>
  );
};

export default ElectricBillPage;
