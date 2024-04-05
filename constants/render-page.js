const path = require('path');
const fs = require('fs');

/**
 * Reduce redundant code when rendering admin page
 * template.html gets read,
 * index.html gets written inside template
 * other utilities such as sidenav, topnav is later written on index.html
 * response is sent to server with the final written html code.
 * Reason for deeply nested: Does not support async, await,
 */
function adminTemplate(req, res, template, page) {
    fs.readFile(path.join(__dirname, '..') + '/pages/admin/index.html', 'utf8', (err, content) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading content');
        }
        fs.readFile(path.join(__dirname, '..') + '/pages/admin/navigation.html', 'utf8', (err, nav) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading content');
            }
            content = content.replace(/<aside id="side-nav"><\/aside>/, nav);
            fs.readFile(path.join(__dirname, '..') + '/pages/admin/topnav.html', 'utf8', (err, topnav) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error reading content');
                }
                content = content.replace(/<nav id="top-nav"><\/nav>/, topnav);
                fs.readFile(path.join(__dirname, '..') + '/pages/admin/' + page + '.html', 'utf8', (err, main) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error reading content');
                    }
                    content = content.replace(/<main id="main-content"><\/main>/, main);
                    const finalHtml = template.replace(/<div id="main-content"><\/div>/, content);
                    
                    res.status(200).send(finalHtml);
                });
            });
        });
    })

    
}

module.exports = { adminTemplate }