const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(sass|css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader',]
            }
        ],
    },
    watch: true
    
};


