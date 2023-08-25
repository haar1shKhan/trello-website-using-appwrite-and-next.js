interface Board {
    columns: Map<TypedColumn,Column>
} 

type TypedColumn = "todo" | "inProgress" | "done"

interface columns {
    id:TypedColum,
    todos: Todo[]
}

interface Todo {
    $id:string,
    $createdAt:string,
    title:string
    status:string
    image?:Image
}

interface Image{

    bucketId:string,
    fileId:string

}