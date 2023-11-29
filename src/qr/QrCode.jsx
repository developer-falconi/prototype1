import QRCode from "react-qr-code";

export default function QrCode({ ticket }) {
  return (
    <div id="qrcode">
      <QRCode
        size={256}
        style={{ height: "auto", width: "4rem" }}
        value={ticket}
      />
    </div>
  );
};
