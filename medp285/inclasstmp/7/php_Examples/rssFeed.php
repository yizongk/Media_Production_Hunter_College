<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <style>
            body { font-size: 1em; line-height: 1.5em}
            a:visited { color: #a3bcd1; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                <?php
                    function getContent() {
                        $file = "./feed-cache.txt";
                        $current_time = time();
                        $expire_time = 5 * 60;

                        if(file_exists($file) && ($current_time - $expire_time < $file_time)) {
                            return file_get_contents($file);
                        }
                        else {
                            $content = getFreshContent();
                            file_put_contents($file, $content);
                            return $content;
                        }
                    }

                    function getFreshContent() {
                        $html = "";
                        $newsSource = array(
                            array(
                                "title" => "Technology",
                                "url" => "https://www.sciencedaily.com/rss/top/technology.xml"
                            ),
                            array(
                                "title" => "Math News",
                                "url" => "https://www.sciencedaily.com/rss/top/science.xml"
                            ),
                            array(
                                "title" => "Hacker News",
                                "url" => "https://news.ycombinator.com/rss"
                            )
                        );
                        function getFeed($url){
                            $html = "";
                            $rss = simplexml_load_file($url);
                            $count = 0;
                            $html .= '<ul>';
                            foreach($rss->channel->item as$item) {
                                $count++;
                                if($count > 7){
                                    break;
                                }
                                $html .= '<li><a href="'.htmlspecialchars($item->link).'">'.htmlspecialchars($item->title).'</a></li>';
                            }
                            $html .= '</ul>';
                            return $html;
                        }

                        foreach($newsSource as $source) {
                            $html .= '<h2>'.$source["title"].'</h2>';
                            $html .= getFeed($source["url"]);
                        }
                        return $html;
                    }

                    print getContent();
                ?>
                </div>
            </div>
        </div>
    </body>
</html>
