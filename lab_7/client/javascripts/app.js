$(document).ready(function () {
    let объявления = [];

    const loadData = () => {
        $.getJSON("/ads", function(data) {
            console.log("Данные с сервера:", data); 
            объявления = data;
            $(".tabs a:first-child span").trigger("click");
        });
    };

    const addAd = (newAd) => {
        $.post("/ads", newAd, function (response) {
            alert("Объявление успешно добавлено!");
            loadData();
        });
    };

    const extractTags = (text) => {
        return text.split(' ').filter(word => word.startsWith('#')).map(tag => tag.slice(1));
    };

    const renderAds = (ads) => {
        const $list = $('<ul class="ads-list"></ul>'); // Теперь это ul вместо div
        ads.forEach(ad => {
            const tags = extractTags(ad.текст);
            const $tags = $('<div class="tags"></div>');
            tags.forEach(tag => {
                $tags.append(`<span class="tag">#${tag}</span>`);
            });
    
            const $adItem = $(`
                <li class="ad-item">
                    <h3>${ad.автор} - ${ad.дата}</h3>
                    <p>${ad.текст}</p>
                    <p><strong>Цена:</strong> ${ad.цена} руб.</p>
                </li>
            `);
    
            $adItem.append($tags); // Добавляем теги в объявление
    
            $list.append($adItem); // Добавляем элемент в список
        });
        return $list;
    };

    const renderByTags = () => {
        const tagMap = {};
        объявления.forEach(ad => {
            const tags = extractTags(ad.текст);
            tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(ad);
            });
        });

        const $container = $('<div></div>');
        Object.entries(tagMap).forEach(([tag, ads]) => {
            $container.append(`<h2>Тег: #${tag}</h2>`);
            $container.append(renderAds(ads));
        });
        return $container;
    };

    const renderByDateAuthor = () => {
        const dateAuthorMap = {};
        объявления.forEach(ad => {
            const key = `${ad.дата} - ${ad.автор}`;
            if (!dateAuthorMap[key]) dateAuthorMap[key] = [];
            dateAuthorMap[key].push(ad);
        });

        const $container = $('<div></div>');
        Object.entries(dateAuthorMap).forEach(([key, ads]) => {
            $container.append(`<h2>${key}</h2>`);
            $container.append(renderAds(ads));
        });
        return $container;
    };

    const renderAddForm = () => {
        return $(`
            <div class="add-form">
                <h2>Добавить объявление</h2>
                <div class="input-group">
                    <label for="date">Дата:</label>
                    <input type="date" id="date" class="form-input" required>
                </div>
                <div class="input-group">
                    <label for="author">Автор:</label>
                    <input type="text" id="author" class="form-input" required>
                </div>
                <div class="input-group">
                    <label for="price">Цена:</label>
                    <input type="number" id="price" class="form-input" required>
                </div>
                <div class="input-group">
                    <label for="text">Текст (используйте #теги):</label>
                    <textarea id="text" class="form-input" rows="4" required></textarea>
                </div>
                <button id="add-btn">Добавить</button>
            </div>
        `);
    };

    $(".tabs a span").on("click", function () {
        const $element = $(this);
        $(".tabs a span").removeClass("active");
        $element.addClass("active");
        $(".content").empty();
    
        const tabIndex = $element.parent().index();
        console.log("Текущий индекс вкладки:", tabIndex);
    
        switch (tabIndex) {
            case 0:
                console.log("Показать новые объявления:", объявления);
                $(".content").append(renderAds([...объявления].reverse()));
                break;
            case 1:
                $(".content").append(renderAds(объявления));
                break;
            case 2:
                $(".content").append(renderByTags());
                break;
            case 3:
                $(".content").append(renderByDateAuthor());
                break;
            case 4:
                const $form = renderAddForm();
                $(".content").append($form);
    
                $("#add-btn").on("click", function () {
                    const newAd = {
                        дата: $("#date").val(),
                        автор: $("#author").val(),
                        цена: $("#price").val(),
                        текст: $("#text").val()
                    };
    
                    if (newAd.дата && newAd.автор && newAd.цена && newAd.текст) {
                        addAd(newAd);
                    } else {
                        alert("Заполните все поля!");
                    }
                });
                break;
        }
    });

    loadData();

});