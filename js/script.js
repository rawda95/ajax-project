
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    // load streetview
    //GOOGLE api
    var street = $( "#Street" ).val();
    var city = $( "#city" ).val();
    var address = street + ',' +city;

    $greeting.text('SO you wnat to live at '+address +'?');

    var googleurl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+address+'';

    $body.append('<img class="bgimg" src="'+googleurl+'">');

    // YOUR CODE GOES HERE!
    // ny time api

    var nytimesurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytimesurl += '?' + $.param({
    'api-key': "b8b8342672b040b9ac5cfa24de764ade",
    'q':city
    });

    $.getJSON(nytimesurl, function( data ) {
        $nytHeaderElem.text('New York Times Articles About'+ city);
        articles = data.response.docs;
        for (i=0;i< articles.length; i++)
        {
            var article = articles[i];
            $nytElem.append('<li class="article">'+ '<a href="'+article.web_url+'">'+article.headline.main+'</a>'
            +'<p>'+article.snippet+'</p>'+
            '</li>');

        };



    }).error(function() {
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');

        });

    //wiki api

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';

    var wikiRequestTimeout= setTimeout(function(){

        $wikiElem.text('falid to get wikipedia resources');
    },800);


    $.ajax( {
    url: wikiUrl,
    dataType: 'jsonp',
    success: function(response) {
       // do something with data
       articleList = response[1]
       for (i=0;i<articleList.length;i++){
        articleStr = articleList[i]
        var url = 'http://en.wikipedia.org/wiki/'+articleStr;
        $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>')
       };

       clearTimeout(wikiRequestTimeout);
    }

    });

    return false;
};

$('#form-container').submit(loadData);
