import React, { useState } from 'react';
import axios from 'axios';
import ElectricStats from '../ElectricStats'; 

const DataUpload = () => {
  // 탭 상태 관리 ('계약정보', '요금정보', '사용량정보')
  const [activeTab, setActiveTab] = useState('사용량정보');

  // 기존 파일 업로드 및 분석 상태 관리
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null); 

  const FASTAPI_URL = "http://43.201.202.195:8000/predict";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setUploadMessage('');
    setAnalysisData(null); 
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('먼저 파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setUploadMessage('');

    try {
      const response = await axios.post(FASTAPI_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setAnalysisData(response.data); 
      setUploadMessage('한 달 단위 전력 분석이 완료되었습니다.');
      alert("한 달 단위 전력 분석이 완료되었습니다!");
    } catch (err) {
      console.error(err);
      alert("분석 중 오류가 발생했습니다. CSV 데이터가 충분한지(30일치 이상) 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // UI 스타일 객체 모음 (한전 웹사이트 스타일 모방)
  const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', fontFamily: '"Malgun Gothic", sans-serif', padding: '20px', color: '#333' },
    headerTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' },
    breadcrumb: { fontSize: '13px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center' },
    topInfoBox: { backgroundColor: '#f8f9fa', borderTop: '3px solid #1a5c96', borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', padding: '20px', marginBottom: '30px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '120px 1fr 120px 1fr', gap: '15px', alignItems: 'center' },
    label: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eef1f6', padding: '10px', fontSize: '14px' },
    inputVal: { backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', fontSize: '14px', color: '#555' },
    tabContainer: { display: 'flex', borderBottom: '2px solid #1a5c96', marginBottom: '20px' },
    activeTab: { backgroundColor: '#1a5c96', color: '#fff', padding: '10px 30px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #1a5c96', borderBottom: 'none' },
    inactiveTab: { backgroundColor: '#f4f4f4', color: '#666', padding: '10px 30px', cursor: 'pointer', border: '1px solid #ddd', borderBottom: 'none', marginRight: '5px' },
    table: { width: '100%', borderCollapse: 'collapse', borderTop: '2px solid #666', marginBottom: '30px' },
    th: { backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', borderRight: '1px solid #ddd' },
    td: { borderBottom: '1px solid #ddd', padding: '12px', fontSize: '14px', borderRight: '1px solid #ddd', backgroundColor: '#fff' },
    uploadSection: { padding: '30px', border: '1px solid #ddd', backgroundColor: '#fff', textAlign: 'center' },
    uploadBtn: { padding: '10px 20px', backgroundColor: '#1a5c96', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginLeft: '10px' },
    fileInputLabel: { padding: '9px 20px', backgroundColor: '#fff', border: '1px solid #1a5c96', color: '#1a5c96', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  };

  return (
    <div style={styles.container}>
      {/* 1. 상단 타이틀 및 경로 */}
      <h2 style={styles.headerTitle}>마이페이지</h2>
      <div style={styles.breadcrumb}>
        <span>🏠 마이페이지 &gt; <strong>전력 데이터 업로드</strong></span>
      </div>

      

      {/* [사용량정보 탭] - 기존의 데이터 업로드 및 분석 기능 */}
      {activeTab === '사용량정보' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1a5c96' }}>■ 전력 데이터 분석</h3>
          <div style={styles.uploadSection}>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              최근 1개월 데이터가 포함된 한전 또는 MyData 엑셀/CSV 파일을 업로드하여 사용량을 예측해보세요.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
              <label style={styles.fileInputLabel}>
                {selectedFile ? '파일 변경' : '파일 선택'}
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              <input 
                type="text" 
                readOnly 
                value={selectedFile ? selectedFile.name : '선택된 파일 없음'} 
                style={{ width: '300px', padding: '9px', marginLeft: '-1px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', outline: 'none' }} 
              />

              <button
                onClick={handleUpload}
                disabled={loading}
                style={{
                  ...styles.uploadBtn,
                  backgroundColor: loading ? '#999' : '#1a5c96',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '분석 중...' : '데이터 업로드 및 예측'}
              </button>
            </div>

            {loading && (
              <p style={{ color: '#1a5c96', fontWeight: 'bold' }}>
                데이터를 분석 중입니다. 잠시만 기다려주세요...
              </p>
            )}

            {uploadMessage && !loading && (
              <p style={{ color: '#e02b20', fontWeight: 'bold' }}>
                {uploadMessage}
              </p>
            )}
          </div>

          {/* 분석 결과 렌더링 영역 (기존 코드 유지 및 스타일링) */}
          {analysisData && (
            <div style={{ marginTop: '30px' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th colSpan="4" style={{...styles.th, backgroundColor: '#fff', borderBottom: '2px solid #ccc', color: '#1a5c96'}}>월간 예측 결과 요약</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.th}>지난달 평균 사용량</td>
                    <td style={{...styles.td, fontWeight: 'bold', color: '#333'}}>
                      {analysisData.lastMonthAvg} kWh
                    </td>
                    <td style={styles.th}>다음 달 예상 사용량</td>
                    <td style={{...styles.td, fontWeight: 'bold', color: '#e02b20'}}>
                      {analysisData.nextMonthPred} kWh
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 하단 그래프 컴포넌트 */}
              <div style={{ padding: '20px', border: '1px solid #ddd', backgroundColor: '#fff' }}>
                <ElectricStats 
                  thisWeek={analysisData.lastMonthAvg} 
                  nextWeek={analysisData.nextMonthPred} 
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* [요금정보 탭] - 임시 빈 화면 */}
      {activeTab === '요금정보' && (
        <div style={{ padding: '50px', textAlign: 'center', color: '#666', border: '1px solid #ddd', backgroundColor: '#fff' }}>
          요금 정보 내역이 없습니다.
        </div>
      )}
      
    </div>
  );
};

export default DataUpload;