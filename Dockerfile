FROM oven/bun:alpine AS build
WORKDIR /app

ENV VITE_BACKEND_URL=/api

COPY ["package.json", "bun.lockb", "./"]
COPY ["frontend/package.json", "frontend/bun.lockb", "./frontend/"]
COPY ["backend/package.json", "backend/bun.lockb", "./backend/"]

RUN cd frontend && bun install && cd ../backend && bun install

COPY . .

RUN cd frontend && bun run build
RUN cd backend && bun run build

FROM oven/bun:alpine AS app
WORKDIR /app

COPY ["backend/package.json", "backend/bun.lockb", "./"]
RUN bun install --production && rm -rf ~/.bun/install/cache

# Add db clients
RUN apk --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main add postgresql16-client

COPY --from=build /app/backend .
COPY --from=build /app/frontend/dist ./public/
COPY entrypoint.sh .

EXPOSE 3000

ENTRYPOINT ["sh", "entrypoint.sh"]
