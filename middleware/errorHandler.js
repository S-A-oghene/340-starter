const utilities = require("../utilities/");

// middleware/errorHandler.js
async function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const nav = await utilities.getNav();
  const status = err.status || 500;
  const message = status === 404 ? "Page not found" : "Something went wrong. Please try again later.";
  res.status(status).render("errors/error", {
    title: `${status} - ${status === 404 ? "Not Found" : "Server Error"}`,
    message,
    nav,
  });
}

// async function errorHandler(err, req, res, next) {
//   console.error(err.stack);
//   const nav = await utilities.getNav();
//   res.status(500).render("errors/error", {
//     title: "500 - Server Error",
//     message: "Something went wrong. Please try again later.",
//     nav,
//   });
// }

module.exports = errorHandler;