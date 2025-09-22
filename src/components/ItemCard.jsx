import { Draggable } from "@hello-pangea/dnd";

export default function ItemCard({ item, index }) {
   return (
      <Draggable draggableId={item.id} index={index}>
         {(provided) => (
            <div
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               ref={provided.innerRef}
               className="p-2 rounded text-center font-medium shadow"
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
            </div>
         )}
      </Draggable>
   );
}
