import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_openai import ChatOpenAI
from Models.State import State

# region config and env vars
load_dotenv()

agent_endpoint = os.getenv("AGENT_ENDPOINT") + "/api/v1/"
agent_access_key = os.getenv("AGENT_ACCESS_KEY")
# endregion

llm = ChatOpenAI(
    base_url=agent_endpoint,
    api_key=agent_access_key,
)

agent = init_chat_model(tools=[], llm=llm, agent="zero-shot-react-description", verbose=True)

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}