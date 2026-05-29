import React, { useMemo, useState } from 'react';

export const TARIFFS = {
  low: {
    label: '아파트 저압',
    description: '저압으로 공급되는 아파트 세대 기준',
    baseFees: [
      { limit: 100, fee: 400 },
      { limit: 200, fee: 890 },
      { limit: 300, fee: 1560 },
      { limit: 400, fee: 3750 },
      { limit: 500, fee: 7110 },
      { limit: Infinity, fee: 12600 },
    ],
    tiers: [
      { label: '100kWh까지', from: 0, to: 100, rate: 59.1 },
      { label: '다음 100kWh까지', from: 100, to: 200, rate: 122.6 },
      { label: '다음 100kWh까지', from: 200, to: 300, rate: 183 },
      { label: '다음 100kWh까지', from: 300, to: 400, rate: 273.2 },
      { label: '다음 100kWh까지', from: 400, to: 500, rate: 406.7 },
      { label: '500kWh 초과', from: 500, to: Infinity, rate: 690.8 },
    ],
  },
  high: {
    label: '아파트 고압',
    description: '아파트 단일계약 등 고압 공급 세대 기준',
    baseFees: [
      { limit: 100, fee: 400 },
      { limit: 200, fee: 710 },
      { limit: 300, fee: 1230 },
      { limit: 400, fee: 3090 },
      { limit: 500, fee: 5900 },
      { limit: Infinity, fee: 10480 },
    ],
    tiers: [
      { label: '100kWh까지', from: 0, to: 100, rate: 56.1 },
      { label: '다음 100kWh까지', from: 100, to: 200, rate: 96.3 },
      { label: '다음 100kWh까지', from: 200, to: 300, rate: 143.4 },
      { label: '다음 100kWh까지', from: 300, to: 400, rate: 209.9 },
      { label: '다음 100kWh까지', from: 400, to: 500, rate: 317.1 },
      { label: '500kWh 초과', from: 500, to: Infinity, rate: 559.5 },
    ],
  },
};

const formatWon = (value) => `${Math.max(0, Math.floor(value)).toLocaleString()}원`;
const formatKwh = (value) => `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}kWh`;

const getBaseFee = (usage, tariff) => tariff.baseFees.find((tier) => usage <= tier.limit)?.fee ?? 0;

export const calculateElectricBill = (usage, tariffType = 'low') => {
  const safeUsage = Math.max(0, Number(usage) || 0);
  const tariff = TARIFFS[tariffType];
  const baseFee = getBaseFee(safeUsage, tariff);

  const tierLines = tariff.tiers.map((tier) => {
    const used = Math.max(0, Math.min(safeUsage, tier.to) - tier.from);
    return {
      ...tier,
      used,
      amount: used * tier.rate,
    };
  });

  const energyCharge = Math.floor(tierLines.reduce((sum, tier) => sum + tier.amount, 0));
  const electricCharge = baseFee + energyCharge;
  const vat = Math.round(electricCharge * 0.1);
  const fund = Math.floor((electricCharge * 0.037) / 10) * 10;
  const total = Math.floor((electricCharge + vat + fund) / 10) * 10;

  return {
    baseFee,
    energyCharge,
    electricCharge,
    vat,
    fund,
    total,
    tierLines,
  };
};

const getMonthProgress = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const currentDay = today.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();

  return {
    year,
    month,
    currentDay,
    daysInMonth,
    ratio: currentDay / daysInMonth,
  };
};

