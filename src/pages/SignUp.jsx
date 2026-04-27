import React from 'react';
import '../css/SignUp.css';
import SignUpIntro from '../components/signup/SignUpIntro';
import SignUpGuideCard from '../components/signup/SignUpGuideCard';

export default function SignUp({ onNavigate }) {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <SignUpIntro />
        <SignUpGuideCard onNavigate={onNavigate} />
      </div>
    </div>
  );
}