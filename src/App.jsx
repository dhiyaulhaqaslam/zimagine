import { useState, useEffect, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import GradeColumn from "./components/GradeColumn";
import ItemCard from "./components/ItemCard";
import { classicData } from "./data";
import logo from "./assets/logo.png";
import useAudioBuffer from "./hooks/useAudioBuffer";
import DiscordJoin from "./assets/DiscordJoin.mp3";
import DiscordLeave from "./assets/DiscordLeave.mp3";
import { motion, AnimatePresence } from "framer-motion";

const grades = ["S", "A", "B", "C", "D", "E"];

export default function App() {
   const [mode, setMode] = useState("classic");
   const [showLanding, setShowLanding] = useState(true);
   const [showModeSelect, setShowModeSelect] = useState(false);

   const [classicCategory, setClassicCategory] = useState("band");
   const [musicSubcategory, setMusicSubcategory] = useState("rock");

   const playJoin = useAudioBuffer(DiscordJoin);
   const playLeave = useAudioBuffer(DiscordLeave);

   const [classicColumns, setClassicColumns] = useState({
      pool: classicData.band,
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
   });

   const [customColumns, setCustomColumns] = useState({
      pool: [],
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
   });

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

      if (mode === "classic") {
         setClassicColumns((prev) => {
            const startCol = source.droppableId;
            const endCol = destination.droppableId;

            const startItems = Array.from(prev[startCol]);
            const [removed] = startItems.splice(source.index, 1);

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
      } else {
         setCustomColumns((prev) => {
            const startCol = source.droppableId;
            const endCol = destination.droppableId;

            const startItems = Array.from(prev[startCol]);
            const [removed] = startItems.splice(source.index, 1);

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
      }
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
      playJoin();
      setMode(chosenMode);
      setShowModeSelect(false); // ke game
   };

   const columns = mode === "classic" ? classicColumns : customColumns;

   return (
      <div className="min-h-screen">
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
                        playJoin();
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
                        playLeave();
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
               {/* Tombol Back */}
               <div className="flex justify-between items-center mb-4">
                  <button
                     onClick={() => {
                        playLeave();
                        setShowModeSelect(true);
                     }}
                     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                     ← Back
                  </button>
                  <div className="flex items-center">
                     <img className="w-10 h-10" src={logo} alt="Logo" />
                     <h1 className="text-3xl font-bold text-center ml-2">
                        imagine
                     </h1>
                  </div>
               </div>

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
                     </div>
                     {errorMsg && (
                        <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>
                     )}
                  </div>
               )}

               <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                     <GradeColumn grade="pool" items={columns.pool}>
                        {columns.pool.map((item, index) => (
                           <ItemCard key={item.id} item={item} index={index} />
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
