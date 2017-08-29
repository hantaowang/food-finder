FROM ubuntu
MAINTAINER Hantao Wang, Anson Tsai

RUN apt-get update && apt-get install -y python3 build-essential nginx
RUN pip install redis python-etcd uwsgi
RUN git clone https://github.com/hantaowang/food-finder
