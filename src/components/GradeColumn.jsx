import { Droppable } from "@hello-pangea/dnd";
import { gradeColors } from "../App"; // import mapping dari App.jsx

export default function GradeColumn({ grade, items, children }) {
   const bgColor = gradeColors[grade] || gradeColors.pool;
   const textColor = grade === "S" || grade === "pool" ? "black" : "white"; // teks biar kontras

   return (
      <div className="flex flex-col">
         <h3
            className="text-center font-bold py-2 rounded-t"
            style={{
               backgroundColor: bgColor,
               color: textColor,
            }}
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
