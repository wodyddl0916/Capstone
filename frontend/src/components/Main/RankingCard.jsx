import React from 'react';

export default function RankingCard() {
  return (
    <div className="card">
      <h3>🏆 이번 달 명예의 전당</h3>
      <p style={{ fontSize: '18px', color: '#888', marginTop: '-15px', marginBottom: '25px' }}>
        가장 많은 에너지를 절약한 이웃들입니다.
      </p>
      <ul className="hof-list">
        <li><span className="hof-rank">1</span><span className="hof-name">김성진</span><span className="hof-score">-18% 절감</span></li>
        <li><span className="hof-rank">2</span><span className="hof-name">박재용</span><span className="hof-score">-15% 절감</span></li>
        <li><span className="hof-rank">3</span><span className="hof-name">이건양</span><span className="hof-score">-12% 절감</span></li>
        <li><span className="hof-rank">4</span><span className="hof-name">김도형</span><span className="hof-score">-9% 절감</span></li>
        <li><span className="hof-rank">5</span><span className="hof-name">김성준</span><span className="hof-score">-6% 절감</span></li>
      </ul>
    </div>
  );
}