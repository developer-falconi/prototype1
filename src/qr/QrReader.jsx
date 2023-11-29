import { useEffect, useRef, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { tickets } from '../helpers/constants';
import Swal from 'sweetalert2';

export default function QrCodeScanner() {
  const videoRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);

  const handleScan = (data) => {
    if (data && !scanned) {
      setScanned(true);
      handleQrCodeDetected(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleQrCodeDetected = (qrCodeData) => {
    const existTicket = tickets.find((elem) => elem.id === qrCodeData.text);

    console.log(existTicket, qrCodeData);

    if (!existTicket) {
      const name = qrCodeData.text.split('-')[0];
      Swal.fire({
        title: 'PASAS',
        icon: 'success',
        timer: 500,
      });
      tickets.push({
        id: qrCodeData.text,
        used: true,
        active: false,
        name: name,
      });
    }
    if (existTicket && existTicket.used && !existTicket.active) {
      Swal.fire({
        title: 'USADO',
        text: `Usado por: ${existTicket.name}`,
        icon: 'error',
        timer: 500,
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setScanned(false);
      setScannerKey((prevKey) => prevKey + 1); // Change the key to force remount
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [scanned]);

  return (
    <div>
      <QrScanner
        key={scannerKey}
        delay={300}
        onError={handleError}
        onScan={handleScan}
        videoref={videoRef}
        style={{ width: '100%', maxWidth: '400px' }}
      />
    </div>
  );
}
