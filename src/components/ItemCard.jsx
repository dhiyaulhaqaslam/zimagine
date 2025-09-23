import { Draggable } from "@hello-pangea/dnd";
import { gradeColors } from "../App";

// sekarang menerima props onDelete (optional)
export default function ItemCard({ item, index, onDelete }) {
   return (
      <Draggable draggableId={item.id} index={index}>
         {(provided) => (
            <div
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               ref={provided.innerRef}
               className="p-2 rounded text-center font-medium shadow flex justify-between items-center"
               style={{
                  backgroundColor: item.color || "#FFFFFF",
                  color:
                     item.color &&
                     item.color !== "#FFFFFF" &&
                     item.color !== gradeColors.S // kuning terang
                        ? "#FFFFFF"
                        : "#000000",
                  ...provided.draggableProps.style,
               }}
            >
               <span className="flex-1">{item.name}</span>

               {/* tombol hapus hanya muncul kalau ada onDelete */}
               {onDelete && (
                  <button
                     onClick={() => onDelete(item.id)}
                     className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                     Hapus
                  </button>
               )}
            </div>
         )}
      </Draggable>
   );
}
