FROM ubuntu
MAINTAINER Hantao Wang, Anson Tsai

RUN apt-get update
RUN apt-get install -y python3-pip python3-dev build-essential nginx
RUN pip3 install redis python-etcd uwsgi django
# RUN git clone https://github.com/hantaowang/food-finder
RUN mkdir food-finder
ADD ./backend ./food-finder
CMD python3 ./food-finder/manage.py runserver
