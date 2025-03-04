import { useRef, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { VALIDATE_QR } from "../service/ticket.requests";
import "./qrSection.scss";
import QrScanner from "qr-scanner";

export default function QrSection() {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const lastValidationTime = useRef(0);
  const [validationResponse, setValidationResponse] = useState(null);

  // Success callback: fires validation only if 2 seconds have passed since the last one.
  const onScanSuccess = async (result) => {
    if (result && result.data) {
      const now = Date.now();
      if (now - lastValidationTime.current < 2000) return; // Prevent rapid validations
      lastValidationTime.current = now;
      const validation = await VALIDATE_QR(result.data);
      setValidationResponse(validation);
    }
  };

  // Fail callback.
  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      // eslint-disable-next-line
      if (!videoEl?.current) {
        scanner.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "La cámara está bloqueada o no es accesible. Por favor, permite el acceso a la cámara en tu navegador y recarga la página."
      );
  }, [qrOn]);

  useEffect(() => {
    if (validationResponse && !validationResponse.success) {
      const audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/50547596/preview.mp3");
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  }, [validationResponse]);

  useEffect(() => {
    if (validationResponse) {
      const timer = setTimeout(() => {
        setValidationResponse(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [validationResponse]);

  return (
    <div className="qr-reader">
      <video ref={videoEl} className="video-box"></video>

      {/* Show a very noticeable alert when a validation response is available */}
      {validationResponse && (
        <Alert variant={validationResponse.success ? "success" : "danger"} className="alert-message big-alert">
          {validationResponse.message}
        </Alert>
      )}
    </div>
  );
}
