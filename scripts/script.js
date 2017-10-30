$(document).ready(displayStorage());

$('#search-input').keyup(searchCards);

$('#body-input').keyup(sizeInput(this));

$('.button-save').on('click', instantiateNewObject);

$('#cards-container').on('click', '.idea-card .card-delete-button', function() {
  deleteCard(this)
});

$('#cards-container').on('click', '.idea-card .upvote-button', function() {
  setQuality(this, 'upvote') 
});

$('#cards-container').on('click', '.idea-card .downvote-button', function() {
  setQuality(this, 'downvote') 
});

$('#cards-container').on('blur keydown', '.idea-card .card-header', function(e) {
  enterKeyPress(e, this, 'title')
});

$('#cards-container').on('blur keydown', '.idea-card .card-content', function(e) {
  enterKeyPress(e, this, 'body');
});

$('#cards-container').on('click', '.idea-card .complete-btn', function() {
  completionValue(this);
});

function addToStorage(object) {
  localStorage.setItem(object.cardKey, JSON.stringify(object));
};

function deleteCard(card) {
  thisKey = $(card).closest('.idea-card').attr('id');
  card.closest('.idea-card').remove();
  localStorage.removeItem(thisKey);
};

function displayStorage() {
  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if ($thisCard.completed === false) {
        prependObject($thisCard);

      // hideCard($thisCard.cardKey);
      // toggleCompletionClass($thisCard.cardKey)
    };
  };
};

function IdeaObject(cardKey, title, body, quality) {
  this.cardKey = cardKey;
  this.title = title;
  this.body = body;
  this.quality = quality;
  this.voteCounter = 0;
  this.completed = false;
};

function instantiateNewObject(e) {
  e.preventDefault();
  var $titleInput = $('#title-input');
  var $bodyInput = $('#body-input');
  var newObject = new IdeaObject(Date.now(), $titleInput.val(), $bodyInput.val(), 'swill') 
  addToStorage(newObject);
  prependObject(newObject);
  resetInputs($titleInput, $bodyInput);
  textValidation(newObject);
};

function textValidation(object) {
  if (object.title === "" || object.body === "") {
    $('.button-save').text("please enter an idea");
    setTimeout(function(){ $('.button-save').text("save"); }, 2500);
    return false;
  };
};

function prependObject(object) {
  $('#cards-container').prepend(
    $(`<article class="idea-card" id="${object.cardKey}">
        <header class="card-header-container">
          <h3 class="card-header" contenteditable="true">${object.title}</h3>
          <button class="complete-btn">Completed Task</button>
          <button class="card-delete-button"></button>
        </header>
        <p class="card-content" contenteditable="true">${object.body}</p>
        <footer class="card-footer-container">
          <button class="upvote-button"></button>
          <button class="downvote-button"></button>
          <h4 class="quality-header">quality: <span class="idea-quality">${object.quality}</span></h4>
        </footer>
      </article> `));
};

function resetInputs($title, $body) {
  $title.val("");
  $body.val("");
  $('#search-input').val("");
};

function enterKeyPress(e, card, target) {
  if (e.which === 13 && !$(e.target).is('textarea')) {
      e.preventDefault();
    }
  if (e.which === 13 || e.which === 'focusout') {
    saveEdits(card, target);
    console.log(e.which)
  }
}

function saveEdits(card, target) {
  var text = $(card).text();
  var thisKey = $(card).closest('.idea-card').attr('id');
  var $thisText = JSON.parse(localStorage.getItem(thisKey));
  $thisText[target] = text;
  localStorage.setItem(thisKey, JSON.stringify($thisText));
};

function searchCards(e) {
  $('.idea-card').addClass('hidden')

  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
     if ($thisCard.title.includes($('#search-input').val()) || $thisCard.body.includes($('#search-input').val())) {
      var keyId = "#" + $thisCard.cardKey
      $(keyId).removeClass('hidden');
    };
  };
};

function setQuality(card, vote) {
  var thisKey = $(card).closest('.idea-card').attr('id');
  var $thisObject = JSON.parse(localStorage.getItem(thisKey));

  if ( vote === 'upvote' && $thisObject.voteCounter < 2) {
    $thisObject.voteCounter++;
  } else if (vote === 'downvote' && $thisObject.voteCounter > 0) {
    $thisObject.voteCounter--;
  };
  
  saveQuality($thisObject, thisKey);
};

function saveQuality($thisObject, thisKey) {
  var ratingArray = ['swill', 'plausible', 'genius'];
  $thisObject.quality = ratingArray[$thisObject.voteCounter];
  $(`#${thisKey} .idea-quality`).text($thisObject.quality);
  localStorage.setItem(thisKey, JSON.stringify($thisObject));
};

function completionValue(completeBtn) {
  var thisID = $(completeBtn).closest('article').attr('id');
  var thisObject = JSON.parse(localStorage.getItem(thisID));
  if (thisObject.completed === false) {
    thisObject.completed = true;
  } else {
    thisObject.completed = false;
  }
  localStorage.setItem(thisID, JSON.stringify(thisObject));
  toggleCompletionClass(thisID)
};

function toggleCompletionClass(articleID) {
  $(`#${articleID}`).toggleClass('grayout-card');
  $(`#${articleID}`).find('.complete-btn').toggleClass('grayout-btn');
};

// function hideCard(articleID) {
//   var attr = $(`#${articleID}`).attr('hidden');
//   if (typeof attr !== typeof undefined && attr !== false) {
//     $(`#${articleID}`).attr('hidden')
//   } else {
//     $(`#${articleID}`).removeAttr('hidden')
//   }
//   // if ($(`#${articleID}`).hasAttr('hidden'))
//   // $(`#${articleID}`).toggleClass('hidden');
// }

function sizeInput(element) {
 $(element).height(0).height(element.scrollHeight)
};

