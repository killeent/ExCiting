var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET email-reponse */
router.get('/email-response/', function(req, res, next) {
  var paper_id = req.query.paper;
  var db = req.db;

  // TODO: Need better error checking than this
  if(!paper_id) {
    var err = new Error('Invalid Parameters');
    err.status = 500;
    next(err);
  }
  else {
    getContentsForPaper(db, paper_id, function(paper_contents){
      
      console.log(paper_contents);

      res.render('email-response-form', 
        {
          title : 'Summarization Evaluation',
          paper_name : paper_contents.paper.title,
          summaries  : paper_contents.aggregate.summaries,
          paper_id : paper_id
        });
    });
  }

  function getContentsForPaper(db, paper_id, viewRenderFn){
    paper_collection = db.get('papers');

    paper_collection.find({"paper_id" : paper_id}, {}, function(err, docs) {
      paper_info = docs[0];
      
      aggregation_collection = db.get('aggregated_results');
      aggregation_collection.find({"paper_id" : paper_id}, {}, function(err, docs) {
        aggregated_info = docs[0];

        contents = {'paper' : paper_info, 'aggregate' : aggregated_info};
        viewRenderFn(contents);
      });
    });
  }
});

router.post('/email-response/', function(req, res, next) {
  var paper_id = req.body.paper_id;
  var db = req.db;

  console.log(req.body);

  // TODO: Need better error checking than this
  if(!paper_id) {
    var err = new Error('Invalid Parameters');
    err.status = 500;
    next(err);
  }
  else {
    // Clean body
    req.body.precision = parseInt(req.body.precision)
    req.body.recall = parseInt(req.body.recall)



    db.get('evaluation_responses').insert(req.body, function(err, docs) {
       if (err) throw err;
    });
    res.send("Posted");
  } 
});

module.exports = router;
