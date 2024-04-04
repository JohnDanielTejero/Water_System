const path = require('path');
const fs = require('fs');

module.exports = (err, req, res, next) => {
    //define error status here
    if (err.status === 404) {
        res.status(404);
        res.set('Content-Type', 'text/html'); 
        //using file read, retrieve the file of template.html
        fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading template');
            }
            
                //using file read, retrieve the actual file
            fs.readFile(path.join(__dirname, '..') + '/pages/404.html', 'utf8', (err, content) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error reading content');
                }

                // Replace the placeholder with the content
                const finalHtml = template.replace(/<div id="main-content"><\/div>/, content);
            
                res.status(200).send(finalHtml);
            });
        });
    } else {
        next(err);
    }
};