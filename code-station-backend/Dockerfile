FROM node as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build code-station-backend

# production stage
FROM node as production-stage

COPY --from=build-stage /app/dist/apps/code-station-backend /app/code-station-backend
# COPY --from=build-stage /app/dist/apps/chat-room-backend /app/chat-room-backend

COPY --from=build-stage /app/package.json /app/package.json

COPY --from=build-stage /app/.production.env /app/code-station-backend/.production.env

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3005

CMD ["node", "/app/code-station-backend/main.js"]
