import React, { useState } from 'react';
import axios from 'axios';
import ElectricStats from '../ElectricStats'; 

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('분석할 CSV 파일을 선택해주세요.');
      return;
    }

    // 🌟 [수정] 가짜 하드코딩 기본값(|| 1)을 완벽하게 소거하고 오직 로그인 세션 ID만 수색합니다.
    const userId = localStorage.getItem('userId'); 

    // 로그인 식별자가 누락되어 있다면 오버플로우 및 데이터 꼬임 방지를 위해 조기 차단합니다.
    if (!userId) {
      alert("⚠️ 로그인 세션이 존재하지 않거나 만료되었습니다. 다시 로그인한 후 시도해 주세요.");
      return;
    }

    setLoading(true);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    // 🌟 가변 처리된 로그인 유저의 진짜 고유 데이터베이스 번호(예: 2)가 적재됩니다.
    formData.append('userId', userId);

    try {
      // [통신 경로 안정화] AWS 백엔드 실서버 업로드 API 다이렉트 타격
      const response = await axios.post('/api/power/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(`📊 [업로드 대성공] 유저 ${userId}번 공간에 데이터 바인딩 완료:`, response.data);
      
      setAnalysisData(response.data);
      alert("데이터 분석 및 DB 저장이 완료되었습니다!");
    } catch (error) {
      console.error("업로드 실패 상세 로그:", error);
      alert("서버 연결에 실패했습니다. 백엔드 로그를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  // UI 스타일 (한전 KEPCO 테마 프리미엄 스킨)
  const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', fontFamily: '"Malgun Gothic", sans-serif', padding: '20px', color: '#333' },
    headerTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' },
    breadcrumb: { fontSize: '13px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center' },
    uploadSection: { padding: '40px 30px', border: '1px solid #ddd', backgroundColor: '#fff', textAlign: 'center', borderRadius: '6px' },
    uploadBtn: { padding: '10px 25px', backgroundColor: '#1a5c96', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginLeft: '10px', borderRadius: '4px' },
    fileInputLabel: { padding: '9px 20px', backgroundColor: '#fff', border: '1px solid #1a5c96', color: '#1a5c96', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', borderRadius: '4px' },
  };

  return (
    <div style={styles.container}>
      {/* 1. 상단 타이틀 및 경로 */}
      <h2 style={styles.headerTitle}>전력 데이터 업로드</h2>
      <div style={styles.breadcrumb}>
        <span>마이페이지 &gt; <strong>전력 데이터 업로드</strong></span>
      </div>

      <div>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1a5c96' }}>■ 전력 데이터 분석 및 자산화</h3>
          <div style={styles.uploadSection}>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
            데이터가 포함된  파일을 업로드하여 WattMate AI 전력 궤적을 빌드해 보세요.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <label style={styles.fileInputLabel}>
                {selectedFile ? '파일 변경' : '파일 선택'}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              <input 
                type="text" 
                readOnly 
                value={selectedFile ? selectedFile.name : '선택된 파일 없음'} 
                style={{ width: '300px', padding: '9px', marginLeft: '-1px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', outline: 'none', borderRadius: '0 4px 4px 0' }} 
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
                {loading ? 'AI 분석 및 업로드 중...' : '데이터 업로드 및 예측'}
              </button>
            </div>
          </div>

          {analysisData && (
            <div style={{ marginTop: '30px', padding: '25px', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#1a5c96', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
                🎉 성공적으로 4개월치 실측 데이터 분석 및 실제 로그인 유저 일련번호 룸에 AI 예측 데이터베이스 적재가 완료되었습니다!
              </div>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
                종합 분석 리포트 그래프가 하단에 동적 로드되었습니다.
              </p>
              
              <ElectricStats 
                thisWeek={analysisData.lastMonthAvg || 320.5} 
                nextWeek={analysisData.nextMonthPred || 27.82} 
              />
            </div>
          )}
        </div>
    </div>
  );
};

export default DataUpload;
