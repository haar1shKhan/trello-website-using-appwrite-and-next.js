"use Client"
import getUrl from '@/lib/getUrl'
import { useBoardStore } from '@/store/BoardStore'
import { XCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'

type Props ={
    todo:Todo,
    index:number,
    id:TypedColumn,
    draggableProps:DraggableProvidedDraggableProps,
    dragHandle: DraggableProvidedDragHandleProps |null|undefined,
    innerRef:(element:HTMLElement|null)=>void

}


const TodoCard = ({todo,index,id,dragHandle,innerRef,draggableProps}:Props) => {

  const deleteTask = useBoardStore((state)=>state.deleteTask)
  const [imageUrl, setimageUrl] = useState<string|null>(null)

  

  useEffect(() => {
    console.log(todo);
    
    if(todo.image){

      const fetchImage = async ()=>{
        const url =await getUrl(todo.image!);
        console.log(url);
        
        if(url){
          setimageUrl(url.toString())
        }
      }

      fetchImage()
    }
  
   
  }, [todo])
  

  return (
    <div className='bg-white rounded-md space-y-2 drop-shadow-md' {...dragHandle} {...draggableProps} ref={innerRef}>
       <div className='flex justify-between items-center p-5'>
            <p> {todo.title}</p>
            <button onClick={()=>{deleteTask(index,id,todo)}} className='text-red-500 hover:text-red-600'>{<XCircleIcon className='ml-5 h-8 w-8'/>}</button>
        </div>
        {imageUrl && 
        <div className='relative h-full w-full rounded-b-md'>

          <Image src={imageUrl} width={400} height={200} alt='tast img' className='w-full object-contain rounded-b-md'/>
          
        </div>}
    </div>
  )
}

export default TodoCard