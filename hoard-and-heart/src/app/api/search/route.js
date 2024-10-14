import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

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

        return new Response(JSON.stringify({ results: query}), {
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