# Base image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    graphviz \
    libgraphviz-dev \
    pkg-config \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy app code
COPY . /app/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Define environment variables from build args
ARG AGENT_ENDPOINT
ARG AGENT_ACCESS_KEY

ENV AGENT_ENDPOINT=${AGENT_ENDPOINT}
ENV AGENT_ACCESS_KEY=${AGENT_ACCESS_KEY}

# Start FastAPI app
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]