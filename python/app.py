from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gradio_client import Client

app = FastAPI()

# Allow CORS for frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

# Define request body schema
class MessageRequest(BaseModel):
    message: str

# Initialize Gradio client
client = Client("hysts/mistral-7b") # Replace with your Gradio space if needed

@app.post("/ask")
async def ask_gradio(request: MessageRequest):
    try:
        result = client.predict(
            request.message,
            1024, # param_2
            0.6, # param_3
            0.9, # param_4
            50, # param_5
            1.2, # param_6
            api_name="/chat"
        )
        return {"response": result}
    except Exception as e:
        return {"error": str(e)}