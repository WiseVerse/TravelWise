from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START
from Nodes.chatbot import chatbot
from Models.State import State

app = FastAPI()

# LangGraph Setup
memory = MemorySaver()
graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile()

# Request Body Model
class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    response_messages = []
    for event in graph.stream({"messages": request.messages}):
        for value in event.values():
            response_messages.append(value["messages"][-1])
    return {"responses": response_messages}
