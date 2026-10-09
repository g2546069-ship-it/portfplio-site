fetch("works.csv")
    .then(function(response){
        return response.text();
    })
    .then(function(data){
        
        //CSVを行ごとに分割
        var rows = data.trim().split("\n");

        //1行目は見出し
        var headers = rows[0].split(",");

        //2行目以降は作品データにする
        var works = rows.slice(1).map(function(row){

            var values = row.split(",");

            var work = {};

            headers.forEach(function(header, index){
                work[header] = values[index];
            });

            return work;
        });

        var grid = document.getElementById("works-grid");

        //HTML要素を取得
        var grid = document.getElementById("works-grid");

        var categorySelect = document.getElementById("category");

        var sortSelect = document.getElementById("sort");

        // カテゴリー覧を作る
        var categories = [];

        works.forEach(function(work){
            //まだ追加されていないカテゴリならリストに追加
            if (!categories.includes(work.category)) {
                categories.push(work.category);
            }
        });

        // selactにカテゴリを追加しWEBページに表示させる
        categories.forEach(function(category) {
            var option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // 作品を表示する関数
        function displayWorks() {
    

            // 選択されたカテゴリを取得
            var selectedCategory = categorySelect.value;

            // 選択されたソート方法を取得
            var sortType = sortSelect.value;

            //元のworksをコピー
            var filteredWorks = works.slice();

            //カテゴリ絞り込み
            if (selectedCategory !== "all") {
                filteredWorks = filteredWorks. filter(function(work) {
                    return work. category === selectedCategory;
                });
            }
            // ソート

            if (sortType === "new") {
                filteredWorks.sort(function (a, b) {
                    return Number(b.year) - Number(a.year);
               });
            }
            
            else if (sortType === "old") {
                filteredWorks.sort(function (a, b) {
                    return Number(a.year) - Number(b.year);
                });
            }
            
            else if (sortType === "title") {
                filteredWorks.sort(function(a, b) {
                    return a.title.localeCompare(b.title, "ja");
                });
            }

            // 画面を一度空にする
            grid.innerHTML = "";

            // 作品を1つずつ表示
            filteredWorks.forEach(function(work) {
                var card = document.createElement("article");
                card.className = "work-card";
                card.innerHTML =
                    '<a href="' + work.link + '">' +
                        '<img src="' + work.image + '" alt="' + work.title + '">' +
                        '<div class="work-info">' +
                            '<p class="work-category">' + work.category + '</p>' +
                            '<h4>' + work.title + '</h4>' +
                            '<p>' + work.description + '</p>' +
                            '<p class="work-year">' + work.year + '</p>' +
                        '</div>' +
                    '</a>';
                grid.appendChild(card);
            });
        }

        // 最初に表示
        displayWorks();

        // カテゴリ変更時
        categorySelect.addEventListener("change", function () {
            displayWorks();
        });

        // ソート変更時
        sortSelect.addEventListener("change", function () {
            displayWorks();
        });

    });

    var latitude = 35.6895; // 東京の緯度
    var longitude = 139.6917; // 東京の経度
    
    var weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=" + 
    "?latitude=" + latitude + 
    "&longitude=" + longitude + 
    "&current_weatherature_2m, weather_code" +
    "&timezone=Asia/Tokyo";

fetch(weatherUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var weatherCode = data.current_.weather_code;
        showWeather(weatherCode);
    })
function showWeather(weatherCode) {
    
    var weatherIcon = document.getElementById("weather-icon");
    
    if (weatherCode === 0) {
        weatherIcon.textContent = "☀️"; // 晴れ
        document.body.style.className = "weather-sunny";

    } else if (weatherCode === 1 && weatherCode <= 3) {
        weatherIcon.textContent = "⛅"; // 曇り
        document.body.style.className = "weather-cloudy";

    } else if (weatherCode === 51 && weatherCode <= 67) {
        weatherIcon.textContent = "🌧️"; //雨
        document.body.style.className = "weather-rainy";

    } else {
        weatherIcon.textContent = "❓"; // 不明weatherIcon.textContent = "⛅"; // 曇り
        document.body.style.className = "weather-cloudy";
    }
}
