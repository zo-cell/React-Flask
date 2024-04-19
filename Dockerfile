FROM node:14 as build
WORKDIR /app
COPY REACT-FLASK/client/package.json REACT-FLASK/client/package-lock.json ./
RUN npm install
COPY REACT-FLASK/client ./
RUN npm run build

FROM python:3.8
WORKDIR /app
COPY REACT-FLASK/requirements.txt ./
RUN pip install -r requirements.txt
COPY REACT-FLASK ./

CMD ["python", "server.py"]