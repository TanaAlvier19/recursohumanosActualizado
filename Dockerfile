FROM python:3.10.12-slim-bullseye

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

RUN useradd -m -r django && chown -R django /app
USER django

EXPOSE $PORT

CMD python manage.py makemigrations formacoes assiduidade folha_pagamento && python manage.py migrate && python manage.py runserver 0.0.0.0:10000