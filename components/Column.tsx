import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { useBoardStore } from '@/store/BoardStore'
import { useModelStore } from '@/store/ModalStore'

type Props ={
    id:TypedColumn,
    todos:Todo[],
    index: number
}

const idToColumnSet:{
    [key in TypedColumn]:String
}={
    todo:"To Do",
    inProgress:"In Progress",
    done:"Done"
}

const Column = ({id,todos,index}:Props) => {

  const [searchString,setTaskType] = useBoardStore((state)=>[state.searchString,state.setTaskType])
  const [OpenModel] = useModelStore((state)=>[state.openModel])

  const handleAddTodo =()=>{
    setTaskType(id)
    OpenModel()
  }


    
  return (
    <Draggable draggableId={id} index={index}>
        {(provided)=>(
            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                <Droppable droppableId={index.toString()}type="card">
                    {(provided,snapshot)=>(
                        <div className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver?"bg-green-200":"bg-white/50"}`} {...provided.droppableProps} ref={provided.innerRef}>
                            <h2 className='flex justify-between font-bold text-xl'>{idToColumnSet[id]} 
                                <span className='text-gray-500 font-normal bg-gray-200 rounded-full px-2 py-2'>
                                    {!searchString?todos.length:todos.filter((todo)=> todo.title.toLowerCase().includes(searchString.toLowerCase())).length}
                                </span>
                            </h2>
                            <div className='space-y-2 '>
                                {todos.map((todo,index)=>{

                                    if(searchString && !todo.title.toLowerCase().includes(searchString.toLowerCase())) return null
                                    
                                    return (<Draggable draggableId={todo.$id} key={todo.$id} index={index}>
                                        {(provided)=>(
                                            <TodoCard dragHandle ={provided.dragHandleProps}  draggableProps={provided.draggableProps}  id={id} index = {index} todo={todo} innerRef ={provided.innerRef} />
                                        )}
                                    </Draggable>)
                                })}

                                {provided.placeholder}

                                <div className='flex items-end justify-end p-2'>
                                    <button onClick={handleAddTodo} className='text-green-500 hover:text-green-600'><PlusCircleIcon className='w-10 h-10'/></button>
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        )}
    </Draggable>
  )
}

export default Column