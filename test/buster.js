var config = module.exports;

config["amd-ish tests"] = {
    env: "browser",
    rootPath: "../",
    sources: [
        "amd-ish.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};