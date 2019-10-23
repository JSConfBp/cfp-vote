FROM node:10.15-alpine

LABEL name "cfp-vote-ui"

ARG app_path=/opt/local/app

COPY . $app_path

WORKDIR $app_path

RUN npm install --only=prod

CMD ["npm", "run", "start"]

EXPOSE 80