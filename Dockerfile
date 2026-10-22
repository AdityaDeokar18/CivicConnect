# Multi-stage Dockerfile for CivicConnect Spring Boot Backend (Root Context)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and build production JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

# Copy built JAR from build stage
COPY --from=build /app/target/civicconnect-backend-*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
