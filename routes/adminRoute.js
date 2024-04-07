const express = require('express'); //require express to access router.
const router = express.Router(); //create router instance
const db = require('../constants/dbCon.js'); //require if needed:
const path = require('path');
const bodyParser = require('body-parser'); //required to get serialized payload
const fs = require('fs');
const { adminTemplate } = require('../constants/render-page.js'); //utility for rendering admin page

//requires the router to use bodyParse to ensure that serialized payload is read.
router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Specify requests GET, POST and the corresponding URL
 * 
 * router.<method>(<url>, (req, res) => {
 * 
 *   
 * });
 */

//retrieves the dashboard page
router.get('/', (req, res) => { 
  res.set('Content-Type', 'text/html');
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'dashboard');
  });
}); 

//retrieves the sales page
router.get('/sales', (req, res) => {
  res.set('Content-Type', 'text/html'); 
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'sales');
  });
});

//retrieves the manage sales page
router.get('/sales/manage-sales', (req, res) => {

  res.set('Content-Type', 'text/html'); 
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'manage-sales');
  });
});

//retrieves the jars page
router.get('/jars', (req, res) => {
  res.set('Content-Type', 'text/html'); 
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'jars');
  });

});

//retrieves the manage jars page
router.get('/jars/manage-jars', (req, res) => {
  res.set('Content-Type', 'text/html'); 
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'manage-jars');
  });
});

//retrieves the reports page
router.get('/reports', (req, res) => {
  res.set('Content-Type', 'text/html'); 
  if(typeof req.session.user == "undefined" || typeof req.session.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }
    adminTemplate(req, res, template, 'sales-report');
  });
});

/**
 * API, since we are using AJAX, it will mostly deal with JSON
 * allows client and server to interact without refreshing the page
 * you can see the response via the success callback found in the ajax in jQuery
 */
//API - delete sales
router.get('/delete-sales', (req, res) => {
  const {customer} = req.query;
  console.log(customer);
  db.query(`DELETE FROM sales WHERE id = ${customer}`, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    return res.status(200).send({"status" : 'success'});
  })

});

//API - get sales with corresponding total quantity
router.get('/sales_list', (req, res) => {
  db.query(`
    SELECT s.*, q.total_quantity
    FROM sales s
    INNER JOIN (
        SELECT sales_id, SUM(quantity) AS total_quantity
        FROM sales_items
        GROUP BY sales_id
    ) q ON s.id = q.sales_id
    ORDER BY unix_timestamp(s.date_created) DESC;`, 
    (err, result) => {
      if (err){
        console.error(err);
      }else{
        res.status(200).json(result);
      }
  })
})

