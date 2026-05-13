import React, { useState } from 'react';

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadMessage('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('먼저 파일을 선택해주세요.');
      return;
    }
    setUploadMessage('전력 사용량 파일 업로드가 완료되었습니다.');
  };

  return (
    <div className="empty-page">
      <h2>전력 데이터 업로드</h2>
      <p>회원 정보 관리 및 맞춤형 에너지 리포트를 확인하세요.</p>

      <div className="page-placeholder" style={{flexDirection: 'column'}}>
        <h3>📊 전력 사용량 데이터 업로드</h3>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          한전 또는 MyData에서 받은 엑셀 파일을 업로드하세요.
        </p>

        <label
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#B4C6B6',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}
        >
          파일 선택
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        {selectedFile && (
          <p style={{ marginBottom: '20px' }}>
            선택된 파일: {selectedFile.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          style={{
            padding: '12px 30px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#333',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          업로드하기
        </button>

        {uploadMessage && (
          <p style={{ marginTop: '20px', color: '#4CAF50', fontWeight: 'bold' }}>
            {uploadMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataUpload;