FROM python:alpine3.17
WORKDIR /users/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install gunicorn
COPY . .
EXPOSE 5000
#CMD ["flask", "run", "--host=0.0.0.0"]