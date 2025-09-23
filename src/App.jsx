import { useState, useEffect, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import GradeColumn from "./components/GradeColumn";
import ItemCard from "./components/ItemCard";
import { classicData } from "./data";
import logo from "./assets/logo.png";
import Metallica from "./assets/Metallica.mp3";
import TheBeatles from "./assets/TheBeatles.mp3";
import Disturbed from "./assets/Disturbed.mp3";
import { motion, AnimatePresence } from "framer-motion";

export const gradeColors = {
   S: "#FFD700",
   A: "#28A745",
   B: "#007BFF",
   C: "#8A2BE2",
   D: "#FFA500",
   E: "#DC3545",
   pool: "#E5E7EB",
};

const grades = ["S", "A", "B", "C", "D", "E"];

export default function App() {
   const [mode, setMode] = useState("classic");
   const [showLanding, setShowLanding] = useState(true);
   const [showModeSelect, setShowModeSelect] = useState(false);

   const [classicCategory, setClassicCategory] = useState("band");
   const [musicSubcategory, setMusicSubcategory] = useState("rock");

   // daftar lagu
   const songs = [Metallica, TheBeatles, Disturbed];
   const [currentSongIndex, setCurrentSongIndex] = useState(0);

   // Audio
   const audioRef = useRef(null);
   const [volume, setVolume] = useState(0.3);
   const [muted, setMuted] = useState(false);
   const [showSettings, setShowSettings] = useState(false);

   const playWithFadeIn = () => {
      if (audioRef.current) {
         audioRef.current.muted = muted;
         audioRef.current.volume = 0.1;
         audioRef.current.play();

         let currentVolume = 0.00005;
         const targetVolume = volume;
         const step = 0.005;
         const intervalTime = 200;

         const fadeInterval = setInterval(() => {
            currentVolume += step;
            if (currentVolume >= targetVolume) {
               currentVolume = targetVolume;
               clearInterval(fadeInterval);
            }
            audioRef.current.volume = currentVolume;
         }, intervalTime);
      }
   };

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume;
         audioRef.current.muted = muted;
      }
   }, [volume, muted]);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = songs[currentSongIndex];
         audioRef.current.play();
      }
   }, [currentSongIndex]);

   const handleNextSong = () => {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
   };

   const handlePrevSong = () => {
      setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
   };

   const [classicColumns, setClassicColumns] = useState({
      pool: classicData.band,
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
   });

   const [customColumns, setCustomColumns] = useState(() => {
      const saved = localStorage.getItem("customColumns");
      return saved
         ? JSON.parse(saved)
         : {
              pool: [],
              S: [],
              A: [],
              B: [],
              C: [],
              D: [],
              E: [],
           };
   });

   // panel delete
   const [showDeletePanel, setShowDeletePanel] = useState(false);
   const [selectedToDelete, setSelectedToDelete] = useState([]);

   const allCustomItems = [
      ...customColumns.pool,
      ...grades.flatMap((g) => customColumns[g]),
   ];

   const toggleSelectToDelete = (id) => {
      setSelectedToDelete((prev) =>
         prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
   };

   const handleDeleteSelected = () => {
      const newCols = {};
      for (const grade of ["pool", ...grades]) {
         newCols[grade] = customColumns[grade].filter(
            (item) => !selectedToDelete.includes(item.id)
         );
      }
      setCustomColumns(newCols);
      localStorage.setItem("customColumns", JSON.stringify(newCols));
      setSelectedToDelete([]);
      setShowDeletePanel(false);
   };

   const handleDeleteAll = () => {
      const emptyCols = {
         pool: [],
         S: [],
         A: [],
         B: [],
         C: [],
         D: [],
         E: [],
      };
      setCustomColumns(emptyCols);
      localStorage.setItem("customColumns", JSON.stringify(emptyCols));
      setSelectedToDelete([]);
      setShowDeletePanel(false);
   };

   useEffect(() => {
      localStorage.setItem("customColumns", JSON.stringify(customColumns));
   }, [customColumns]);

   const [customInput, setCustomInput] = useState("");
   const [errorMsg, setErrorMsg] = useState("");

   useEffect(() => {
      if (mode === "classic") {
         if (classicCategory === "band") {
            setClassicColumns({
               pool: classicData.band,
               S: [],
               A: [],
               B: [],
               C: [],
               D: [],
               E: [],
            });
         } else if (classicCategory === "music") {
            setClassicColumns({
               pool: classicData.music[musicSubcategory] || [],
               S: [],
               A: [],
               B: [],
               C: [],
               D: [],
               E: [],
            });
         }
      }
   }, [mode, classicCategory, musicSubcategory]);

   const handleDragEnd = (result) => {
      const { source, destination } = result;
      if (!destination) return;
      if (
         source.droppableId === destination.droppableId &&
         source.index === destination.index
      ) {
         return;
      }

      const setCols = mode === "classic" ? setClassicColumns : setCustomColumns;

      setCols((prev) => {
         const startCol = source.droppableId;
         const endCol = destination.droppableId;

         const startItems = Array.from(prev[startCol]);
         const [removed] = startItems.splice(source.index, 1);

         removed.color = gradeColors[endCol] || "#FFFFFF";

         const endItems =
            startCol === endCol ? startItems : Array.from(prev[endCol]);

         if (startCol !== endCol) {
            endItems.splice(destination.index, 0, removed);
         } else {
            startItems.splice(destination.index, 0, removed);
         }

         return {
            ...prev,
            [startCol]: startItems,
            [endCol]: endItems,
         };
      });
   };

   const handleAddCustom = () => {
      const newName = customInput.trim();
      if (newName === "") return;

      const exists = customColumns.pool.some(
         (item) => item.name.toLowerCase() === newName.toLowerCase()
      );
      if (exists) {
         setErrorMsg(`Item "${newName}" sudah ada!`);
         return;
      }

      const newItem = {
         id: Date.now().toString(),
         name: newName,
      };

      setCustomColumns({
         ...customColumns,
         pool: [...customColumns.pool, newItem],
      });
      setCustomInput("");
      setErrorMsg("");
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         handleAddCustom();
      }
   };

   const handleChooseMode = (chosenMode) => {
      setMode(chosenMode);
      setShowModeSelect(false);
   };

   const handleSaveCustom = () => {
      localStorage.setItem("customColumns", JSON.stringify(customColumns));
      alert("Data custom tersimpan!");
   };

   const columns = mode === "classic" ? classicColumns : customColumns;

   return (
      <div className="min-h-screen">
         {showDeletePanel && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
               <div className="bg-white p-4 rounded shadow w-80 max-h-[80vh] overflow-auto">
                  <h2 className="text-lg font-bold mb-2">
                     Pilih item yang ingin dihapus
                  </h2>
                  <div className="space-y-1 mb-3">
                     {allCustomItems.length === 0 && (
                        <div className="text-gray-500">Tidak ada item</div>
                     )}
                     {allCustomItems.map((item) => (
                        <label
                           key={item.id}
                           className="flex items-center gap-2"
                        >
                           <input
                              type="checkbox"
                              checked={selectedToDelete.includes(item.id)}
                              onChange={() => toggleSelectToDelete(item.id)}
                           />
                           <span>{item.name}</span>
                        </label>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <button
                        onClick={handleDeleteSelected}
                        className="flex-1 bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                        disabled={selectedToDelete.length === 0}
                     >
                        Hapus yang dipilih
                     </button>
                     <button
                        onClick={handleDeleteAll}
                        className="flex-1 bg-gray-500 text-white px-2 py-1 rounded"
                     >
                        Hapus semua
                     </button>
                  </div>
                  <button
                     onClick={() => setShowDeletePanel(false)}
                     className="mt-3 w-full bg-blue-500 text-white px-2 py-1 rounded"
                  >
                     Batal
                  </button>
               </div>
            </div>
         )}

         <audio ref={audioRef} src={songs[currentSongIndex]} preload="auto" />

         {/* Landing */}
         <AnimatePresence>
            {showLanding && (
               <motion.div
                  key="landing"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -200 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white"
               >
                  <motion.img
                     src={logo}
                     alt="Logo"
                     className="w-20 h-20 mb-6"
                     initial={{ scale: 0.8, rotate: 0 }}
                     animate={{ scale: 1, rotate: 360 }}
                     transition={{ duration: 1 }}
                  />
                  <h1 className="text-4xl font-bold mb-4">Zimagine</h1>
                  <p className="mb-8 text-lg">
                     Drag & Drop Tierlist Musik Favoritmu
                  </p>
                  <motion.button
                     whileTap={{ scale: 0.9 }}
                     whileHover={{ scale: 1.05 }}
                     onClick={() => {
                        playWithFadeIn();
                        setShowLanding(false);
                        setShowModeSelect(true);
                     }}
                     className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                     Start
                  </motion.button>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Pilihan Mode */}
         <AnimatePresence>
            {showModeSelect && (
               <motion.div
                  key="modeselect"
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-500 text-white relative"
               >
                  <button
                     onClick={() => {
                        setShowModeSelect(false);
                        setShowLanding(true);
                     }}
                     className="absolute top-4 left-4 px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
                  >
                     ← Back
                  </button>
                  <h2 className="text-3xl font-bold mb-6">Pilih Mode</h2>
                  <div className="flex gap-6">
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChooseMode("classic")}
                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition"
                     >
                        Classic
                     </motion.button>
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChooseMode("custom")}
                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition"
                     >
                        Custom
                     </motion.button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Main App */}
         {!showLanding && !showModeSelect && (
            <motion.div
               key="mainapp"
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7 }}
               className="p-4 max-w-6xl mx-auto rounded-xl shadow-xl bg-[url('https://twemoji.maxcdn.com/v/latest/svg/1f3b5.svg')] bg-no-repeat bg-right-bottom bg-[length:80px_80px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
            >
               {/* Header */}
               <div className="flex justify-between items-center mb-4">
                  <button
                     onClick={() => setShowModeSelect(true)}
                     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                     ← Back
                  </button>

                  <div className="flex items-center">
                     <img className="w-10 h-10" src={logo} alt="Logo" />
                     <h1 className="text-3xl font-bold text-center">imagine</h1>
                  </div>

                  <button
                     onClick={() => setShowSettings(true)}
                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                     ⚙️ Settings
                  </button>
               </div>

               {/* Settings modal */}
               {showSettings && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                     <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-xl font-bold mb-4">
                           Pengaturan Musik
                        </h3>
                        <label className="block mb-2">
                           Volume: {Math.round(volume * 100)}%
                        </label>
                        <input
                           type="range"
                           min="0"
                           max="1"
                           step="0.01"
                           value={volume}
                           onChange={(e) => setVolume(Number(e.target.value))}
                           className="w-full mb-4"
                        />
                        <div className="flex items-center mb-4">
                           <input
                              type="checkbox"
                              checked={muted}
                              onChange={(e) => setMuted(e.target.checked)}
                              className="mr-2"
                           />
                           <span>Mute Musik</span>
                        </div>

                        <div className="flex justify-between mb-4">
                           <button
                              onClick={handlePrevSong}
                              className="px-3 py-2 bg-blue-500 text-white rounded"
                           >
                              ⬅️ Prev
                           </button>
                           <button
                              onClick={handleNextSong}
                              className="px-3 py-2 bg-blue-500 text-white rounded"
                           >
                              Next ➡️
                           </button>
                        </div>

                        <p className="text-sm mb-4">
                           Now Playing:{" "}
                           {songs[currentSongIndex].split("/").pop()}
                        </p>

                        <button
                           onClick={() => setShowSettings(false)}
                           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                        >
                           Tutup
                        </button>
                     </div>
                  </div>
               )}

               {/* Input custom */}
               {mode === "custom" && (
                  <div className="mb-4">
                     <h2 className="font-bold mb-2">Masukkan Musik/Band:</h2>
                     <div className="flex gap-2 mb-2">
                        <input
                           type="text"
                           value={customInput}
                           onChange={(e) => setCustomInput(e.target.value)}
                           onKeyDown={handleKeyDown}
                           className="border rounded p-2 w-full"
                           placeholder="Tambahkan nama band/musik..."
                        />
                        <button
                           onClick={handleAddCustom}
                           className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                           Tambah
                        </button>
                        <button
                           onClick={handleSaveCustom}
                           className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                           💾 Save
                        </button>
                        <button
                           onClick={() => setShowDeletePanel(true)}
                           className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                           🗑 Delete
                        </button>
                     </div>
                     {errorMsg && (
                        <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>
                     )}
                  </div>
               )}

               {/* Drag Drop */}
               <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                     <GradeColumn grade="pool" items={columns.pool}>
                        {columns.pool.map((item, index) => (
                           <ItemCard
                              key={item.id}
                              item={item}
                              index={index}
                              onDelete={null}
                           />
                        ))}
                     </GradeColumn>

                     {grades.map((grade) => (
                        <GradeColumn
                           key={grade}
                           grade={grade}
                           items={columns[grade]}
                        >
                           {columns[grade].map((item, index) => (
                              <ItemCard
                                 key={item.id}
                                 item={item}
                                 index={index}
                                 onDelete={null}
                              />
                           ))}
                        </GradeColumn>
                     ))}
                  </div>
               </DragDropContext>
            </motion.div>
         )}
      </div>
   );
}
