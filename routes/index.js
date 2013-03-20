
/*
 * GET home page.
 */
var dal = require('./lib/dal');

exports.index = function(req, res){
    dal.getArticleList(function(articles){
        res.render('index', {title:'Blog', articles: articles });    
    });
};

exports.detail = function(req, res){
    var id = req.params.id;
    var found = false;
    dal.getArticleList(function(articles){
        for(var i=0;i<articles.length;i++)
        {
            if(articles[i].id==id)
            {
                found = true;
            }
        }
        if(!found)
        {
            res.send(404);
        }
        else
        {
            dal.getArticle(id, function(article){
                res.render('detail', {title: article.title, article:article});
            });
        }
    });
}