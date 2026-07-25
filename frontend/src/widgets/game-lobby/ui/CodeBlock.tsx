import { FiGlobe, FiCopy } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface Props {
  code: string | undefined;
}

const JOIN_URL = "http://localhost:5173/join";

export function CodeBlock({ code }: Props) {
  const [copied, setCopied] = useState(false);
  const digits = (code ?? "----").split("");

  const copyLink = () => {
    navigator.clipboard.writeText(`${JOIN_URL}?code=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-left">
        <div className="code-eyebrow">
          <div className="code-eyebrow-dot" />
          Код для входа в комнату
        </div>

        <div className="code-digits">
          {digits.map((d, i) => (
            <div className="code-digit" key={i}>
              {d}
            </div>
          ))}
        </div>

        <div className="code-url-row">
          <span className="code-url-icon">
            <FiGlobe size={14} />
          </span>
          <span className="code-url-text">infinitequiz.ru/join</span>
          <button className="copy-btn" onClick={copyLink}>
            <FiCopy size={12} />
            {copied ? "Скопировано!" : "Скопировать ссылку"}
          </button>
        </div>

        <div className="code-steps">
          <div className="code-step">
            <div className="step-num">1</div>
            Откройте сайт
          </div>
          <div className="code-step">
            <div className="step-num">2</div>
            Введите код
          </div>
          <div className="code-step">
            <div className="step-num">3</div>
            Нажмите «Войти»
          </div>
        </div>
      </div>

      <div className="code-right">
        <div className="qr-wrap">
          <QRCodeSVG
            value={`${JOIN_URL}?code=${code}`}
            size={130}
            bgColor="transparent"
            fgColor="#0A1929"
          />
        </div>
        <span className="qr-label">Сканировать QR-код</span>
        <span className="qr-sub">Камерой телефона</span>
      </div>
    </div>
  );
}
