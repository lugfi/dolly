FROM python:3

RUN pip install pandas
RUN apt-get update -y
RUN apt-get install cron -y

CMD ["./analytics_entrypoint.sh"]
