

FROM node:14.17.5 as builder

WORKDIR /UNFYD-ADMIN-FrontEnd
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE  4200



# Stage 2
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /UNFYD-ADMIN-FrontEnd/dist/AngularDynamicForms /usr/share/nginx/html

ENTRYPOINT  [ "nginx", "-g", "daemon off;" ]
EXPOSE  80