//API - get total sales
router.get('/total_sales', (req, res) => {
  const { date } = req.query;
  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(dateFormat.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  db.query("SELECT sum(amount) AS total FROM sales WHERE date(date_created) = ?", [formattedDate], (err, result) => {
      if (err){
        console.error(err);
      }else{
        res.status(200).json(result[0]);
      }
  })
});

//API - get types of jar
router.get('/jars-list', (req, res) => {
  db.query("SELECT * FROM jar_types order by 1 desc", (err, result) => {
    if (err){
      console.error(err);
    }else{
      res.status(200).json(result);
    }
  });
});

//API - save sales
router.post('/save-sales', (req, res) => {
  
  const data = req.body;
  const date = new Date();
  db.query(`
    INSERT INTO sales(customer_name, delivery_address, type, amount, status, date_created, date_updated)
      VALUES (?, ?, ?, ? ,? ,? ,?);
  `, [data.customer_name, data.delivery_address, data.type, data.amount, data.status, date, date],
    (err, result) => {
      if(!err){
        const { insertId } = result;
        data.jar_type_id.forEach((element, index)=> {
          db.query(`
            INSERT INTO sales_items(sales_id, jar_type_id, quantity, price, total_amount)
              VALUES (?, ?, ?, ?, ?);
          `, [insertId, element, data.quantity[index], data.price[index], data.total_amount[index]],
            (err, result) => {
              if (err){
                console.error(err);
                return res.status(200).json({"stastus": "unsuccessful"});
              }  
            }
          )
        });
        return res.status(200).json({"status": "success"});
      }
      return res.status(200).json({"stastus": "unsuccessful"});
    }
  );
});

//API - update sales
router.post('/update-sales', (req, res) => {
  const { customer } = req.query;
  const data = req.body;
  const date = new Date();
  db.query(`
    UPDATE sales SET 
      customer_name = ?, 
      delivery_address = ?, 
      type = ?, 
      amount = ?, 
      status = ?, 
      date_updated = ?
    WHERE id = ${ customer };
  `, [data.customer_name, data.delivery_address, data.type, data.amount, data.status, date],
    (err, result) => {
      if(!err){
        
        db.query(`DELETE FROM sales_items WHERE sales_id = ${customer}`); 

        data.jar_type_id.forEach((element, index) => {
          db.query(`
            INSERT INTO sales_items(sales_id, jar_type_id, quantity, price, total_amount)
              VALUES (?, ?, ?, ?, ?);
          `, [customer, element, data.quantity[index], data.price[index], data.total_amount[index]],
            (err, result) => {
              if (err){
                console.error(err);
                return res.status(200).json({"stastus": "unsuccessful"});
              }  
            }
          )
        });
        return res.status(200).json({"status": "success"});
      }
      return res.status(200).json({"stastus": "unsuccessful"});
    }
  );
});

//API - get customer record
router.get('/get-customer-record', (req, res) => {
  const { customer } = req.query;
  
  db.query(`
    SELECT *
    FROM sales s
    INNER JOIN sales_items si ON s.id = si.sales_id
    WHERE s.id = ${customer}
  `, (err,rows) => {
    if(err){ 
      console.error(err);
      return;
    }

    const result = rows.reduce((acc, current) => {
      //checks if an accumulator with the key does not exist
      if(!acc[current.sales_id]){
        acc[current.sales_id] = {
          id: current.sales_id,
          type: current.type,
          customer_name: current.customer_name,
          delivery_address: current.delivery_address,
          amount: current.amount,
          status: current.status,
          date_created: current.date_created,
          date_updated: current.date_updated,
          items: []
        }
      }

      //appends the sales_item to the accumulator
      acc[current.sales_id].items.push({
        sales_id: current.sales_id,
        jar_type_id: current.jar_type_id,
        quantity: current.  quantity,
        price: current.price,
        total_amount: current.total_amount
      });

      //returns the value
      return acc;
    }, {});
    return res.status(200).json(result[customer]);
  })

});

//API-  get specific jar
router.get('/jar', (req, res) => {
  const { jar } = req.query;

  db.query(`
    SELECT * FROM jar_types WHERE id = ${jar} LIMIT 1;
  `, (err,result) => {
    if(!err){
      return res.status(200).json(result);
    } 
    console.error(err);
    return res.status(200).json({"message":"unsucessful"});
  });
});

//API - add jars
router.post('/add-jar', (req, res) => {
  const data = req.body;
  const date = new Date();
  db.query(`
    INSERT INTO jar_types(name, description, pricing, date_created, date_updated)
      VALUES (?, ?, ?, ? ,?);
  `, [data.name, data.description, data.pricing, date, date],
    (err, result) => {
      if(!err){
        return res.status(200).json({"status": "success"});
      }
      return res.status(200).json({"stastus": "unsuccessful"});
    }
  );
});

//API - edit jars
router.post('/edit-jar', (req, res) => {
  console.log(req.body);
  const {jarid, ...data } = req.body;
  const date = new Date();
  db.query(`
    UPDATE jar_types
    SET
      name = ?, 
      description = ?, 
      pricing = ?,
      date_updated = ?
    WHERE id = ${jarid};
  `, [data.name, data.description, data.pricing, date],
    (err, result) => {
      if(!err){
        return res.status(200).json({"status": "success"});
      }
      console.log(err);
      return res.status(200).json({"stastus": "unsuccessful"});
    }
  );
});

//API - delete jar
router.get('/delete-jar', (req, res) => {
  const { jar } = req.query;
  db.query(`
    DELETE FROM jar_types
    WHERE id = ${jar};
  `,
    (err, result) => {
      if(!err){
        return res.status(200).json({"status": "success"});
      }
      console.log(err);
      return res.status(200).json({"stastus": "unsuccessful"});
    }
  );
});

//API - get sales based on filter
router.get('/get-sales-report', (req, res) => {
  const { datestart, dateend, type } = req.query;

  let query = `
    SELECT * FROM sales 
    WHERE 
      status = 1 
    AND
      date(date_created) BETWEEN '${datestart}' and '${dateend}'
  `;

  // Check if type is defined and not null
  if (type !== undefined && type !== null && type !== "all") {
    query += ` AND type = '${type}'`;
  }

  db.query(query, (err, rows) => {
    if(!err){
      return res.status(200).json(rows);
    }
    return res.status(200).json(err);
  });
});

//API - get sales-item based on filter
router.get('/get-sales-items', (req, res) => {
  const { sales_id } = req.query;
  let query = `
  SELECT i.*, j.name FROM sales_items i inner join jar_types j on j.id = i.jar_type_id 
  WHERE i.sales_id = ${sales_id};
  `;

  db.query(query, (err, rows) => {
    if(!err){
      return res.status(200).json(rows);
    }
    return res.status(200).json(err);
  });
});

module.exports = router;