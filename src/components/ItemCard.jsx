import { Draggable } from "@hello-pangea/dnd";

export default function ItemCard({ item, index }) {
   return (
      <Draggable draggableId={item.id} index={index}>
         {(provided) => (
            <div
               ref={provided.innerRef}
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               className="bg-white p-2 rounded shadow cursor-move text-center"
            >
               {item.name}
            </div>
         )}
      </Draggable>
   );
}
