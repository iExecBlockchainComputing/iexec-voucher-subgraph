# iexec-voucher-subgraph deployer

FROM node:20

WORKDIR /iexec-voucher-subgraph

COPY package*.json .
COPY schema.graphql .
COPY subgraph.template.yaml .
COPY src ./src

RUN npm ci

ENTRYPOINT [ "npm", "run", "all" ]
