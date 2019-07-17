var deck, category, dificulty;
var hits = 0, tries = 0, score = 0;
var cards_flipped = [];
var matches = [];
/* ************************************************************************************ */
// Config here:
category = 'brands';  // Available: brands
dificulty = 1;  // 1 = Easy | 2 = Medium | 3 = Hard
/* ************************************************************************************ */
// Init
init();
log();

// Start Game
deal();

/* ************************************************************************************ */
//  GAME FUNCTIONS
/* ************************************************************************************ */

function action(card_id) {
  var this_card = document.getElementById('card-' + card_id);
  // console.log('CARD ID: ', card_id);
  if(this_card.checked == true) {    
    // Check if other card is flipped
    if(cards_flipped.length != 0) {
      // One is flipped, compare and lock other cards
      disableDeck([cards_flipped[0], card_id]); // Disable entire deck, except the two cards in question
      tries++;
      if(deck[cards_flipped[0]] === deck[card_id]) {
        // MATCH!, win points!, and both cards stay opened and locked
        hits++;
        matches.push(cards_flipped[0], card_id);
        enableDeck();
        calcScore();
        printScore();
        cards_flipped = [];
      } else {
        // NO MATCH!!, reset cards, close them if not match
        var last_id = cards_flipped[0];
        
        setTimeout(function() {
          document.getElementById('card-' + last_id).disabled = false;
          document.getElementById('card-' + card_id).disabled = false;

          document.getElementById('card-' + card_id).click(); // Closes card 1
          document.getElementById('card-' + last_id).click(); // Closes card 2
          enableDeck();
        }, 1500);
        
        // Minus one chance
        printScore();
        cards_flipped = [];
      }
    } else {
      // None flipped, this is the first one
      cards_flipped.push(card_id);
      document.getElementById('card-' + card_id).disabled = true;
    }
  }
  
}

function printScore() {
  var str = '<i class="fas fa-brain"></i>&nbsp;' + hits + '&nbsp;&nbsp; 💯&nbsp;' + score + '&nbsp;&nbsp; 👀&nbsp;' + tries + '&nbsp;&nbsp;🚣&nbsp;' + efficiency().toFixed(2) + '%';
  document.querySelector('.score').innerHTML = str;
}

function calcScore() {
  score += Math.ceil(((hits * efficiency()) / 10) * dificulty);
}

function enableDeck() {
  // Enable all cards except the ones that are already matched
  if(matches.length != 0) {
    deck.forEach(function(card_name, card_id) {
      if(!matches.includes(card_id)) {
        document.getElementById('card-' + card_id).disabled = false;
      } else {
        document.getElementById('card-' + card_id).disabled = true;
      }
    });
  } else {
    // Enable ALL
    deck.forEach(function(card_name, card_id) {
      document.getElementById('card-' + card_id).disabled = false;
    });
  }
}

function disableDeck(except) {
  deck.forEach(function(card_name, card_id) {
    if(!except.includes(card_id)) {
      document.getElementById('card-' + card_id).disabled = true;
    }
  });
}

function init() {
  getDeck();          // Picks the selected deck (according to category)
  initBoard();        // Prepares the main board set (according to difficulty)
}

function deal() {
  var id = 0;
  var placed_cards = '';

  deck.forEach(icon => {
    placed_cards += card(deck[id], id);
    id++;
  });
  document.querySelector('.deck').innerHTML = placed_cards;
}

function card(icon, id) {
  var suffix = category != 'brands' ? 's' : 'b';
  return '<input type="checkbox" onclick="action(' + id + ')" id="card-' + id + '"><u><i class="fa' + suffix + ' fa-' + icon + '"></i>' + icon.toUpperCase() + '</u><b></b>';
}

