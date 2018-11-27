FROM node:10-alpine
WORKDIR /root/
COPY src /root/src
COPY static /root/static
COPY i18n /root/i18n
COPY *.json /root/

ENV GLOBAL_HOST chaus.now.sh
ENV GLOBAL_PORT 443
ENV NODE_ENV production
ENV NODE_PATH ./src
ENV NPM_CONFIG_PRODUCTION false
RUN npm i --unsafe-perm --production
EXPOSE 3000
CMD ["npm", "start"]
