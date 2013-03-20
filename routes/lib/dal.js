/**
 * The data access layer,
 * Step 1. Retrive flat files from db folder
 */
var fs = require("fs");
var uuid = require('node-uuid');
var cache = require('memory-cache');
var indexFile = __dirname+"/../../db/index";
var archiveFolder = __dirname+'/../../db/archive';


function getDateStr()
{
    var date = new Date();
    var timeStr = date.getFullYear()+'-'
                +(date.getMonth()+1)+'-'
                +date.getDay()+' '
                +date.getHours()+':'
                +date.getMinutes()+':'
                +date.getSeconds();
    return timeStr;
}

function addArticleToIndex(title, callback)
{
    fs.exists(indexFile, function(isExisted){
        var id = uuid.v4();
        var newFile =  {
                id: id,
                title: title,
                createdAt: getDateStr()
            };
        var fileStr = JSON.stringify(newFile) + '\n';
        if(!isExisted)
        {
            fs.writeFile(indexFile, fileStr, 'utf8', callback(id));
        }
        else
        {
            fs.appendFile(indexFile, fileStr, 'utf8', callback(id));
        }
    });
}

function createArticle(title, body, callback)
{
    addArticleToIndex(title, function(id){
        var newArticle = {
            title:title,
            body:body
        };
        var articleStr = JSON.stringify(newArticle);
        var newFileName = archiveFolder + "/" + id;
        fs.writeFile(newFileName, articleStr, 'utf8', callback);
        cache.del('articlelist');
    });
}
 
function editArticle(id, title, body)
{
    
}

function deleteArticle(id)
{
    
}

function getArticle(id, callback)
{
    if(cache.get(id)===null)
    {
        fs.readFile(archiveFolder+"/"+id, 'utf8', function(err, data) {
            if(!err)
            {
                var article = JSON.parse(data);
                cache.put(id, article);
                callback(cache.get(id));
            }
        })
    }
    else
    {
        callback(cache.get(id));
    }
}

function getArticleList(callback)
{
    if(cache.get('articlelist')===null)
    {
        fs.readFile(indexFile, 'utf8', function(err, articleIndexes){
            if(!err)
            {
                var articlesStrs = articleIndexes.split('\n');
                var articleArray = [];
                for(var i=0;i<articlesStrs.length-1;i++)
                {
                   var article = JSON.parse(articlesStrs[i]);
                   articleArray.push(article);
                }
                cache.put('articlelist', articleArray);
                callback(cache.get('articlelist'));
            }
        });
    }
    else
    {
        callback(cache.get('articlelist'));
    }
}

exports.createArticle = createArticle;
exports.editArticle = editArticle;
exports.getArticleList = getArticleList;
exports.getArticle = getArticle;