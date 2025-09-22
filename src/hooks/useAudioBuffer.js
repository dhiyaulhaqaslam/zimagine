// src/hooks/useAudioBuffer.js
import { useEffect, useRef } from "react";

export default function useAudioBuffer(url) {
   const ctxRef = useRef(
      new (window.AudioContext || window.webkitAudioContext)()
   );
   const bufferRef = useRef(null);

   useEffect(() => {
      let isMounted = true;

      fetch(url)
         .then((res) => res.arrayBuffer())
         .then((data) => ctxRef.current.decodeAudioData(data))
         .then((buffer) => {
            if (isMounted) bufferRef.current = buffer;
         });

      return () => {
         isMounted = false;
      };
   }, [url]);

   const play = () => {
      if (!bufferRef.current) return; // belum loaded
      const source = ctxRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(ctxRef.current.destination);
      source.start(0);
   };

   return play;
}
