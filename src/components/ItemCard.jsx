import { Draggable } from "@hello-pangea/dnd";
import { gradeColors } from "../App";

export default function ItemCard({ item, index, onDelete }) {
   return (
      <Draggable draggableId={item.id} index={index}>
         {(provided) => (
            <div
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               ref={provided.innerRef}
               className="p-2 rounded text-center font-medium shadow relative"
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
               {item.name}
               {onDelete && (
                  <button
                     onClick={() => onDelete(item.id)}
                     className="absolute top-1 right-1 text-xs px-1 rounded bg-red-500 text-white hover:bg-red-600"
                     title="Hapus item ini"
                  >
                     ✕
                  </button>
               )}
            </div>
         )}
      </Draggable>
   );
}
