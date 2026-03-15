import { useEffect, useRef } from "react";

export default function CursorBubble() {
  const dotRef = useRef(null);
  const bubbleRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const bubble = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const addListeners = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          hovered.current = true;
        });
        el.addEventListener("mouseleave", () => {
          hovered.current = false;
        });
      });
    };
    document.addEventListener("mousemove", onMove);
    addListeners();
    const interval = setInterval(addListeners, 2000);
    let raf;
    const animate = () => {
      bubble.current.x += (pos.current.x - bubble.current.x) * 0.1;
      bubble.current.y += (pos.current.y - bubble.current.y) * 0.1;
      if (bubbleRef.current) {
        bubbleRef.current.style.left = bubble.current.x + "px";
        bubbleRef.current.style.top = bubble.current.y + "px";
        if (hovered.current) {
          bubbleRef.current.style.width = "60px";
          bubbleRef.current.style.height = "60px";
          bubbleRef.current.style.opacity = "0.8";
          bubbleRef.current.style.background = "rgba(249,115,22,0.08)";
        } else {
          bubbleRef.current.style.width = "40px";
          bubbleRef.current.style.height = "40px";
          bubbleRef.current.style.opacity = "0.45";
          bubbleRef.current.style.background = "transparent";
        }
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={bubbleRef}
        className="fixed rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border border-orange-500 transition-[width,height,opacity,background] duration-300"
        style={{ width: 40, height: 40, opacity: 0.45 }}
      />
    </>
  );
}
