# S06-E05-Challenge-Gizmo

# Ajout d'une liste

On a déjà fait en sorte d'intercepter le formulaire d'ajout d'une liste :muscle:

On veut désormais envoyer une requête Ajax demandant à notre partie backend d'ajouter la liste dans la base données. Oui, rien que ça :wink:

## Ajax :lipstick:

- sur le dépôt **Frontend**
- intercepter le formulaire d'ajout de liste (si ce n'est pas déjà fait)
- récupérer la valeur de l'input du formulaire (si ce n'est pas déjà fait)
- faire une requête Ajax sur le **endpoint** prévu pour l'ajout d'une liste
    - on a rédigé la doc à la première journée
    - l'URL du **endpoint** est sur `http://api.okanban.local` si configuré (à priori non :p), sinon sur une URL du type `http://localhost/.../s06e01-backend/`
    - envoyer les données nécessaires
    - pour l'instant le **endpoint** ne fonctionne pas
- en cas de succès de la requête Ajax, ajouter la liste dans le DOM

## Backend :muscle:

- sur le dépôt **Backend**
- on veut que ce code JSON soit désormais généré au sein de notre API
- on doit coder le **endpoint** qui s'occupe de la création de liste
- tout a été prévu dans la documentation rédigée à la première journée de cette saison
- => le **endpoint** est `/lists/add`
- si la route n'est pas encore écrite dans le repo _Backend_, il faut l'ajouter
- la méthode du _Controller_ devra :
    - récupérer le nom de la liste (on donnera un ordre élevé par défaut)
    - utiliser nos _Model_ afin d'ajouter une nouvelle liste
    - puis afficher en JSON les données sur la liste ajoutée (encoder l'objet est suffisant mais peut entrainer des erreurs => voir plus bas)
- pour l'affichage et l'encodage en JSON, on va se créer une petite méthode `showJson` dans _CoreController_ afin qu'elle puisse profiter à tous les _Controllers_

<details><summary>Méthode showJson($data)</summary>

```php

// A ajouter dans la classe CoreController

protected function showJson($data)
{
    // Autorise l'accès à la ressource depuis n'importe quel autre domaine
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    // Dit au navigateur que la réponse est au format JSON
    header('Content-Type: application/json');
    // La réponse en JSON est affichée
    echo json_encode($data);
}
```

</details>

### Erreur : Le JSON généré est vide

- **C'est normal**, c'est parce que nos propriétés ne sont pas `public` :sob:
- il faut suivre les instructions suivantes pour résoudre le problème (ou bien passer toutes les propriétés en `public`)
    - dans le _CoreModel_, ajouter le code suivant `implements \JsonSerializable`
    - on obtient ainsi `abstract class CoreModel implements \JsonSerializable {`
    - ensuite, dans chaque _Model_ enfant, déclarer une méthode `jsonSerialize()` retournant le tableau qu'on souhaite convertir en JSON
    - la fonction `json_encode` va automatiquement récupérer le retour de cette méthode comme base à convertir en JSON
    - on peut s'aider du code donné ci-dessous pour un _Model_ puis essayer de le faire seul pour les autres

<details><summary>jsonSerialize() pour LabelModel</summary>

```php

namespace oFramework\Models;

class LabelModel extends CoreModel {
    /** @var string */
    private $name;

    // ...

    public function jsonSerialize() {
        // Ce tableau retournée sera convertit en JSON par la fonction json_encode
        // lorsque que j'appelle : json_encode($labelModel);
        // où $labelModel est un objet de la classe LabelModel
        return [
            'id' => $this->id,
            'name' => $this->name,
            // je choisis de ne pas y placer created_at et updated_at
        ];
    }
}
```

</details>

<details><summary>jsonSerialize() pour CardModel</summary>

```php

namespace oFramework\Models;

class CardModel extends CoreModel {
    /** @var string */
    private $title;
    /** @var int */
    private $list_order;
    /** @var int */
    private $list_id;

    // ...

    public function jsonSerialize() {
        // Ce tableau retournée sera convertit en JSON par la fonction json_encode
        // lorsque que j'appelle : json_encode($cardModel);
        // où $cardModel est un objet de la classe CardModel
        return [
            'id' => $this->id,
            'title' => $this->title,
            'list_order' => $this->list_order,
            'list_id' => $this->list_id,
            // je choisis de ne pas y placer created_at et updated_at
        ];
    }
}
```

</details>

<details><summary>jsonSerialize() pour ListModel</summary>

```php

namespace oFramework\Models;

class ListModel extends CoreModel {
    /** @var string */
    private $name;
    /** @var int */
    private $page_order;

    // ...

    public function jsonSerialize() {
        // Ce tableau retournée sera convertit en JSON par la fonction json_encode
        // lorsque que j'appelle : json_encode($listModel);
        // où $listModel est un objet de la classe ListModel
        return [
            'id' => $this->id,
            'name' => $this->name,
            'page_order' => $this->page_order,
            // je choisis de ne pas y placer created_at et updated_at
        ];
    }
}
```

</details>

## Ajax, le retour

- sur le dépôt **Frontend** (quelque part sur une URL du genre `http://localhost/.../s06e03-front-end/`)
- maintenant que le **endpoint** a été mis en place, on peut tester si l'ajout d'une liste fonctionne bien (bon message côté front et liste bien ajoutée dans la table `list`)
- si ce n'est pas le cas, ajouter des `console.log()` régulièrement

## BONUS - Endpoints

- sur le dépôt **Backend**
- mettre en place les **endpoints** suivants :
    - `/lists`
    - `/lists/[id]/cards`
    - `/lists/[id]/update`
