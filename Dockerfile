# Use Python 3.10.12 slim
FROM python:3.10.12-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user for security
RUN useradd -m -r django && chown -R django /app
USER django

# Expose port
EXPOSE $PORT

# Run application
CMD python manage.py makemigrations formacoes assiduidade folha_pagamento && python manage.py migrate && python manage.py runserver 0.0.0.0:10000