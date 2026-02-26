from sentence_transformers import SentenceTransformer
import asyncio
from fastapi import FastAPI
import numpy as np
import torch
import uvicorn

model = SentenceTransformer("all-mpnet-base-v2")


# Initialize FastAPI app
app = FastAPI()


def set_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    else:
        return torch.device("cpu")


def get_embedding(text):
    embedding = model.encode(text)
    return embedding


def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    if norm_vec1 == 0 or norm_vec2 == 0:
        return 0.0
    return dot_product / (norm_vec1 * norm_vec2)


def check_similarity(text1, text2):
    embedding1 = get_embedding(text1)
    embedding2 = get_embedding(text2)
    similarity = cosine_similarity(embedding1, embedding2)
    return similarity


@app.post("/similarity")
def similarity_endpoint(text1: str, text2: str):
    similarity_score = check_similarity(text1, text2)
    return {"similarity": float(similarity_score)}


def run():
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    run()
