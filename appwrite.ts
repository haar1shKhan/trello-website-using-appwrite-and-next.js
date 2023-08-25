import { Client,ID,Account,Databases,Storage } from "appwrite";

const client = new Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECTID!);

const account = new Account(client)
const database = new Databases(client)
const storage = new Storage(client)

export {client,storage,account,database,ID}