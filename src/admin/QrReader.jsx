import { useState, useRef } from 'react';
import QrScanner from 'react-qr-scanner';

export default function QrCodeScanner() {
  const [result, setResult] = useState('No result');
  const videoRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          videoRef={videoRef}
          style={{ width: '100%', maxWidth: '400px' }}
        />
        <p>{result}</p>
      </div>
    </div>
  );
};