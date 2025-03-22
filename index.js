const http = require("node:http");
const fs = require("node:fs/promise");

const server = http.createServer(async (req, res) => {
    if (req.url === "/register" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let { name, password } = JSON.parse(body);
            let users = await fs.readFile("./users.json", "utf8");
            let parsedUsers = JSON.parse(users);
            if (!name || !password) {
                res.writeHead(404, { "content-type": "application/json" });
                return res.end(
                    JSON.stringify({ error: "Name or password does not exist" })
                );
            }
            const symbols = "!$_-";
            let hasSymbol = password
                .split("")
                .some((char) => symbols.includes(char));
            let hasUpper = password
                .split("")
                .some((char) => char >= "A" && char <= "Z");
            let hasLower = password
                .split("")
                .some((char) => char >= "a" && char <= "z");
            let hasNumber = password
                .split("")
                .some((char) => char >= "0" && char <= "9");

            if (password.length < 4 || password.length > 10) {
                return res.end(
                    "Password should has min 4 and max 10 character!"
                );
            }
            if (!hasUpper) {
                return res.end("Password must be at least 1 Uppercase!");
            }
            if (!hasLower) {
                return res.end("Password must be at least 1 Lowercase!");
            }
            if (!hasNumber) {
                return res.end("Password must be at least 1 number!");
            }
            if (!hasSymbol) {
                return res.end("Password must be at least 1 symbol!");
            }

            if (parsedUsers.find((user) => user.name === name)) {
                res.writeHead(403, { "content-type": "application/json" });
                return res.end(
                    JSON.stringify({ error: "User already exists" })
                );
            }
            parsedUsers.push(parsedBody);
            await fs.writeFile("./users.json", JSON.stringify(parsedUsers));
            res.writeHead(200, { "content-type": "application/json" });
            res.end(
                JSON.stringify({ message: "User successfully registered" })
            );
        });
    }
});

server.listen(8888, () => {
    console.log("The server is listening");
});
