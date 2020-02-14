FROM node:11 AS node-build
WORKDIR /build
COPY package*.json ./
RUN npm i
COPY webpack.*.js ./
COPY src/ ./src/
ARG commitHash
ARG buildDate
ENV COMMIT_HASH=$commitHash BUILD_DATE=$buildDate
RUN npm run build

FROM nginx:latest
COPY --from=node-build /build/dist /usr/share/nginx/html
