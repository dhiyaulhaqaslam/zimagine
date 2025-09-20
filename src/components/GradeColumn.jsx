import { Droppable } from "@hello-pangea/dnd";

export default function GradeColumn({ grade, items, children }) {
   return (
      <div className="flex-1 bg-gray-100 rounded-lg p-4 min-h-[150px]">
         <h2 className="text-center font-bold text-xl mb-2">{grade}</h2>
         <Droppable droppableId={grade}>
            {(provided) => (
               <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-[100px]"
               >
                  {children}
                  {provided.placeholder}
               </div>
            )}
         </Droppable>
      </div>
   );
}
