FROM node as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build chat-room-backend

# production stage
FROM node as production-stage


# COPY --from=build-stage /app/dist/apps/code-station-backend /app/code-station-backend
COPY --from=build-stage /app/dist/apps/chat-room-backend /app/chat-room-backend

COPY --from=build-stage /app/package.json /app/package.json

COPY --from=build-stage /app/.production.env /app/chat-room-backend/.production.env

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

COPY --from=build-stage /app/prisma /app/prisma
COPY --from=build-stage /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-stage /app/node_modules/@prisma /app/node_modules/@prisma


EXPOSE 3000

CMD ["node", "/app/chat-room-backend/main.js"]
