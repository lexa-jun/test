var siteUrls = [
  {pattern:'^/login/?$', restricted: false}
, {pattern:'^/logout/?$', restricted: true}
, {pattern:'^/$', restricted: false}
, {pattern:'^/single/\\w+/?$', restricted: true}
];

function authorizeUrls(urls) {
  function authorize(req, res, next) {
    var requestedUrl = url.parse(req.url).pathname;
    for (var ui in urls) {
      var pattern = urls[ui].pattern;
      var restricted = urls[ui].restricted;
      if (requestedUrl.match(pattern)) {
        if (restricted) {
          if (req.session.authorized) {
            // если все хорошо, просто переходим к следующим правилам
            next();
            return;
          }
          else{
            // пользователь не авторизирован, отправляем его на страницу логина
            res.writeHead(303, {'Location': '/login'});
            res.end();
            return;
          }
        }
        else {
          next();
          return;
        }
      }
    }

    // сюда мы попадаем, только если в цикле не нашлось совпадений
    console.log('common 404 for ', req.url);
    res.end('404: there is no ' + req.url + ' here');
  }
  return authorize ;
}

app.use('/', authorizeUrls(siteUrls));