//Global Variables are listed here
var cardImage;
var cardName;
var cardValueUSD;
var currency1 = "USD";
var deckArray = [];
var favArray = [];
var currencyCode = "EUR";
var currencyCatch;
var cardValueVar;
var cardValueVarRound;
var currencySymbol;
var counter = 0

showFavorites();

//This is the primary function that will call the card and dispaly it on the DOM
function displayCard() {
    $.ajax({
        url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
        method: "GET"
    }).then(function (response) {
        console.log('response:', response)

        cardName = response.name;
        cardImage = response.image_uris.border_crop;
        bannerImage = response.image_uris.art_crop;
        $('.cardFace').replaceWith('<img class="cardFace" src="' + cardImage + '">');
        $('.othr').remove();
        $('.pthr').remove();
        $('.name').replaceWith('<h2 class="name">' + response.name + '</h2>');
        $('.cost').replaceWith('<p class="cost">' + response.mana_cost + '</p>');
        $('.cardType').replaceWith('<p class="cardType">' + response.type_line + '</p>');
        if (response.oracle_text != null) {
            $('.oracleText').replaceWith('<hr class="rounded othr"><p class="oracleText">' + response.oracle_text + '</p>');
        } else if (response.card_faces[0].oracle_text != null) {
            $('.oracleText').replaceWith('<hr class="rounded othr"><p class="oracleText">' + response.card_faces[0].oracle_text + '<br>' + response.card_faces[1].oracle_text + '</p>');
        } else {
            $('.oracleText').replaceWith('<p class="oracleText"></p>');
        }
        if (response.power != null) {
            $('.powerToughness').replaceWith('<hr class="rounded pthr"><p class="powerToughness">' + response.power + '/' + response.toughness + '</p>');
        } else {
            $('.powerToughness').replaceWith('<p class="powerToughness"></p>');
        }
        if (response.prices.usd != null) {
            $('.price').replaceWith('<p class="price">US$ ' + response.prices.usd + '</p>');
        } else {
            $('.price').replaceWith('<p class="price">$0.00</p>');
        }
        $('.welcome').css("background-image", "url(" + bannerImage + ")");
        $('#addCard').val('');
        jQuery('.card-info').addClass('infoblockstyle');
        jQuery('.price').addClass('pricestyle');
        jQuery('.converted').addClass('convertpricestyle');
        cardValueUSD = response.prices.usd;
        manaReplace();
        currencyConvert();
        if (jQuery.inArray(cardName, deckArray) == -1 || deckArray === null) {
            createQuickCard(cardName);
            createDeckArray();
        } else {
            return
        }

    }).catch(function (error) {
        $('.error').replaceWith('<p class="error">' + error.responseJSON.details + '</p>');
        $(".modal").addClass("is-active");
        $('#addCard').val('');
    });
};

// This is the function that controls the currency conversion process
function currencyConvert() {
    $.ajax({
        url: 'https://api.exchangeratesapi.io/latest?base=' + currency1,
        method: "GET"
    }).then(function (response) {
        currencyCatch = eval('response.rates.' + currencyCode);
        cardValueVar = cardValueUSD * currencyCatch;
        cardValueVarRound = cardValueVar.toFixed(2);
        currencySymbol = document.getElementById(currencyCode).getAttribute("data-CurrencySymbol");
        $('.converted').replaceWith('<p class="converted convertpricestyle">' + currencySymbol + cardValueVarRound + '</p>');
    });
};

// This function adds the card to the list of cards on the DOM and regulates the length of the list
function createQuickCard() {
    $('#savedCards').after(
        '<tr><td width="10%"><i class="fab fa-wizards-of-the-coast"></td><td width="70%"><a class="cardRecall" value="'
        + cardName +
        '">'
        + cardName +
        '</p></td><td width="20%"><a class="button is-primary grad saveCardBtn" value="'
        + cardName +
        '">Save Card</a></td></tr>');
    counter++;
    if (counter > 10) {
        counter--;
        $('#savedCards').find("tr:last-child").remove()
    }
};

