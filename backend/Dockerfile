FROM python:3-alpine

WORKDIR /app

RUN apk update && apk add --no-cache tini

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install waitress

COPY . .

ENV DATABASE_URL=sqlite:////data/advent_calendar.db
ENV UPLOAD_FOLDER=/data/uploads

VOLUME /data

EXPOSE 8080

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["waitress-serve", "--host", "0.0.0.0", "main:app"]
