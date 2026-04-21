FROM python:3.10

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-socketio \
    httpx \
    twilio \
    python-dotenv \
    python-multipart

# Copy everything from root
COPY . .

# Run from root since main.py is now there
CMD ["uvicorn", "main:socket_app", "--host", "0.0.0.0", "--port", "7860", "--log-level", "debug"]
