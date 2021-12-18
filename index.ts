import express, {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
var serviceAccount = require("./classify-ec255-firebase-adminsdk-z3os6-4ee51e7dd9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

app.get('/users/:id', async (req: Request, res: Response)=>{
  const usersRef = db.collection('users')
  const usersDoc = await usersRef.doc(req.params.id).get()
  return res.status(201).json({id: usersDoc.id, data: usersDoc.data()})
})

app.get('/users', async (req: Request, res: Response)=>{
  const usersRef = db.collection('users')
  const usersDoc = await usersRef.get()
  const users: any[] = []
  usersDoc.forEach((doc) => {
    users.push({
      id: doc.id,
      data: doc.data()
    })
  })
  return res.status(200).json(users)
})

app.post('/users', async (req: Request, res: Response)=>{
  const {name} = req.body
  await db.collection('users').doc().set({name})
  return res.status(201).json({name})
})

app.get('/topics' , async (req: Request, res: Response) => {
    const topicsRef = db.collection('topics')

    const topicsDoc = await topicsRef.get()
    const topics: any[] = []
    topicsDoc.forEach((doc)=>{
      topics.push({
        id: doc.id,
        data: doc.data()})
    })
    // const topics = topicsDoc.map(doc => doc.data())
    return res.status(200).json(topics)
})

app.get('/topics/:id', async (req: Request, res: Response)=>{
  
    const topicsDoc = await db.collection('topics').doc(req.params.id).get()
    const topic = {id: topicsDoc.id, data: topicsDoc.data()}
    return res.status(201).json(topic)
})

app.post('/topics', async (req: Request, res: Response) => {
    const {title, userId} = req.body
    const result = await db.collection('topics').doc().set({title, likes:0, dislikes: 0, userId: userId})
    return res.status(201).json({title, likes:0, dislikes: 0})
})

app.put('/topics/:id', async (req: Request, res: Response) => {
    const topicsRef = db.collection('topics')
    await topicsRef.doc(req.params.id).set(req.body, {merge:true})
    .then(()=>res.json({id:req.params.id}))
    .catch((error)=> res.status(500).send(error))
})

app.delete('/topics/:id', async (req: Request, res: Response) => {
  const topicsRef = db.collection('topics')
  await topicsRef.doc(req.params.id).delete()
  .then(()=>res.status(204).send("Topico excluído com sucesso!"))
  .catch((error) => res.status(500).send(error))
})

app.listen(3001, () => {
    console.log('App running...')
})