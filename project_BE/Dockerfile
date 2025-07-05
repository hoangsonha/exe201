FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

COPY --from=build /app/target/project_BE-0.0.1-SNAPSHOT.jar app.jar
COPY image_caption_server.py ./image_caption_server.py

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]