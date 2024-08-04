const fs = require("fs");

// function logReqRes(filename) {
//   return (req, res, next) => {
//     fs.appendFile(
//       filename,
//       `Request Method: ${req.method}; Req URL : ${req.url}; at ${Date()}\n`,
//       (err, data) => {
//         if (err) console.log("Error logging the request to the log.txt");
//         else console.log("Log file updated.");
//         next();
//       }
//     );
//   };
// }

//arrow fn
const logReqRes = (filename) => (req, res, next) => {
  fs.appendFile(
    filename,
    `Request Method: ${req.method}; Req URL : ${req.url}; at ${Date()}\n`,
    (err) => {
      if (err) console.log("Error logging the request to the log.txt");
      else console.log("Log file updated.");
      next();
    }
  );
};

module.exports = { logReqRes };
