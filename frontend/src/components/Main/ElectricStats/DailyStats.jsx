import React from "react";

const DailyStats = () => {
  return (
    <div className="electric-page">
      {/* 컴포넌트 내부에 직접 CSS 삽입 */}
      <style>{`
        .electric-page { width: 100%; min-height: calc(100vh - 100px); background: #f4f7fb; padding: 50px 0 80px; color: #222; }
        .electric-header { width: 70%; margin: 0 auto 30px; }
        .electric-header h1 { font-size: 36px; font-weight: 800; margin-bottom: 10px; }
        .electric-header p { font-size: 15px; color: #666; }
        .electric-filter { width: 70%; min-height: 70px; margin: 0 auto 24px; padding: 0 28px; background: #ffffff; border: 1px solid #d9dee7; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06); display: flex; align-items: center; justify-content: space-between; }
        .filter-group { display: flex; align-items: center; gap: 10px; }
        .filter-group span { font-size: 15px; font-weight: 700; color: #1f4e93; }
        .filter-group select { height: 32px; padding: 0 10px; border: 1px solid #b8c1cc; background: white; }
        .search-btn { width: 82px; height: 36px; background: #0b4c91; color: white; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; }
        .search-btn:hover { background: #083a70; }
        .electric-section-title { width: 70%; height: 58px; margin: 0 auto 24px; background: linear-gradient(#ffffff, #f2f4f7); border: 1px solid #d9dee7; display: flex; align-items: center; }
        .electric-section-title span { width: 28px; height: 38px; margin-left: 22px; margin-right: 20px; background: #4b79c7; clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%); }
        .electric-section-title h2 { font-size: 21px; font-weight: 800; color: #0b4c91; }
        .chart-box { width: 70%; height: 360px; margin: 0 auto 28px; background: #ffffff; border: 1px solid #cbd5e1; padding: 24px; }
        .chart-placeholder { width: 100%; height: 100%; border: 2px dashed #cbd5e1; background: #f8fafc; color: #8a94a6; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; }
        .summary-box { width: 70%; margin: 0 auto 26px; background: #ffffff; border-top: 1px solid #bfc6d1; border-bottom: 1px solid #bfc6d1; display: grid; grid-template-columns: repeat(4, 1fr); }
        .summary-box div { height: 68px; border-right: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #333; }
        .summary-box div:last-child { border-right: none; }
        .table-box { width: 70%; margin: 0 auto; background: #ffffff; }
        .table-box table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .table-box th { height: 46px; background: #f7f7f7; border: 1px solid #c9cdd3; font-weight: 800; color: #333; }
        .table-box td { height: 42px; border: 1px solid #c9cdd3; text-align: center; color: #777; }
        @media (max-width: 1200px) {
          .electric-header, .electric-filter, .electric-section-title, .chart-box, .summary-box, .table-box { width: 90%; }
          .electric-filter { flex-direction: column; align-items: flex-start; padding: 18px; gap: 14px; }
          .summary-box { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="electric-header">
        <h1>일별</h1>
        <p>전기사용량을 일별 기준으로 확인하는 페이지입니다.</p>
      </div>

      <div className="electric-filter">
        <div className="filter-group">
          <span>월선택</span>
          <select>
            <option>2026년</option>
          </select>
          <select>
            <option>05월</option>
          </select>
        </div>

        <button className="search-btn">조회</button>
      </div>

      <div className="electric-section-title">
        <span></span>
        <h2>일별 전기사용량</h2>
      </div>

      <div className="chart-box">
        <div className="chart-placeholder">그래프 영역</div>
      </div>

      <div className="summary-box">
        <div>최대 kWh</div>
        <div>최소 kWh</div>
        <div>평균 kWh</div>
        <div>사용량 합계</div>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>일자</th>
              <th>사용량(kWh)</th>
              <th>전년동일(kWh)</th>
              <th>요금(원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4">데이터 영역</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyStats;