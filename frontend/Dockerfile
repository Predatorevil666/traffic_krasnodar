# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Python script into the container
COPY script.py .

# Install the hvac library
RUN pip install hvac

# Command to run the script
CMD ["python", "script.py"]
