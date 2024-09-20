import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from 'zod';


export async function appRoutes(app: FastifyInstance) {

    /*--------------------------//------------------------------------*/

    app.get('/users', async () => {
        const users = await prisma.user.findMany()
        
        return users
    })

    /*--------------------------//------------------------------------*/

    app.post('/users', async (req) => {

        const bodySchema = z.object({ // colocar tipagem em: name, age
            name: z.string(),
            age: z.number(),
        })

        const { name, age } = bodySchema.parse(req.body) // .parse valida se "req.body" está no formato de 'bodySchema'

        const user = await prisma.user.create({
            data: {
                name,
                age,
            }
        })

        return user
    })

    /*--------------------------//------------------------------------*/

    app.delete('/users/:userId', async (req, reply) => {
        const paramsSchema = z.object({
            userId: z.string(),
        })

        const { userId } = paramsSchema.parse(req.params)

        const userIdToRemove = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!userIdToRemove) {
            return reply.status(400).send({ error: 'User id does not exist'})
        }

        await prisma.user.delete({
            where: {
                id: userId,
            }
        })

        return reply.status(200).send({ success: 'User Deleted!'})
    })

    /*--------------------------//------------------------------------*/

    app.put('/users/:userId', async (req, reply) => {
        const paramsSchema = z.object({
            userId: z.string(),
        })

        const bodySchema = z.object({
            name: z.string(),
            age: z.number(),
        })

        const { userId } = paramsSchema.parse(req.params)
        const { name, age } = bodySchema.parse(req.body)

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name,
                age
            }
        })

        return updateUser
    })
}