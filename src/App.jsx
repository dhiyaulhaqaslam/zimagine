import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import GradeColumn from "./components/GradeColumn";
import ItemCard from "./components/ItemCard";
import { classicBands } from "./data";

const grades = ["S", "A", "B", "C", "D", "E"];

export default function App() {
   const [mode, setMode] = useState("classic");

   // state terpisah
   const [classicColumns, setClassicColumns] = useState({
      pool: classicBands,
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

   const handleDragEnd = (result) => {
      const { source, destination } = result;

      // kalau tidak ada tujuan drop
      if (!destination) return;

      // kalau posisi sumber dan tujuan sama persis, tidak usah ubah state
      if (
         source.droppableId === destination.droppableId &&
         source.index === destination.index
      ) {
         return;
      }

      const current = mode === "classic" ? classicColumns : customColumns;
      const setCurrent =
         mode === "classic" ? setClassicColumns : setCustomColumns;

      // jika drag di kolom yang sama
      if (source.droppableId === destination.droppableId) {
         const columnItems = Array.from(current[source.droppableId]);
         const [moved] = columnItems.splice(source.index, 1);
         columnItems.splice(destination.index, 0, moved);

         setCurrent({
            ...current,
            [source.droppableId]: columnItems,
         });
      } else {
         // drag ke kolom berbeda
         const startItems = Array.from(current[source.droppableId]);
         const [moved] = startItems.splice(source.index, 1);

         const endItems = Array.from(current[destination.droppableId]);
         endItems.splice(destination.index, 0, moved);

         setCurrent({
            ...current,
            [source.droppableId]: startItems,
            [destination.droppableId]: endItems,
         });
      }
   };

   const handleAddCustom = () => {
      const newName = customInput.trim();
      if (newName === "") return;

      // cek duplikat (case insensitive)
      const exists = customColumns.pool.some(
         (item) => item.name.toLowerCase() === newName.toLowerCase()
      );
      if (exists) {
         setErrorMsg(`Item "${newName}" sudah ada!`);
         // atau pakai alert("Item sudah ada")
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

   // event handler Enter
   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         handleAddCustom();
      }
   };

   const handleSwitchMode = (newMode) => {
      setMode(newMode);
      if (newMode === "classic") {
         // reset classic
         setClassicColumns({
            pool: classicBands,
            S: [],
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
         });
      }
      if (newMode === "custom") {
         // tidak perlu reset custom, biarkan state customColumns seperti terakhir
      }
   };

   // pilih data sesuai mode
   const columns = mode === "classic" ? classicColumns : customColumns;

   return (
      <div className="p-4 max-w-6xl mx-auto">
         <h1 className="text-3xl font-bold text-center mb-4">Zimagine</h1>

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

         {mode === "custom" && (
            <div className="mb-4">
               <h2 className="font-bold mb-2">Masukkan Musik/Band:</h2>
               <div className="flex gap-2 mb-2">
                  <input
                     type="text"
                     value={customInput}
                     onChange={(e) => setCustomInput(e.target.value)}
                     onKeyDown={handleKeyDown} // shortcut Enter
                     className="border rounded p-2 w-full"
                     placeholder="Tambahkan nama band/musik..."
                  />
                  <button
                     onClick={handleAddCustom}
                     className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                     Tambah
                  </button>
                  {errorMsg && (
                     <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>
                  )}
               </div>
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
