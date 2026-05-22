import React, { useState } from 'react';
import axios from 'axios';

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

    setLoading(true);
    
    // 1. 현재 로그인된 유저 ID (localStorage 등에 저장되어 있다고 가정)
    const userId = localStorage.getItem('userId') || 1; 

    // 2. FormData 생성
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId);

    try {
      // 3. 백엔드 스프링 부트로 요청 (FastAPI가 아님!)
      const response = await axios.post('/api/power/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("분석 결과:", response.data);
      setAnalysisData(response.data);
      alert("데이터 분석 및 DB 저장이 완료되었습니다!");
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("서버 연결에 실패했습니다. 백엔드 로그를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>■ 전력 데이터 업로드 및 분석</h3>
      <div style={{ border: '1px solid #ddd', padding: '30px', backgroundColor: '#f9f9f9' }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#ccc' : '#1a5c96', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'AI 분석 중...' : '데이터 업로드 및 예측'}
        </button>
      </div>

      {/* 결과가 있을 경우 간단히 표시 */}
      {analysisData && (
        <div style={{ marginTop: '20px', color: '#1a5c96' }}>
          <strong>성공적으로 4개월치 데이터가 분석되어 DB에 저장되었습니다!</strong>
        </div>
      )}
    </div>
  );
};

export default DataUpload;