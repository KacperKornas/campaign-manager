FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn dependency:go-offline -B
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app
COPY --from=backend-build /app/target/campaign-manager-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
