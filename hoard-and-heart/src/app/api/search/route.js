import { Pinecone } from "@pinecone-database/pinecone";

export async function GET(req, res) {

    const pc = new Pinecone({apiKey: 'PINECONE_API'})
    const index = pc.index("animesearch")



    // res.status(200).json({ message: 'Hello from Next.js!' })
    return new Response(JSON.stringify({ message: 'Hello from Next.js!'}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  }