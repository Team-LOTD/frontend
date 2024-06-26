const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://13.124.237.67:8080/",
            changeOrigin: true,
            pathRewrite: {
                "^/api": "",
            },
        })
    );
};
