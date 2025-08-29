FROM python:3.9-slim-buster
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
ENV MONGO_URI="mongodb://mongo:27017/mydatabase"
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]