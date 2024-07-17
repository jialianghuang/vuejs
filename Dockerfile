ARG base_image
FROM $base_image

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
ARG env_id
ARG stage_name
ARG git_version
ENV HOST=0.0.0.0 \
    PORT=3000 \
    ENV_ID=$env_id \
    STAGE_NAME=$stage_name \
    GIT_VERSION=$git_version
COPY static/airship/push-worker.$STAGE_NAME.js static/push-worker.js
COPY . .
# RUN if [ "$env_id" != "1" ] ; then npm run build; fi
RUN npm run build
CMD npm run $STAGE_NAME