function initBoard() {
  // Easy = [6 x 6] | Medium = [12 x 12] | Hard = [18 x 18]
  // Board will be created according the difficulty
  // initBoard means: 
  //      Set dificulty (number of cards) for the deck. 
  //      Set shuffled random deck (from 427 FA figures)

  var set_dificulty = dificulty >= 1 || dificulty <= 3 ? dificulty : 1;
  var brains = document.getElementById('diff');

  brains.innerHTML = '<span class="brain1"><i class="fas fa-brain"></i></span><span class="brain2"><i class="fas fa-brain"></i></span><span class="brain3"><i class="fas fa-brain"></i></span>';
  if(dificulty === 1) {
    document.querySelector('.brain1').classList.remove('brain-inactive');
    document.querySelector('.brain2').classList.add('brain-inactive');
    document.querySelector('.brain3').classList.add('brain-inactive');
  } else if (dificulty === 2) {
    document.querySelector('.brain1').classList.add('brain-inactive');
    document.querySelector('.brain2').classList.remove('brain-inactive');
    document.querySelector('.brain3').classList.add('brain-inactive');
  } else if (dificulty === 3) {
    document.querySelector('.brain1').classList.add('brain-inactive');
    document.querySelector('.brain2').classList.add('brain-inactive');
    document.querySelector('.brain3').classList.remove('brain-inactive');
  }

  // Get 'x' pair of cards randomly (where x = 18 if dificulty = 1)
  var rows = 4 * set_dificulty;
  var cols = 4 * set_dificulty;
  var baraja1 = [], baraja2 = [];

  // Shuffle the deck and push the given card to the 'deck' array
  // By using the pop() method, we ensure that no selected card is repeated on the final array
  for (var x = 0; x < (rows * cols) / 2; x++) {
    deck = shuffle(deck);
    baraja1.push(deck.pop());
  }

  baraja2 = baraja1;              // Both will form the entire set of pairs
  deck = baraja1.concat(baraja2); // Final 'ordered' deck (too easy to solve, right?)

  for(var s = 0; s < 2; s++) {
    deck = shuffle(deck);       // Final tripple-shuffled deck ready for game :)
  }

  printScore();

}

