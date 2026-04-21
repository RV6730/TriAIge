FROM python:3.10-slim

# Install Node.js for building the React frontend
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy the entire repository into the container
COPY . .

# Build the Vite React Frontend
RUN npm install
RUN npm run build

# Install Python backend dependencies
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Expose the standard port (Render/HF Spaces/Railway use port 7860 or 8000 usually)
# We will use 7860 as it's the default for HuggingFace (and others can map it)
EXPOSE 7860

# Command to run the application using Uvicorn
CMD ["uvicorn", "main:socket_app", "--host", "0.0.0.0", "--port", "7860"]
