const http = require("node:http");
const fs = require("node:fs/promise");

const server = http.createServer(async (req, res) => {
    if (req.url === "/register" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let parsedBody = JSON.parse(body);
            let user = await fs.readFile("./users.json", "utf8");
            let parsedUsers = JSON.parse(user);
            if (parsedUsers.find((user) => user.name === parsedBody.name)) {
                res.writeHead(403, { "content-type": "application/json" });
                return res.end(
                    JSON.stringify({ error: "User already exists" })
                );
            }
            parsedUsers.push(parsedBody);
            fs.writeFile("./users.json", JSON.stringify(parsedUsers));
            res.writeHead(200, { "content-type": "application/json" });
            res.end(
                JSON.stringify({ massage: "User successfully registered" })
            );
        });
    }
});

server.listen(8888, () => {
    console.log("The server is listening");
});
