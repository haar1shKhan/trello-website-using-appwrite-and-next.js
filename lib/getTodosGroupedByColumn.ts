import { database } from "@/appwrite"

export const getTodosGroupedByColumn = async ()=>{
    const data = await database.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!)

    const todo = data.documents;

    const columns = todo.reduce((acc,todo)=>{
       if(!acc.get(todo.status)){
        acc.set(todo.status,{
            id:todo.status,
            todos:[]
        })}

        acc.get(todo.status)!.todos.push({
            $id:todo.$id,
            $createdAt:todo.$createdAt,
            title:todo.title,
            status:todo.status,
            ...(todo.image && {image:JSON.parse(todo.image)})
        })

        return acc

    },new Map<TypedColumn,columns>)

    // console.log(columns);

    const columnsTypes:TypedColumn[] = ['todo','inProgress','done']

    for(const columnsType of columnsTypes){

        if(!columns.get(columnsType)){
            columns.set(columnsType,{
                id:columnsType,
                todos:[]
            })
        }
    }
    const sortedColums = new Map(
        Array.from(columns.entries()).sort((a,b)=>columnsTypes.indexOf(a[0])-columnsTypes.indexOf(b[0]))
    )
    
    const board:Board={
        columns:sortedColums
    }
    return board
}
