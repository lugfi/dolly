## DOLLY NEXT

## System Requirements

- Node.js 16.8 or later;
- macOS, Windows (including WSL), and Linux are supported.

## 💻 Programming languages and technologies

- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Lint-staged](https://github.com/okonet/lint-staged)
- [Cypress](https://www.cypress.io/)

## RUN

- Clone repository

`$ git clone https://github.com/lugfi/dolly.git`

- Install dependencies

`$ yarn` OR `$ npm i`

- Put the Husky to work

`$ yarn husky-install` OR `$ npm run husky-install`

- Run the development server

`$ yarn dev` OR `$ npm run dev`

```
    1. Open (http://localhost:3000) with your browser to see the result.
    2. You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.
```

## Terminal commands

- `dev`: runs your application on `localhost:3000`;
- `build`: creates the production build version;
- `start`: starts a simple server with the build production code;
- `prettier`: runs the prettier commands in all components and pages;
- `lint`: runs the lintering commands in all components and pages;
- `lint-staged`: runs the linting & prettier commands to those files which are changed not all the project files;
- `husky-install`: initialize the husky;
- `type-check`: runs the linter in all components and pages;
- `cypress:open`: runs cypress on browser to check e2e and components tests;
- `cypress:run`: runs cypress on terminal to check e2e and components tests.
