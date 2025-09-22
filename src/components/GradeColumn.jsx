import { Droppable } from "@hello-pangea/dnd";

export default function GradeColumn({ grade, items, children }) {
   const gradeColors = {
      S: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black", // mewah
      A: "bg-green-500 text-white",
      B: "bg-blue-500 text-white",
      C: "bg-purple-500 text-white",
      D: "bg-orange-500 text-white",
      E: "bg-red-600 text-white", // paling bawah
   };
   return (
      <div className="flex flex-col">
         <h3
            className={`text-center font-bold py-2 rounded-t ${
               gradeColors[grade] || "bg-gray-200"
            }`}
         >
            {grade.toUpperCase()}
         </h3>
         <Droppable droppableId={grade}>
            {(provided) => (
               <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[150px] p-2 bg-white rounded-b shadow"
               >
                  {children}
                  {provided.placeholder}
               </div>
            )}
         </Droppable>
      </div>
   );
}
