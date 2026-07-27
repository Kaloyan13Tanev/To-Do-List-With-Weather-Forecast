# syntax=docker/dockerfile:1

FROM eclipse-temurin:25-jdk AS build
WORKDIR /usr/src/app

COPY --chmod=0755 mvnw mvnw
COPY .mvn .mvn
RUN --mount=type=bind,source=pom.xml,target=pom.xml \
    --mount=type=cache,target=/root/.m2 \
    ./mvnw dependency:go-offline

COPY pom.xml .
COPY src ./src
RUN --mount=type=bind,source=pom.xml,target=pom.xml \
    --mount=type=cache,target=/root/.m2 \
    ./mvnw clean package -DskipTests && \
    java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination target/extracted

FROM eclipse-temurin:25-jre
ARG UID=10001
RUN adduser --disabled-password --gecos "" --home "/nonexistent" --shell "/sbin/nologin" --no-create-home --uid "${UID}" appuser

WORKDIR /app
COPY --from=build --chown=appuser:appuser /usr/src/app/target/extracted/dependencies/ ./
COPY --from=build --chown=appuser:appuser /usr/src/app/target/extracted/spring-boot-loader/ ./
COPY --from=build --chown=appuser:appuser /usr/src/app/target/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=appuser:appuser /usr/src/app/target/extracted/application/ ./

RUN mkdir -p /app/data && chown appuser:appuser /app/data

USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]