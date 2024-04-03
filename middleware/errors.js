const path = require('path');

module.exports = (err, req, res, next) => {
    //define error status here
    if (err.status === 404) {
        res.status(404);
        res.sendFile(path.join(__dirname, '../pages', '404.html')); 
    } else {
        next(err);
    }
};