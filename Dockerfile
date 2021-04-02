FROM ubuntu

ENV TZ=Asia/Seoul
RUN apt-get update 
RUN apt-get install -y tzdata
RUN apt-get install -y python3.8
RUN apt-get install -y python3-pip
RUN apt-get install -y python3-dev default-libmysqlclient-dev
RUN apt-get install -y net-tools 
RUN apt-get install -y dnsutils
RUN mkdir /STOCK
WORKDIR /STOCK
COPY requirements.txt /STOCK/
RUN pip3 install -r requirements.txt
COPY . /STOCK/
#RUN pip3 install pip==20.0.2
#RUN pip3 install django
#RUN pip3 install gunicorn==20.0.4
#RUN django-admin startproject STOCK
