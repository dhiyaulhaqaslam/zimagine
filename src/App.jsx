import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import GradeColumn from "./components/GradeColumn";
import ItemCard from "./components/ItemCard";
import { classicData } from "./data";

const grades = ["S", "A", "B", "C", "D", "E"];

export default function App() {
   const [mode, setMode] = useState("classic");

   // classic category/subcategory state
   const [classicCategory, setClassicCategory] = useState("band");
   const [musicSubcategory, setMusicSubcategory] = useState("rock");

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

   // update pool otomatis saat category/subcategory berubah
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
      if (!destination) return; // kalau tidak ada tujuan, keluar

      // kalau source dan destination sama persis, jangan ubah state
      if (
         source.droppableId === destination.droppableId &&
         source.index === destination.index
      ) {
         return;
      }

      // pilih state sesuai mode
      if (mode === "classic") {
         setClassicColumns((prev) => {
            const startCol = source.droppableId;
            const endCol = destination.droppableId;

            const startItems = Array.from(prev[startCol]);
            const [removed] = startItems.splice(source.index, 1);

            const endItems =
               startCol === endCol
                  ? startItems // kalau sama kolomnya, kita pakai startItems saja
                  : Array.from(prev[endCol]);

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

   const handleSwitchMode = (newMode) => {
      setMode(newMode);
      if (newMode === "classic") {
         // reset sesuai category
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
         } else {
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
   };

   const columns = mode === "classic" ? classicColumns : customColumns;

   return (
      <div className="p-4 max-w-6xl mx-auto">
         <div className="flex justify-center items-center py-4">
            <img className="w-10 h-10" src="src/assets/logo.png" alt="" />
            <h1 className="text-3xl font-bold text-center">imagine</h1>
         </div>

         <div className="flex justify-center gap-4 mb-4">
            <button
               onClick={() => handleSwitchMode("classic")}
               className={`px-4 py-2 rounded ${
                  mode === "classic" ? "bg-blue-500 text-white" : "bg-gray-200"
               }`}
            >
               Classic
            </button>
            <button
               onClick={() => handleSwitchMode("custom")}
               className={`px-4 py-2 rounded ${
                  mode === "custom" ? "bg-blue-500 text-white" : "bg-gray-200"
               }`}
            >
               Custom
            </button>
         </div>

         {mode === "classic" && (
            <div className="mb-4 flex flex-col md:flex-row gap-4">
               <div>
                  <label className="block mb-1 font-bold">Kategori:</label>
                  <select
                     value={classicCategory}
                     onChange={(e) => setClassicCategory(e.target.value)}
                     className="border rounded px-2 py-1"
                  >
                     <option value="band">Band</option>
                     <option value="music">Musik</option>
                  </select>
               </div>

               {classicCategory === "music" && (
                  <div>
                     <label className="block mb-1 font-bold">
                        Subkategori:
                     </label>
                     <select
                        value={musicSubcategory}
                        onChange={(e) => setMusicSubcategory(e.target.value)}
                        className="border rounded px-2 py-1"
                     >
                        {Object.keys(classicData.music).map((sub) => (
                           <option key={sub} value={sub}>
                              {sub}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
            </div>
         )}

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
                  <GradeColumn key={grade} grade={grade} items={columns[grade]}>
                     {columns[grade].map((item, index) => (
                        <ItemCard key={item.id} item={item} index={index} />
                     ))}
                  </GradeColumn>
               ))}
            </div>
         </DragDropContext>
      </div>
   );
}
