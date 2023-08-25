"use client"
import { useBoardStore } from '@/store/BoardStore';
import React ,{useEffect}from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from "@/components/Column"
import { log } from 'console';

const Board = () => {
   
    const [board,getBoard,setBoard,upTodoInDB] = useBoardStore((state)=>[state.board,state.getBoard,state.setBoard,state.upTodoInDB])

    const handleOnDragEnd =(result:DropResult)=>{
        const {source,destination,type} = result
        console.log(source)
        console.log(destination)
        console.log(type)

        if(!destination) return

        if(type==='coloumn'){

            const entries = Array.from(board.columns.entries())
            const [removed] =entries.splice(source.index,1)
            entries.splice(destination.index,0,removed)
            const rearranged = new Map(entries)
            
            setBoard({...board,columns:rearranged})
        }

        const columns = Array.from(board.columns)
        const startColsIndex = columns[Number(source.droppableId)]
        const finishColsIndex = columns[Number(destination.droppableId)]
        
        const StartCol:columns = {
            id:startColsIndex[0],
            todos:startColsIndex[1].todos
        }
        const finishCol:columns = {
            id:finishColsIndex[0],
            todos:finishColsIndex[1].todos
        }

        if(!StartCol || !finishCol) return

        if(source.index === destination.index && StartCol===finishCol) return

        const newTodos = StartCol.todos
        const [todoMoved] = newTodos.splice(source.index,1)

        if(StartCol.id===finishCol.id){

            newTodos.splice(destination.index,0,todoMoved)

            const newCol ={
                id:StartCol.id,
                todos:newTodos
            }

            const newcolumns = new Map(board.columns)
            newcolumns.set(StartCol.id,newCol)

            setBoard({...board,columns:newcolumns})

        }else{

            const finishTodos = Array.from(finishCol.todos)
            finishTodos.splice(destination.index,0,todoMoved)

            
            const newcolumns = new Map(board.columns)
            const newCol ={
                id:StartCol.id,
                todos:newTodos
            }

            newcolumns.set(StartCol.id,newCol)
            newcolumns.set(finishCol.id,{
                id:finishCol.id,
                todos:finishTodos,
            })

            upTodoInDB(todoMoved,finishCol.id)
            setBoard({...board,columns:newcolumns})

        }

    }

    useEffect(() => {
    
         getBoard() 
      
    }, [getBoard])
    
    console.log(board);
    

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='board' direction='horizontal' type='coloumn'>
            {(provided)=> (
            <div  className='grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto max-w-7xl ' {...provided.droppableProps} ref={provided.innerRef}>

                {Array.from(board.columns.entries()).map(([id,column],index)=>(

                    <Column  key={id} id={id} todos={column.todos} index={index} />
 
                ))}        
                {provided.placeholder}
            </div>
           ) }
            
        </Droppable>
    </DragDropContext>
  )
}

export default Board