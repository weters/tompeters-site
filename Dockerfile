FROM node:11 AS node-build
WORKDIR /build
COPY package*.json ./
RUN npm i
COPY webpack.*.js ./
COPY src/ ./src/
COPY public/ ./public/
ARG commitHash
ARG buildDate
ENV COMMIT_HASH=$commitHash BUILD_DATE=$buildDate
RUN npm run build

FROM nginx:latest
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=node-build /build/dist /usr/share/nginx/html
