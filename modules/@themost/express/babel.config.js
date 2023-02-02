module.exports = function (api) {
    api.cache(false);
    return {
        "sourceMaps": true,
        "retainLines": true,
        "presets": [
            [
                "@babel/preset-env",
                {
                    targets: {
                        node: "12"
                    }
                }
            ]
        ],
        "ignore":  [
            /\/node_modules/
        ],
        "plugins": [
        ]
    };
};
