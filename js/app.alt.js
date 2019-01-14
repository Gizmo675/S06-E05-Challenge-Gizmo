var app = {
  init: function() {
    console.log('init');
    // Ecouteur sur bouton Ajouter liste
    $('#addListButton').on('click', app.displayAddListModal);

  },
  displayAddListModal: function(evt) {
    // Ajout d'une classe sur la fenêtre pour la rendre visible
    $('#addListModal').addClass('is-active');
    // Ecouteurs sur bouton de fermeture pour masquer la fenêtre modale
    $('#addListModal .close').on('click', function () {
      $('#addListModal').removeClass('is-active');
    });
  }
};

$(app.init);