FROM maven:3.9.9-openjdk-17 AS build

WORKDIR /app
COPY pom.xml .
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN cd frontend && npm install

COPY src ./src
COPY frontend ./frontend

RUN cd frontend && npm run build
RUN mkdir -p src/main/resources/static && \
    cp -r frontend/build/* src/main/resources/static/

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim AS runtime

WORKDIR /app
COPY --from=build /app/target/campaign-manager-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
