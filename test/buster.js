var config = module.exports;

config["module tests"] = {
    env: "browser",
    rootPath: "../",
    sources: [
        "module.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};