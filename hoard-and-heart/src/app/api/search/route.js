import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import {prisma} from "../../../prisma/prisma"
// const pc = new Pinecone({apiKey: 'PINECONE_API'})

const pc = new Pinecone({apiKey:process.env.PINECONE_API})
const index = pc.index("animesearch")

export async function POST(req) {
    try{
        const body = await req.json()
        const {emotion} = body
        //console.log(query)

        // let {vector} = body
        const query = await index.query({
            vector:emotion,
            topK:5,
            includeMetadata:true,
        })
        let count = 0;
        let terminate = false;
        let show_ids=[]
        // console.log(`matches: ${query['matches']}`)
        for (const genre of query['matches']){
            if(terminate){
                //we've found the max number of shows in the previous iteration, break the loop 
                break;
            }
            for (const show_id of genre['metadata']['shows']){
                count +=1;
                //console.log(`show id: ${show_id}`)
                show_ids.push(parseInt(show_id,10))
                if(count === 10){
                    terminate = true;
                    break;
                    //we've reached the max number of shows (10 break the loop and set the outer flag to false)
                }
            }
        }

        console.log(`show id's ${show_ids}`)
        const show_data = await prisma.animeData.findMany({
            where:{
                id:{
                    in:show_ids
                }
            }
        })
        //console.log(`show data: ${show_data}`)


        return new Response(JSON.stringify({ "animes": show_data}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    


    // res.status(200).json({ message: 'Hello from Next.js!' })
    // return new Response(JSON.stringify({ message: 'Hello from Next.js!'}), {
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
  }