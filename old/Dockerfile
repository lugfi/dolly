FROM python:3.8

RUN pip3 install pandas
RUN apt-get update -y
RUN apt-get install cron -y

CMD ["./analytics_entrypoint.sh"]