function shuffle(arr) {
  var j, x, i;
  for(i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}
function efficiency() {
  return tries ? ((hits / tries) * 100) : 0;
}

function changeDificulty() {
  dificulty++;
  if(dificulty > 3) {
    dificulty = 1;
  }
  reLoad();
}

function reLoad() {
  deck = [];
  hits = 0, tries = 0, score = 0;
  cards_flipped = [];
  matches = [];

  init();
  log();
  deal();
}

function getDeck() {
  if(category === 'various') {
    // Category: 'various'
    deck = ['apple-alt','archway','atlas','atom','audio-description','baby','baby-carriage','backward','ban','band-aid','barcode','bath','bed','beer','bell','bell-slash','bicycle','biking','binoculars','biohazard','birthday-cake','bitcoin','blender','bolt','book-medical','box','boxes','brain','broadcast-tower','brush','btc','bug','burn','bus','bus-alt','calculator','campground','cannabis','capsules','cart-arrow-down','cart-plus','cash-register','cat','chess','chess-bishop','chess-board','chess-king','chess-knight','chess-pawn','chess-queen','chess-rook','circle','clinic-medical','clipboard-check','clipboard-list','closed-captioning','cloud','cloud-meatball','cloud-moon','cloud-moon-rain','cloud-rain','cloud-showers-heavy','cloud-sun','cloud-sun-rain','cocktail','coffee','compass','compress','compress-arrows-alt','concierge-bell','cookie','cookie-bite','crow','database','desktop','dice','dice-d20','dice-d6','dice-five','dice-four','dice-one','dice-six','dice-three','dice-two','divide','dna','dog','dollar-sign','dolly','dolly-flatbed','donate','door-closed','door-open','dove','download','drafting-compass','dragon','dumbbell','dumpster','dungeon','eject','equals','ethereum','ethernet','euro-sign','exclamation','exclamation-circle','exclamation-triangle','expand','expand-arrows-alt','eye','eye-dropper','eye-slash','fast-backward','fast-forward','feather','feather-alt','file-audio','file-contract','file-medical','file-prescription','file-signature','file-video','film','filter','fingerprint','fire','fire-alt','first-aid','fish','flask','forward','frog','galactic-republic','galactic-senate','gamepad','gg','gg-circle','ghost','gift','gifts','glass-cheers','glass-martini','glass-martini-alt','glass-whiskey','globe','globe-africa','globe-americas','globe-asia','globe-europe','graduation-cap','greater-than','greater-than-equal','hammer','hand-holding-heart','hand-holding-usd','hands-helping','handshake','hard-hat','hat-wizard','hdd','headphones','headset','heart','heartbeat','hiking','hippo','history','horse','horse-head','hot-tub','hotel','hryvnia','ice-cream','id-badge','id-card','id-card-alt','infinity','jedi','jedi-order','joint','journal-whills','key','keyboard','kiwi-bird','laptop','laptop-medical','leaf','less-than','less-than-equal','lira-sign','lock','lock-open','luggage-cart','magnet','map','map-marked','map-marked-alt','map-signs','mask','memory','meteor','microchip','microphone','microphone-alt','microphone-alt-slash','microphone-slash','microscope','minus','mitten','mobile','mobile-alt','money-bill','money-bill-alt','money-bill-wave','money-bill-wave-alt','money-check','money-check-alt','monument','moon','mortar-pestle','mountain','mug-hot','music','not-equal','notes-medical','old-republic','otter','paint-roller','pallet','parachute-box','passport','pause','pause-circle','paw','pencil-alt','pencil-ruler','percentage','person-booth','phone-volume','photo-video','piggy-bank','pills','plane','plane-arrival','plane-departure','play','play-circle','playstation','plug','plus','podcast','poo-storm','pound-sign','power-off','prescription','prescription-bottle','prescription-bottle-alt','print','puzzle-piece','radiation','radiation-alt','rainbow','random','receipt','redo','redo-alt','ribbon','robot','rocket','route','rss','rss-square','ruble-sign','ruler','ruler-combined','ruler-horizontal','ruler-vertical','running','rupee-sign','satellite','satellite-dish','save','school','screwdriver','sd-card','seedling','server','shapes','shekel-sign','shield-alt','shipping-fast','shoe-prints','shopping-bag','shopping-basket','shopping-cart','shuttle-van','sim-card','skating','skiing','skiing-nordic','skull-crossbones','smog','snowboarding','snowflake','snowman','socks','spa','space-shuttle','spider','square-full','square-root-alt','steam','steam-square','steam-symbol','step-backward','step-forward','stop','stop-circle','store','store-alt','stream','subscript','suitcase','suitcase-rolling','sun','superscript','swimmer','swimming-pool','sync','sync-alt','syringe','tablet','tablet-alt','tablets','taxi','temperature-high','temperature-low','tenge','thermometer','times','toilet-paper','toolbox','tools','tram','tree','truck','truck-pickup','tshirt','tv','twitch','umbrella','umbrella-beach','undo','undo-alt','unlock','unlock-alt','upload','user-astronaut','user-lock','user-secret','user-shield','user-tie','vial','vials','video','volume-down','volume-mute','volume-off','volume-up','walking','warehouse','water','wave-square','wind','wine-bottle','wine-glass','wine-glass-alt','won-sign','wrench','xbox','yen-sign','youtube'];
  } else {
    // Default category = 'brands'
    deck = ['500px', 'accessible-icon', 'accusoft', 'acquisitions-incorporated', 'adn', 'adobe', 'adversal', 'affiliatetheme', 'airbnb', 'algolia', 'alipay', 'amazon', 'amazon-pay', 'amilia', 'android', 'angellist', 'angrycreative', 'angular', 'app-store', 'app-store-ios', 'apper', 'apple', 'apple-pay', 'artstation', 'asymmetrik', 'atlassian', 'audible', 'autoprefixer', 'avianex', 'aviato', 'aws', 'bandcamp', 'battle-net', 'behance', 'behance-square', 'bimobject', 'bitbucket', 'bitcoin', 'bity', 'black-tie', 'blackberry', 'blogger', 'blogger-b', 'bluetooth', 'bluetooth-b', 'bootstrap', 'btc', 'buffer', 'buromobelexperte', 'buysellads', 'canadian-maple-leaf', 'cc-amazon-pay', 'cc-amex', 'cc-apple-pay', 'cc-diners-club', 'cc-discover', 'cc-jcb', 'cc-mastercard', 'cc-paypal', 'cc-stripe', 'cc-visa', 'centercode', 'centos', 'chrome', 'chromecast', 'cloudscale', 'cloudsmith', 'cloudversify', 'codepen', 'codiepie', 'confluence', 'connectdevelop', 'contao', 'cpanel', 'creative-commons', 'creative-commons-by', 'creative-commons-nc', 'creative-commons-nc-eu', 'creative-commons-nc-jp', 'creative-commons-nd', 'creative-commons-pd', 'creative-commons-pd-alt', 'creative-commons-remix', 'creative-commons-sa', 'creative-commons-sampling', 'creative-commons-sampling-plus', 'creative-commons-share', 'creative-commons-zero', 'critical-role', 'css3', 'css3-alt', 'cuttlefish', 'd-and-d', 'd-and-d-beyond', 'dashcube', 'delicious', 'deploydog', 'deskpro', 'dev', 'deviantart', 'dhl', 'diaspora', 'digg', 'digital-ocean', 'discord', 'discourse', 'dochub', 'docker', 'draft2digital', 'dribbble', 'dribbble-square', 'dropbox', 'drupal', 'dyalog', 'earlybirds', 'ebay', 'edge', 'elementor', 'ello', 'ember', 'empire', 'envira', 'erlang', 'ethereum', 'etsy', 'evernote', 'expeditedssl', 'facebook', 'facebook-f', 'facebook-messenger', 'facebook-square', 'fantasy-flight-games', 'fedex', 'fedora', 'figma', 'firefox', 'first-order', 'first-order-alt', 'firstdraft', 'flickr', 'flipboard', 'fly', 'font-awesome', 'font-awesome-alt', 'font-awesome-flag', 'fonticons', 'fonticons-fi', 'fort-awesome', 'fort-awesome-alt', 'forumbee', 'foursquare', 'free-code-camp', 'freebsd', 'fulcrum', 'galactic-republic', 'galactic-senate', 'get-pocket', 'gg', 'gg-circle', 'git', 'git-alt', 'git-square', 'github', 'github-alt', 'github-square', 'gitkraken', 'gitlab', 'gitter', 'glide', 'glide-g', 'gofore', 'goodreads', 'goodreads-g', 'google', 'google-drive', 'google-play', 'google-plus', 'google-plus-g', 'google-plus-square', 'google-wallet', 'gratipay', 'grav', 'gripfire', 'grunt', 'gulp', 'hacker-news', 'hacker-news-square', 'hackerrank', 'hips', 'hire-a-helper', 'hooli', 'hornbill', 'hotjar', 'houzz', 'html5', 'hubspot', 'imdb', 'instagram', 'intercom', 'internet-explorer', 'invision', 'ioxhost', 'itch-io', 'itunes', 'itunes-note', 'java', 'jedi-order', 'jenkins', 'jira', 'joget', 'joomla', 'js', 'js-square', 'jsfiddle', 'kaggle', 'keybase', 'keycdn', 'kickstarter', 'kickstarter-k', 'korvue', 'laravel', 'lastfm', 'lastfm-square', 'leanpub', 'less', 'line', 'linkedin', 'linkedin-in', 'linode', 'linux', 'lyft', 'magento', 'mailchimp', 'mandalorian', 'markdown', 'mastodon', 'maxcdn', 'medapps', 'medium', 'medium-m', 'medrt', 'meetup', 'megaport', 'mendeley', 'microsoft', 'mix', 'mixcloud', 'mizuni', 'modx', 'monero', 'napster', 'neos', 'nimblr', 'node', 'node-js', 'npm', 'ns8', 'nutritionix', 'odnoklassniki', 'odnoklassniki-square', 'old-republic', 'opencart', 'openid', 'opera', 'optin-monster', 'osi', 'page4', 'pagelines', 'palfed', 'patreon', 'paypal', 'penny-arcade', 'periscope', 'phabricator', 'phoenix-framework', 'phoenix-squadron', 'php', 'pied-piper', 'pied-piper-alt', 'pied-piper-hat', 'pied-piper-pp', 'pinterest', 'pinterest-p', 'pinterest-square', 'playstation', 'product-hunt', 'pushed', 'python', 'qq', 'quinscape', 'quora', 'r-project', 'raspberry-pi', 'ravelry', 'react', 'reacteurope', 'readme', 'rebel', 'red-river', 'reddit', 'reddit-alien', 'reddit-square', 'redhat', 'renren', 'replyd', 'researchgate', 'resolving', 'rev', 'rocketchat', 'rockrms', 'safari', 'salesforce', 'sass', 'schlix', 'scribd', 'searchengin', 'sellcast', 'sellsy', 'servicestack', 'shirtsinbulk', 'shopware', 'simplybuilt', 'sistrix', 'sith', 'sketch', 'skyatlas', 'skype', 'slack', 'slack-hash', 'slideshare', 'snapchat', 'snapchat-ghost', 'snapchat-square', 'soundcloud', 'sourcetree', 'speakap', 'speaker-deck', 'spotify', 'squarespace', 'stack-exchange', 'stack-overflow', 'stackpath', 'staylinked', 'steam', 'steam-square', 'steam-symbol', 'sticker-mule', 'strava', 'stripe', 'stripe-s', 'studiovinari', 'stumbleupon', 'stumbleupon-circle', 'superpowers', 'supple', 'suse', 'symfony', 'teamspeak', 'telegram', 'telegram-plane', 'tencent-weibo', 'the-red-yeti', 'themeco', 'themeisle', 'think-peaks', 'trade-federation', 'trello', 'tripadvisor', 'tumblr', 'tumblr-square', 'twitch', 'twitter', 'twitter-square', 'typo3', 'uber', 'ubuntu', 'uikit', 'uniregistry', 'untappd', 'ups', 'usb', 'usps', 'ussunnah', 'vaadin', 'viacoin', 'viadeo', 'viadeo-square', 'viber', 'vimeo', 'vimeo-square', 'vimeo-v', 'vine', 'vk', 'vnv', 'vuejs', 'waze', 'weebly', 'weibo', 'weixin', 'whatsapp', 'whatsapp-square', 'whmcs', 'wikipedia-w', 'windows', 'wix', 'wizards-of-the-coast', 'wolf-pack-battalion', 'wordpress', 'wordpress-simple', 'wpbeginner', 'wpexplorer', 'wpforms', 'wpressr', 'xbox', 'xing', 'xing-square', 'y-combinator', 'yahoo', 'yammer', 'yandex', 'yandex-international', 'yarn', 'yelp', 'yoast', 'youtube', 'youtube-square', 'zhihu'];
  }
}

function log() {
  console.log('deck: ', deck);
}
