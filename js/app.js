/**
 * Etapes pour afficher les listes et les cartes dynamiquement
 * On doit récupérer les listes (en dur ou AJAX)
 * On boucle sur ces listes
 * - on utilise addListHtml() pour afficher chaque liste
 */

var app = {
  /**
   * Initialisation de l'application et notamment des event listeners
   */
  init: function() {
    console.log('init');

    // On efface le contenu de #lists
    // $('#lists').empty();

    // Ajouter le bouton d'ajout d'une liste
    app.displayAddListButton();

    // Chargement des listes
    app.addListsFromJson();

    // Chargement des cartes
    app.addCardsFromJson();

    // ajout de la gestion de l'event click sur le bouton d'ajout de liste
    // jQuery : https://api.jquery.com/on/
    $('#addListButton').on('click', app.displayAddListModal);

    // Récupration de l'élément Modal pour ajouter une liste
    // En jQuery
    // Cibler tous les boutons .close de #addListModal
    // et ajouter un évenement au clic
    $('#addListModal .close').on('click', function(){
      $('#addListModal').removeClass('is-active');
    });

    // Afficher le form
    // Sélection enfant direct de la class column sur une div
    $('#lists').on('dblclick', 'div.column > h2', app.displayEditListForm);

    // Ecouteur sur soumission des formulaires d'édition du titre des listes
    // après ajout de la class .editListTitleForm dans le HTML (cf index.html)
    $('#lists').on('submit', '.editListTitleForm', app.submitEditListForm);

    // Ecouteur soumission formulaire ajout de liste
    $('#addListModal form').on('submit', app.submitNewListForm);
  },

  /**
   * Ajout des listes depuis lists.js
   */
  addListsFromJson: function() {
    // On parcours les listes
    // cf : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/forEach
    /*lists.forEach(function(list) {
      app.addListHtml(list);
    });*/
    $.ajax({
      // URL sur laquelle faire l'appel Ajax
      url: 'http://localhost/S06/E01/s06e01-backend-blue/public/lists',
      method: 'POST', // La méthode HTTP pour l'appel Ajax (GET ou POST)
      dataType: 'json', // Le type de données attendu en réponse
      data: {
        title: Name,
            }
          }).done(function (response) { // en cas de succès de la requête
            console.log(response); // debug
            // La réponse, dans ce cas, est un JSON contenant le titre de la liste
            // On envoie donc cet objet pour être traité par une fonction
            // ...celle qui se charge de créer et d'afficher la liste
            app.addListHtml(response);
          }).fail(function () { // en cas d'échec de la requête
            alert('Erreur de retour serveur');
          });
  },
  

  /**
   * Ajout des cartes depuis cards.js
   */
  addCardsFromJson: function() {
    // On parcours les cartes
    // cf : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/forEach
    cards.forEach(function(card) {
      app.addCardHtml(card);
    });
  },

  addCardHtml: function(card) {
    // Technique alternative : on va chercher le template contenu dans le HTML
    var cardTemplate = $('#card-template').html();
    // On remplace le placeholder (la variable) {{name}} par le contenu de la carte
    var cardHtml = cardTemplate.replace('{{name}}', card.name);
    // On affiche la carte dans la liste associé à l'id de list contenu dans la carte
    $('div[data-id="' + card.list + '"] .panel-block').append(cardHtml);
  },
  
  /**
   * Articule l'ajout d'une nouvelle liste
   */
  submitNewListForm: function(evt) {
    // désactiver le fonctionnement par défaut
    evt.preventDefault();
    // récupérer la valeur dans l'input du formulaire
    var $form = $(this); // this = evt.target
    var listName = $form.find('input[name="list-name"]').val();
    
    // On appelle la fonction listAddJson avec le nom de la liste
    app.listAddJson(listName);
    // Fermeture modale
    $('#addListModal').removeClass('is-active');
  },

  listAddJson: function (listName) 
  {
    $.ajax({
      // URL sur laquelle faire l'appel Ajax
      url: 'http://localhost/S06/E01/s06e01-backend-blue/public/lists/add',
      method: 'POST', // La méthode HTTP pour l'appel Ajax (GET ou POST)
      dataType: 'json', // Le type de données attendu en réponse
      data: {
        title: listName,
      }
    }).done(function (response) { // en cas de succès de la requête
      console.log(response); // debug
      // La réponse, dans ce cas, est un JSON contenant le titre de la liste
      // On envoie donc cet objet pour être traité par une fonction
      // ...celle qui se charge de créer et d'afficher la liste
      app.addListHtml(response);
    }).fail(function () { // en cas d'échec de la requête
      alert('Erreur de retour serveur');
    });
  },

  /*
  listJson: function ()
  {
    $.ajax(
      {
        // URL sur laquelle faire l'appel Ajax
        url: 'http://localhost/S06/E01/s06e01-backend-blue/public/lists',
        method: 'POST', // La méthode HTTP pour l'appel Ajax (GET ou POST)
        dataType: 'json', // Le type de données attendu en réponse
        data: {
          title: listName,
              }
      }
      ).done(function (response) { // en cas de succès de la requête
        console.log(response); // debug
        // La réponse, dans ce cas, est un JSON contenant le titre de la liste
        // On envoie donc cet objet pour être traité par une fonction
        // ...celle qui se charge de créer et d'afficher la liste
        app.addListHtml(response);
      }).fail(function () { // en cas d'échec de la requête
        alert('Erreur de retour serveur');
      });
  },
*/

  /**
   * Crée un élement HTML de liste vide et l'ajoute au DOM
   * et ferme la fenêtre modale
   */
  addListHtml: function(listJson) {
    // appeler la méthode app.generateListElement (à créer à l'étape suivante) en donnant la valeur récupérée (de l'input) en argument
    // récupérer le retour de la méthode dans une variable
    var htmlList = app.generateListElement(listJson);
    // Afficher la liste avant la dernière colonne
    // Le sélecteur CSS "même complexe" est compris par jQuery
    $('#lists > .column:last-child').before(htmlList);
  },

  /**
   * Génère le html d'une liste vide et le retourne
   */
  generateListElement: function (list) {
    // Création de l'élément et stockage dans une variable
    // $listElement => $ car c'est un élément jQuery
    $listElement = $('<div>'); // <div></div>
    // On ajoute les classes sur l'élément, et on enchaine les méthodes => "chaînage"
    $listElement.addClass('column').addClass('is-one-quarter').addClass('panel');
    // On ajoute un data-id à cette liste
    // cf : https://developer.mozilla.org/fr/docs/Web/HTML/Attributs_universels/data-*
    // cf : https://api.jquery.com/data/#data-key-value
    $listElement.attr('data-id', list.id); // cela va créer une attribut data-id="3"

    // Trop de balise, on va gagner du temps à passer par le code HTML qui permet aussi de générer des éléments
    // il faut mettre un \ à la fin de chaque ligne de la chaine de caractères
    var headingHTML = "<div class=\"columns\"> \
        <div class=\"column\"> \
            <h2 class=\"has-text-white\">" + list.title + "</h2> \
            \
            <form action=\"\" method=\"POST\" class=\"is-hidden editListTitleForm \"> \
                <input type=\"hidden\" name=\"list-id\" value=\"1\"> \
                <div class=\"field has-addons\"> \
                    <div class=\"control\"> \
                        <input type=\"text\" class=\"input is-small\" name=\"list-name\" value=\"\" placeholder=\"Nom de la liste\"> \
                    </div> \
                    <div class=\"control\"> \
                        <button class=\"button is-small is-success\">Valider</button> \
                    </div> \
                </div> \
            </form> \
        </div> \
        \
        <div class=\"column is-narrow\"> \
            <a href=\"#\" class=\"is-pulled-right\"> \
                <span class=\"icon is-small has-text-white\"> \
                    <i class=\"fas fa-plus\"></i> \
                </span> \
            </a> \
        </div> \
    </div>";

    // On ajoute les divs à l'intérieur avant d'ajouter au DOM, sans variable cette fois
    // <div class="panel-heading has-background-info">
    $('<div>').addClass('panel-heading').addClass('has-background-info').html(headingHTML).appendTo($listElement);

    // On ajoute la div contenant les cards
    // <div class="panel-block is-block has-background-light">
    $('<div>').addClass('panel-block').addClass('is-block').addClass('has-background-light').appendTo($listElement);

    // On retourne l'élément list, qui n'est pas encore dans le DOM
    return $listElement;
  },

  /**
   * Soumission formulaire edition nom d'une liste
   */
  submitEditListForm: function(evt) {
    // Désactiver la soumission du formulaire
    evt.preventDefault();
    // Travaillons avec this = evt.target
    console.log(this);
    // On souhaite manipuler le form en jQuery
    var $form = $(this);
    // récupérer la valeur de l'input du formulaire
    var $input = $form.find('input[name="list-name"]');
    // Alternative : $input = $('input[name="list-name"]', $(this));
    // modifier le nom de la liste( < h2 > )
    var $h2element = $form.prev();
    $h2element.text($input.val());
    // cacher le formulaire
    $form.addClass('is-hidden');
    // réafficher le nom de la liste
    $h2element.removeClass('is-hidden');
  },

  /**
   * Affiche le formulaire d'édition d'une liste existante
   */
  displayEditListForm: function(evt) {
    // console.log(evt); // Evenement
    // console.log(this); // ici, this = evt.target
    // console.log(evt.target); // Le tout en DOM
    // Ajouter $ is besoin de manipulation jQuery
    
    // Cible (target) de notre événement (ici h2)
    var $h2element = $(evt.target); // Le H2 manipulable en jQuery
    // $(evt.target) équivaut à $(this)
    console.log($h2element);
    // On masque l'élément H2
    $h2element.addClass('is-hidden');
    // On récupère le texte du H2
    var h2value = $h2element.text();
    // On veut atteindre le formulaire à côté => https://api.jquery.com/next/
    var $form = $h2element.next();
    // On affiche le form en supprimant la classe Bulma .is-hidden
    $form.removeClass('is-hidden');
    // On sélectionne l'input du form concerné
    var $input = $form.find('input[name="list-name"]');
    // On colle la valeur du h2 dans l'input pour édition
    $input.val(h2value);
  },

  /**
   * Affiche la fenêtre modale
   */
  displayAddListModal: function(evt) {
    // Récupération de l'élément Modal
    var modal = $('#addListModal');
    // Ajout de la classe active
    modal.addClass('is-active');
    // En plus court
    // $('#addListModal').addClass('is-active');
  },

  /**
   * Création dynamique du bouton d'ajout de liste
   */
  displayAddListButton: function () {
    // <div class="column">
    //     <button class="button is-success" id="addListButton">
    //         <span class="icon is-small">
    //             <i class="fas fa-plus"></i>
    //         </span>
    //         &nbsp; Ajouter une liste
    //     </button>
    // </div>

    // créer chaque élément (avec leurs classes) composant le bouton individuellement, et les stocker dans des variables
    var $listElement = $('<div>').addClass('column');
    var $buttonElement = $('<button>').addClass('button').addClass('is-success').attr('id', 'addListButton').html('&nbsp; Ajouter une liste');
    var $spanElement = $('<span>').addClass('icon').addClass('is-small');
    var $iElement = $('<i>').addClass('fas').addClass('fa-plus');

    // Ajouter les éléments dans les autres
    $iElement.appendTo($spanElement);
    $spanElement.prependTo($buttonElement); // prepend => pour ajouter avant le texte
    $buttonElement.appendTo($listElement);

    // On ajoute dans le DOM dans la div dont l'id est lists
    $('#lists').append($listElement);
  }
};

// Initialisation de app lorsque le HTML (le DOM) est chargé
// (sans les fichiers externes)
// document.addEventListener('DOMContentLoaded', app.init);
// jQuery : https://api.jquery.com/ready/
// $(document).ready(app.init);
// Encore plus court
$(app.init);