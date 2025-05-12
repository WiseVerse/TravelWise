# Base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy app code
COPY . /app/

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Define environment variables from build args
ARG AGENT_ENDPOINT
ARG AGENT_ACCESS_KEY

ENV AGENT_ENDPOINT=${AGENT_ENDPOINT}
ENV AGENT_ACCESS_KEY=${AGENT_ACCESS_KEY}

# Start FastAPI app
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]
