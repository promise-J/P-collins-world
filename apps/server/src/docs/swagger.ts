import swaggerJsDoc from "swagger-jsdoc";

// export const swaggerSpec =
//   swaggerJsDoc({
//     definition: {
//       openapi: "3.0.0",
//       info: {
//         title: "P Collins API",
//         version: "1.0.0"
//       }
//     },
//     apis: ["./src/routes/*.ts"]
//   });

export const swaggerSpec =
swaggerJsDoc({
 definition:{
   openapi:"3.0.0",
   info:{
      title:"P Collins API",
      version:"1.0.0"
   }
 },
//  apis:["./src/**/*.ts"]
apis: [
  "./src/**/*.ts",
  "./src/**/*.js",
  "./dist/**/*.js",
  "./modules/**/*.ts"
],
});