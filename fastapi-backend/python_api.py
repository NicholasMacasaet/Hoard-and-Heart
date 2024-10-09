# python_api.py
from fastapi import FastAPI
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec
import cohere
import json


# source env/bin/activate
# uvicorn python_api:app --reload



app = FastAPI()
co = cohere.Client("p6NYPZXl23zwMAn9xMN5rH0NP2GFStgVaTHgbT2r")

@app.get("/embedding/{emotion}")
async def embedding(emotion:str):
    embedding = co.embed(
        texts=[emotion],
        model='embed-english-v3.0',
        input_type='search_query',
        truncate='END'
    ).embeddings


    return{"embedding": embedding}