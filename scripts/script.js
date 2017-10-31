


$(document).ready(displayTen);

$('#search-input').keyup(searchCards);

// $('#body-input').keyup(sizeInput(this));

// $('#none').on('click', levelImportance);

// $('#low').on('click', levelImportance);

// $('#normal').on('click', levelImportance);

// $('#high').on('click', levelImportance);

// $('#critical').on('click', levelImportance);

$('.display-more').on('click', displayMore);

$('.button-save').on('click', instantiateNewObject);

$('#cards-container').on('click', '.idea-card .card-delete-button', deleteCard);

$('#cards-container').on('click', '.idea-card .upvote-button', setQuality.bind(this ,'upvote'));
//   setQuality(this, 'upvote') 
// });

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

$('.show-completed').on('click', showCompleted);

$('.show-completed').on('click', toggleCompletedAppearance);

function addToStorage(object) {
  localStorage.setItem(object.cardKey, JSON.stringify(object));
};

function hideCard(card) {
  thisKey = $(card).closest('.idea-card').attr('id');
  card.closest('.idea-card').remove();
}

function deleteCard() {
  thisKey = $(this).closest('.idea-card').attr('id');
  this.closest('.idea-card').remove();
  localStorage.removeItem(thisKey);
};

function displayStorage() {
  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if ($thisCard.completed === false) {
        prependObject($thisCard);
        // localStorage.setItem(localStorage.key(i), JSON.stringify($thisCard.completed))
        // showCompleted($thisCard, boolean);
      // hideCard($thisCard.cardKey);
    } 
      // toggleCompletionClass($thisCard.cardKey)
  };
};

function showCompleted() {
  for (i=0; i < localStorage.length; i++){
    var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if ($thisCard.completed === true) {
      prependObject($thisCard);
      toggleCompletionClass($thisCard.cardKey)
    }
  }
    // $thisCard.shown = boolean === false;
};

function toggleCompletedAppearance() {
  $('.show-completed').slideToggle(800);
};

function displayTen() {
  if (localStorage.length <= 10) {
    displayStorage();
  } 
  else {
    var storageLength = localStorage.length;
    for (i=storageLength - 10; i < storageLength; i++) {
      var $thisCard = JSON.parse(localStorage.getItem(localStorage.key(i)));
      prependObject($thisCard); 
    };
  };
};

function displayMore() {
  $('.cards-container').html('');
  displayStorage();
  //If we don't call showCompleted the buttons reveal things in a really strange way
  //but if we do it toggles the class weird
  showCompleted();
  $('.display-more').slideToggle(800);
};

function IdeaObject(cardKey, title, body, quality) {
  this.cardKey = cardKey;
  this.title = title;
  this.body = body;
  this.quality = quality;
  this.voteCounter = 2;
  this.completed = false;
  this.shown = false;
};

function instantiateNewObject(e) {
  e.preventDefault();
  var $titleInput = $('#title-input');
  var $bodyInput = $('#body-input');
  var newObject = new IdeaObject(Date.now(), $titleInput.val(), $bodyInput.val(), 'normal') 
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
          <button class="complete-btn">Completed</button>
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
  };
};

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

function setQuality(upvote) {
  var thisKey = $(this).closest('.idea-card').attr('id');
  var $thisObject = JSON.parse(localStorage.getItem(thisKey));
  if (this === upvote && $thisObject.voteCounter < 4) {
    $thisObject.voteCounter++;
  } else if (vote === 'downvote' && $thisObject.voteCounter > 0) {
    $thisObject.voteCounter--;
  };
  
  saveQuality($thisObject, thisKey);
};

function saveQuality($thisObject, thisKey) {
  var ratingArray = ['none', 'low', 'normal', 'high', 'critical'];
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
  // $(`#${articleID}`).toggleClass('grayout-card');
  $(`#${articleID}`).find('.complete-btn').toggleClass('completed-task');
  // $(`#${articleID}`).find('.complete-btn').toggleClass('grayout-btn');
};

// function levelImportance() {

// }





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

// function sizeInput(element) {
//  $(element).height(0).height(element.scrollHeight)
// };

