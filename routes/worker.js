var dal = require("./lib/dal");

function create(req, res)
{
    res.render('worker/create', {title: 'create'});
}

function createPost(req, res)
{
    var title = req.body.title;
    var body = req.body.body;
    
    dal.createArticle(title, body, function(){
        res.render('worker/create', {title: 'create'})
    });
}

exports.create = create;
exports.createPost = createPost;