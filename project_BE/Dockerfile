# Stage 1: Build the JAR
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy source code and pom.xml
COPY . .

# Build project
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copy JAR from build stage (not from local folder)
COPY --from=build /app/target/project_BE-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
