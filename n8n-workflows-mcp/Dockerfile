FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

# Command to run the MCP server
ENTRYPOINT ["python", "server.py"]
