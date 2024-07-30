FROM openjdk:23-jdk-slim-bullseye
WORKDIR /app
COPY target/ /app/target/
CMD ["java", "-jar", "/app/target/techspot-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080