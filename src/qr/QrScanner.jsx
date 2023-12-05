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

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  const handleError = (err) => {
    console.error(err);
  };

  const handleQrCodeDetected = (qrCodeData) => {
    const isValid = isValidJSON(qrCodeData.text);

    if (!isValid) {
      return Swal.fire({
        title: 'ENTRADA INVÁLIDA',
        icon: 'error',
        timer: 2000,
      });
    }

    const ticketData = JSON.parse(qrCodeData.text);

    if (!ticketData.clientId || !ticketData.ticketId || !ticketData.dni || !ticketData.client) {
      return Swal.fire({
        title: 'ENTRADA INVÁLIDA',
        icon: 'error',
        timer: 2000,
      });
    }
    const existTicket = tickets.find((elem) => elem.id === ticketData.ticketId && elem.clientId === ticketData.clientId);

    if (!existTicket) {
      tickets.push({
        id: ticketData.ticketId,
        used: true,
        active: false,
        clientId: ticketData.clientId,
        name: ticketData.client,
        dni: ticketData.dni
      });
      return Swal.fire({
        title: 'PASA',
        text: `Nombre: ${ticketData.client} DNI: ${ticketData.dni}`,
        icon: 'success',
        timer: 2000,
      });
    }
    if (existTicket && existTicket.used && !existTicket.active) {
      return Swal.fire({
        title: 'USADO',
        text: `Usado \nNombre: ${existTicket.name} DNI: ${existTicket.dni}`,
        icon: 'error',
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setScanned(false);
    }, 2000);
    setScannerKey((prevKey) => prevKey + 1);

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
        facingMode='rear'
        style={{ width: '100%', maxWidth: '400px' }}
      />
    </div>
  );
}
