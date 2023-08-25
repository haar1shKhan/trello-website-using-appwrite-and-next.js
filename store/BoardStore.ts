import { ID, database, storage } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import uploadImage from '@/lib/uploadImage'
import { data } from 'autoprefixer'
import { create } from 'zustand'

interface BoardState {
    board:Board,
    getBoard: ()=> void,
    setBoard: (board:Board)=> void,
    upTodoInDB: (todo:Todo,columnsId:TypedColumn)=>void

    searchString:string
    taskInput:string
    taskType:TypedColumn
    image:File|null
    addTask:(todo:string,columnsId:TypedColumn,image?:File|null) =>void

    setSearchString:(searchString:string)=>void
    setTaskInput:(taskInput:string)=>void
    setTaskType:(columnsID:TypedColumn)=>void
    setImage:(image:File|null)=>void

    deleteTask:(taskInd:number,columnsId:TypedColumn,todoId:Todo)=>void
}

export const useBoardStore = create<BoardState>((set,get) => ({
  board: {
    columns: new Map<TypedColumn,columns>()
  },

  getBoard: async() => {
    const board = await getTodosGroupedByColumn()
    set({board})
  },

  setBoard:(board)=>set({board}),

  upTodoInDB: async (todo,columnsID)=>(

    await database.updateDocument(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        {
            title:todo.title,
            status:columnsID
        }
  )),

  searchString:"",
  taskInput:"",
  taskType:"todo",
  image:null,


  setSearchString:(searchString)=>set({searchString}),
  setTaskInput:(taskInput)=>set({taskInput}),
  setTaskType:(columnsID)=>set({taskType:columnsID}),
  setImage:(image)=>set({image}),
  addTask:async(todo,columnsID,image)=>{

    let file:Image|undefined
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    const {$id}=await database.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,ID.unique(),
    {
      title:todo,
      status:columnsID,
      ...(file && {image:JSON.stringify(file)})
    })    
    

    set({taskInput:""})

    set((state)=>{
      const newColumn= new Map(state.board.columns)

      const newTodo:Todo={
        $id,
        $createdAt:new Date().toISOString(),
        title:todo,
        status:columnsID,
        ...(file && {image:file})
      }
      const column = newColumn.get(columnsID)

      if(!column){
        newColumn.set(columnsID,{
          id:column,
          todos:[newTodo],
        })
        
      } else{
        newColumn.get(columnsID)?.todos.push(newTodo)
      }

      return {
        board:{
          columns:newColumn
        }
      }
    })
  },

  deleteTask:async(taskInd:number,columnsId:TypedColumn,todoId:Todo)=>{

    const newColumn = new Map(get().board.columns)

    newColumn.get(columnsId)?.todos.splice(taskInd,1)

    set({board:{columns:newColumn}})

    if(todoId.image){
      await storage.deleteFile(todoId.image.bucketId,todoId.image.fileId)
    }

    await database.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,todoId.$id)


  }
}))