const ElectricBillEstimator = ({ monthlyUsage = 0, summaryYear, summaryMonth, view = 'estimate' }) => {
  const [tariffType, setTariffType] = useState('high');
  const [manualUsage, setManualUsage] = useState('');
  const monthProgress = useMemo(getMonthProgress, []);
  const isTariffOnly = view === 'tariff';

  const measuredUsage = Number(monthlyUsage) || 0;
  const projectedUsage = measuredUsage > 0
    ? measuredUsage / Math.max(monthProgress.ratio, 0.01)
    : 0;
  const displayUsage = manualUsage === '' ? projectedUsage : Number(manualUsage);
  const bill = useMemo(() => calculateElectricBill(displayUsage, tariffType), [displayUsage, tariffType]);
  const tariff = TARIFFS[tariffType];

  return (
    <section className="bill-estimator" id="bill-estimator">
      <div className="bill-estimator__header">
        <div>
          <p className="section-kicker">KEPCO 아파트 전기요금 기준</p>
          <h2>{isTariffOnly ? '아파트 전기요금표' : '이번 달 아파트 전기요금 예측'}</h2>
          <p>
            {isTariffOnly
              ? '아파트 저압과 아파트 고압 계약의 누진 구간별 기본요금과 전력량 요금을 확인할 수 있습니다.'
              : `${summaryYear}년 ${summaryMonth}월 누적 사용량을 이번 달 진행률로 환산해 월말 예상 사용량과 청구 예상액을 계산합니다.`}
          </p>
        </div>

        <div className="bill-estimator__controls" aria-label="전기요금 계산 조건">
          <div className="segmented-control">
            {Object.entries(TARIFFS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={tariffType === key ? 'active' : ''}
                onClick={() => setTariffType(key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {!isTariffOnly && (
            <label className="usage-input">
              <span>예상 사용량 직접 입력</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={manualUsage}
                placeholder={projectedUsage ? projectedUsage.toFixed(1) : '0'}
                onChange={(event) => setManualUsage(event.target.value)}
              />
              <em>kWh</em>
            </label>
          )}
        </div>
      </div>

      {!isTariffOnly && (
        <div className="bill-estimator__grid">
          <div className="bill-card bill-card--primary">
            <span>예상 청구요금</span>
            <strong>{formatWon(bill.total)}</strong>
            <p>{tariff.description}</p>
          </div>

          <div className="bill-card">
            <span>이번 달 누적 사용량</span>
            <strong>{formatKwh(measuredUsage)}</strong>
            <p>{monthProgress.month}월 {monthProgress.currentDay}일 기준</p>
          </div>

          <div className="bill-card">
            <span>월말 예상 사용량</span>
            <strong>{formatKwh(displayUsage)}</strong>
            <p>{monthProgress.daysInMonth}일 기준으로 단순 환산</p>
          </div>

          <div className="bill-card">
            <span>전기요금계</span>
            <strong>{formatWon(bill.electricCharge)}</strong>
            <p>기본요금 + 전력량요금</p>
          </div>
        </div>
      )}

      <div className={`bill-detail ${isTariffOnly ? 'bill-detail--single' : ''}`}>
        <div className="bill-table-wrap">
          <div className="bill-table-title">
            <h3>{tariff.label} 누진 요금표</h3>
            <a href="https://home.kepco.co.kr/kepco/front/html/CY/E/E/CYEEHP00101.html" target="_blank" rel="noreferrer">
              한전 요금표 보기
            </a>
          </div>

          <table className="tariff-table">
            <thead>
              <tr>
                <th>사용량 구간</th>
                <th>기본요금</th>
                <th>전력량 요금</th>
                {!isTariffOnly && <th>이번 달 적용량</th>}
              </tr>
            </thead>
            <tbody>
              {tariff.tiers.map((tier, index) => (
                <tr key={tier.label + index} className={bill.tierLines[index].used > 0 ? 'active-row' : ''}>
                  <td>{tier.label}</td>
                  <td>{formatWon(tariff.baseFees[index].fee)}</td>
                  <td>{tier.rate.toLocaleString()}원/kWh</td>
                  {!isTariffOnly && <td>{formatKwh(bill.tierLines[index].used)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isTariffOnly && <div className="bill-breakdown">
          <h3>예상 요금 상세</h3>
          <dl>
            <div>
              <dt>기본요금</dt>
              <dd>{formatWon(bill.baseFee)}</dd>
            </div>
            <div>
              <dt>전력량요금</dt>
              <dd>{formatWon(bill.energyCharge)}</dd>
            </div>
            <div>
              <dt>부가가치세</dt>
              <dd>{formatWon(bill.vat)}</dd>
            </div>
            <div>
              <dt>전력산업기반기금</dt>
              <dd>{formatWon(bill.fund)}</dd>
            </div>
            <div className="total">
              <dt>청구 예상액</dt>
              <dd>{formatWon(bill.total)}</dd>
            </div>
          </dl>
          <p className="bill-note">
            TV수신료, 복지할인, 대가족 할인, 기후환경요금, 연료비조정액 등은 제외한 참고용 예측입니다.
          </p>
        </div>}
      </div>
    </section>
  );
};

export default ElectricBillEstimator;
