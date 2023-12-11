FROM node:20-alpine
WORKDIR /user/src/app
COPY . .
RUN pnpm ci --omit=dev
RUN pnpm build
USER node
CMD [pnpm,start:prod]