import openai from "@/openAI";
import { NextResponse } from "next/server";

export async function POST(request:Request){

    const {todos} = await request.json()

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature:0.8,
        n:1,
        stream:false,
        messages:
        [
            {"role": "system", "content": "When responing, always welcome the user as Haarish khan!,Limit the respone to 200 characters"},
            {"role": "user", "content": `Hey There, Provide the summary of the following todos,Count how todos are in each category such as to do,in progress,done,
              then tell the user to have a productive day,here is the data ${JSON.stringify(todos)}`}
        ],
    })

    const {choices} = response

    console.log(choices[0].message);
    
    return NextResponse.json(choices[0].message)

}