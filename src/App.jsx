import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import ItemCard from "./components/ItemCard";
import GradeColumn from "./components/GradeColumn";
import { classicBands } from "./data";

const grades = ["S", "A", "B", "C", "D", "E"];

export default function App() {
  const [mode, setMode] = useState("classic");
  const [columns, setColumns] = useState({
    pool: classicBands,
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
  });

  const [customInput, setCustomInput] = useState("");
  const [customList, setCustomList] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const startCol = source.droppableId;
    const endCol = destination.droppableId;

    const startItems = Array.from(columns[startCol]);
    const [removed] = startItems.splice(source.index, 1);
    const endItems = Array.from(columns[endCol]);
    endItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [startCol]: startItems,
      [endCol]: endItems,
    });
  };

  const handleAddCustom = () => {
    if (customInput.trim() !== "") {
      const newItem = {
        id: Date.now().toString(),
        name: customInput.trim(),
      };
      setCustomList([...customList, newItem]);
      setCustomInput("");
    }
  };

  const startCustom = () => {
    setColumns({
      pool: customList,
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Zimagine</h1>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setMode("classic");
            setColumns({
              pool: classicBands,
              S: [],
              A: [],
              B: [],
              C: [],
              D: [],
              E: [],
            });
          }}
          className={`px-4 py-2 rounded ${
            mode === "classic" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setMode("custom")}
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
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Nama band/musik"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              onClick={handleAddCustom}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Tambah
            </button>
          </div>
          <button
            onClick={startCustom}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Mulai Custom Mode
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <GradeColumn grade="Pool" items={columns.pool}>
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