// This function will replace mana symbols on the array
function manaReplace() {
    var str = document.getElementById("mana").innerHTML;
    var res = str
        .replace(/{R}/g, '<img src="./assets/symbols/red.png">')
        .replace(/{G}/g, '<img src="./assets/symbols/green.png">')
        .replace(/{W}/g, '<img src="./assets/symbols/white.png">')
        .replace(/{U}/g, '<img src="./assets/symbols/blue.png">')
        .replace(/{B}/g, '<img src="./assets/symbols/black.png">')
        .replace(/{C}/g, '<img src="./assets/symbols/colorless.png">')
        .replace(/{X}/g, '<img src="./assets/symbols/X.svg">')
        .replace('{1}', '<img src="./assets/symbols/1.png">')
        .replace('{2}', '<img src="./assets/symbols/2.png">')
        .replace('{3}', '<img src="./assets/symbols/3.png">')
        .replace('{4}', '<img src="./assets/symbols/4.svg">')
        .replace('{5}', '<img src="./assets/symbols/5.svg">')
        .replace('{6}', '<img src="./assets/symbols/6.svg">')
        .replace('{7}', '<img src="./assets/symbols/7.svg">')
        .replace('{8}', '<img src="./assets/symbols/8.png">')
        .replace('{9}', '<img src="./assets/symbols/9.png">')
        .replace('{0}', '<img src="./assets/symbols/10.svg">')
        .replace('{10}', '<img src="./assets/symbols/10.svg">')
        .replace('{11}', '<img src="./assets/symbols/11.svg">')
        .replace('{12}', '<img src="./assets/symbols/12.svg">')
        .replace('{13}', '<img src="./assets/symbols/13.svg">')
        .replace('{14}', '<img src="./assets/symbols/14.svg">')
        .replace('{15}', '<img src="./assets/symbols/14.svg">')
        .replace('{16}', '<img src="./assets/symbols/16.svg">')
        .replace('{T}', '<img src="./assets/symbols/tap.png">');

    document.getElementById("mana").innerHTML = res;
};

// This function will update the array after the card is pulled
function createDeckArray() {
    deckArray.push(cardName);
    localStorage.setItem("deckArray", JSON.stringify(deckArray));
};

// loads the favorites from the favarray onto the page
function showFavorites() {
    var myFavs = JSON.parse(localStorage.getItem('favArray'));
    if (myFavs !== null) {
        favArray = jQuery.uniqueSort(myFavs);
        for (i = 0; i < myFavs.length; i++) {
            cardName = myFavs[i];
            createQuickCard(myFavs[i]);
        }
        deckArray = favArray;
    }
}

//These are all the trigger events for the Card Array
$(document).on("click", ".cardRecall", function () {
    cardName = $(this).attr("value");
    displayCard(cardName);
});

$(document).on('click', ".saveCardBtn", function (e) {
    cardName = $(this).attr("value");
    favArray.push(cardName);
    localStorage.setItem('favArray', JSON.stringify(favArray));
});

//These are the trigger events related to currency conversion
$(".currencySelect").change(function () {
    currencyCode = $(".currencySelect option:selected").attr("id");
    if ($('.converted').hasClass('convertpricestyle')) {
        currencyConvert();
    } else {
        return;
    }
});

// These are all the trigger events for General Clicks & Keypresses
$(".modal-close").click(function () {
    $(".modal").removeClass("is-active");
});

$("#closebtn").click(function () {
    $(".modal").removeClass("is-active");
});

$(".modal-background").click(function () {
    $(".modal").removeClass("is-active");
});

$("#clearBtn").click(function () {
    deckArray = [];
    favArray = [];
    localStorage.clear();
    $('td').replaceWith('');
});

// This is the main trigger event for the page
$('#addCard').on('keypress', function (event) {
    cardName = document.querySelector('#addCard').value;
    if (cardName === null) {
        return;
    }
    if (event.which == 13) {
        if ($('.modal').hasClass('is-active')) {
            $(".modal").removeClass("is-active");
        } else {
            cardName = document.querySelector('#addCard').value;
            displayCard();
        }
    }
});
