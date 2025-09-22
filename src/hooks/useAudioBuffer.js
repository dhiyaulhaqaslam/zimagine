// useAudioBuffer.js
import { useEffect, useRef } from "react";

export default function useAudioBuffer(url) {
   const ctxRef = useRef(null);
   const bufferRef = useRef(null);

   useEffect(() => {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      fetch(url)
         .then((res) => res.arrayBuffer())
         .then((data) => ctxRef.current.decodeAudioData(data))
         .then((buffer) => (bufferRef.current = buffer));
   }, [url]);

   // panggil ini setelah user interaction pertama
   const resume = () => {
      if (ctxRef.current.state === "suspended") {
         ctxRef.current.resume();
      }
   };

   const play = () => {
      if (!bufferRef.current) return;
      resume();
      const source = ctxRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(ctxRef.current.destination);
      source.start(0);
   };

   return play;
}
