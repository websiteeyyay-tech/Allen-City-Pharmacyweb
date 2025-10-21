import React, { useEffect, useRef } from "react";

// Make CreateJS available as global
declare const createjs: any;

const ContactPage: React.FC = () => {
  const bannerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const breakpoint = 768;

    const grid = gridRef.current!;
    const leftCol = leftColRef.current!;
    const rightCol = rightColRef.current!;
    const headerInner = headerInnerRef.current!;
    const main = mainRef.current!;
    const bannerCanvas = bannerCanvasRef.current!;

    const applyMobileStyles = () => {
      grid.style.flexDirection = "column";
      grid.style.alignItems = "stretch";
      leftCol.style.width = "100%";
      rightCol.style.width = "100%";
      headerInner.style.flexDirection = "column";
      headerInner.style.alignItems = "center";
      headerInner.style.justifyContent = "center";
      headerInner.style.gap = "12px";
      main.style.padding = "0 18px";
    };

    const applyDesktopStyles = () => {
      grid.style.flexDirection = "row";
      grid.style.alignItems = "flex-start";
      leftCol.style.width = "60%";
      rightCol.style.width = "40%";

      main.style.padding = "0 10px";
    };

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < breakpoint) {
        applyMobileStyles();
      } else {
        applyDesktopStyles();
      }

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = bannerCanvas.clientWidth || window.innerWidth;
      const cssHeight = 240;
      bannerCanvas.width = Math.max(300, Math.floor(cssWidth * dpr));
      bannerCanvas.height = Math.floor(cssHeight * dpr);
      bannerCanvas.style.width = `${cssWidth}px`;
      bannerCanvas.style.height = `${cssHeight}px`;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();

    // CreateJS banner animation
    try {
      const canvas = bannerCanvas;
      const stage = new createjs.Stage(canvas);
      (window as any).__createjsStage = stage;

      const dpr = window.devicePixelRatio || 1;
      stage.scaleX = dpr;
      stage.scaleY = dpr;
      const logicalWidth = canvas.width;
      const logicalHeight = canvas.height;

      const pills: any[] = [];
      const colors = ["#ffffff", "#ffcc80", "#c8e6c9", "#b2dfdb"];
      const random = (min: number, max: number) => min + Math.random() * (max - min);

      for (let i = 0; i < 30; i++) {
        const w = 40 * (0.9 + Math.random() * 0.4);
        const h = 15 * (0.9 + Math.random() * 0.4);
        const rx = 8;
        const pill = new createjs.Shape();
        pill.graphics.beginFill(colors[Math.floor(Math.random() * colors.length)])
          .drawRoundRect(0, 0, w * dpr, h * dpr, rx * dpr);
        pill.regX = (w * dpr) / 2;
        pill.regY = (h * dpr) / 2;
        pill.x = random(0, logicalWidth);
        pill.y = random(0, logicalHeight);
        pill.speed = 0.5 * dpr + Math.random() * (1.5 * dpr);
        pill.rotationSpeed = -0.05 + Math.random() * 0.1;
        pills.push(pill);
        stage.addChild(pill);
      }

      const fontSize = 32 * dpr;
      const bannerText = new createjs.Text(
        "Contact Allen City Pharmacy",
        `bold ${fontSize}px Segoe UI`,
        "#ffffff"
      );
      bannerText.textAlign = "center";
      bannerText.x = logicalWidth / 2;
      bannerText.y = logicalHeight / 3;
      bannerText.shadow = new createjs.Shadow("rgba(0,0,0,0.18)", 2 * dpr, 2 * dpr, 6 * dpr);
      stage.addChild(bannerText);

      createjs.Ticker.framerate = 60;
      createjs.Ticker.addEventListener("tick", () => {
        pills.forEach((p) => {
          p.y -= p.speed;
          p.rotation += p.rotationSpeed;
          if (p.y < -50 * dpr) {
            p.y = logicalHeight + 40 * dpr;
            p.x = Math.random() * logicalWidth;
          }
        });
        bannerText.alpha = 0.9 + Math.sin(createjs.Ticker.getTime() / 300) * 0.1;
        stage.update();
      });
    } catch (err) {
      console.warn("CreateJS initialization failed:", err);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <div style={{ margin: 0, background: "#F8FAFC", color: "#1F2937", fontFamily: "Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, Noto Sans, Liberation Sans, sans-serif" }}>
      

      {/* Banner */}
      <div id="bannerWrap" style={{ width: "100%", background: "linear-gradient(135deg,#22c55e_0%,#f97316_100%)", overflow: "hidden" }}>
        <canvas ref={bannerCanvasRef} id="pharmacyBanner" style={{ width: "100%", height: "240px", display: "block" }}></canvas>
      </div>

      {/* Main */}
      <main ref={mainRef} style={{ width: "100%", maxWidth: "1100px", margin: "32px auto", padding: "0 20px", boxSizing: "border-box" }}>
        <section style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05, color: "#065F46", fontWeight: 800 }}>Contact Us</h1>
          <p style={{ margin: "14px auto 0", maxWidth: 760, color: "#475569", fontSize: 16 }}>
            Have questions about your prescription, our services, or an online order? Our team is here to help — 24/7 support for your convenience.
          </p>
        </section>

        <section ref={gridRef} style={{ display: "flex", gap: 24, flexDirection: "column" }}>
          {/* Form */}
          <div ref={leftColRef} style={{ background: "#FFFFFF", padding: 24, borderRadius: 18, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <h2 style={{ marginBottom: 18, color: "#064E3B", fontSize: 22, fontWeight: 700 }}>Send us a message</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ fontSize: 14, color: "#374151" }}>
                <span style={{ marginBottom: 8, display: "block" }}>Full Name</span>
                <input type="text" required placeholder="Your Name" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D1D5DB" }} />
              </label>
              <label style={{ fontSize: 14, color: "#374151" }}>
                <span style={{ marginBottom: 8, display: "block" }}>Email Address</span>
                <input type="email" required placeholder="you@example.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D1D5DB" }} />
              </label>
              <label style={{ fontSize: 14, color: "#374151" }}>
                <span style={{ marginBottom: 8, display: "block" }}>Message</span>
                <textarea rows={5} placeholder="Your message..." style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D1D5DB" }} />
              </label>
              <button type="submit" style={{ background: "#065F46", color: "#FFFFFF", padding: "12px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Send Message</button>
            </form>
          </div>

          {/* Contact Info */}
          <aside ref={rightColRef} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            <div>
              <h2 style={{ color: "#064E3B", fontSize: 22, fontWeight: 700 }}>Get in Touch</h2>
              <p style={{ color: "#475569", fontSize: 15 }}>We’re just a message away for prescriptions or advice.</p>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img src="Phone.png" alt="Phone" style={{ height: 40, width: 40 }} />
              <div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>Call Us</div>
                <div style={{ fontWeight: 700, color: "#065F46" }}>+1 (972) 555-7890</div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ width: "100%", background: "#0F1724", color: "#D1D5DB", padding: "20px 16px", marginTop: 40, textAlign: "center" }}>
        <div>&copy; 2025 Allen City Pharmacy. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default ContactPage;