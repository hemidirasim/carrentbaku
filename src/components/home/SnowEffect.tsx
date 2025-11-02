const SnowEffect = () => {
  return (
    <>
      <style>{`
        #snow-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -20px;
          background: white;
          border-radius: 50%;
          opacity: 0.9;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
          animation: snowfall linear infinite;
        }

        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) translateX(calc(var(--drift, 0px) * 10)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div id="snow-container">
        {Array.from({ length: 50 }).map((_, i) => {
          const drift = (Math.random() - 0.5) * 100;
          const size = Math.random() * 8 + 4;
          const delay = Math.random() * 5;
          const duration = Math.random() * 10 + 5;
          
          return (
            <div
              key={i}
              className="snowflake"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                '--drift': `${drift}px`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </>
  );
};

export default SnowEffect;

