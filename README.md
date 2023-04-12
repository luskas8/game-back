<h1 align="center">
	Game Backendd<br/>
</h1>

## Proposta

## Tecnologias

### Arquitetura da aplicação
* <a href="https://github.com/expressjs/express" target="_blank">ExpressJS</a>

### Segurança
* <a href="https://github.com/auth0/node-jsonwebtoken" target="_blank">JSON Web Token</a>
* <a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank">Bcrypt</a>

### Testes
* <a href="https://github.com/facebook/jest" target="_blank">Jest</a>
* <a href="https://github.com/visionmedia/supertest" target="_blank">Supertest</a>
* <a href="https://github.com/simonexmachina/factory-girl" target="_blank">Factory-girl</a>
* <a href="https://github.com/Marak/faker.js" target="_blank">Faker</a>

<h2 id="deploy"> Deploy </h2>

## Modo de usar

### Consumindo Endpoints

##### GET /
Retorna uma resposta com status 200 e mensagem "ok".

<sub>Response</sub>

```json
{
  "status": 200,
  "message": "ok"
}

```

##### POST /room
Cria uma nova sala de jogo com um nome especificado. Retorna informações sobre a sala e o participante que criou a sala.

Body
| Parâmetro | Tipo   | Descrição            |
|-----------|--------|----------------------|
| room_name | string | Nome da sala de jogo |


<sub>Response</sub>

```json
{
  "message": "Room created.",
  "room": {
    "id": "room_id",
    "name": "Sala de Jogo",
    "owner": "participant_id"
  },
  "participant": {
    "id": "participant_id"
  }
}

```

##### GET /data
Retorna informações sobre todas as salas de jogo, participantes e jogos.

<sub>Response</sub>

```json
{
  "rooms": [{
    "id": "room_id",
    "name": "Sala de Jogo",
    "owner": "participant_id",
    "participants": [{
    	"id": "participant_id",
    	"socket": "socket_id",
    }]
  }],
  "participants": [{
    "id": "participant_id",
    "socket": "socket_id",
  }],
  "games": [{
    "id": "game_id",
    "roomId": "room_id",
  }],
}

```

##### GET /places
Retorna informações sobre todos os locais disponíveis para os jogadores.

<sub>Response</sub>

```json
{
  "places": [{
    "id": "place_id_1",
    "description": "Local 1"
  }, {
    "id": "place_id_2",
    "description": "Local 2"
  }]
}

```

##### GET /game/:game_id/places/:participant_id
Retorna informações sobre os lugares de um jogador em um jogo específico.

Body
| Parâmetro      | Tipo   | Descrição     |
|----------------|--------|---------------|
| game_id        | string | ID do jogo    |
| participant_id | string | ID do jogador |

<sub>Response</sub>

```json
{
  "places": [{
  	"id": "place_id_1",
	"description": "Local 1",
	"selected": false,
	"current": false
  }, {
  	"id": "place_id_2",
	"description": "Local 2",
	"selected": true,
	"current": true
  }, {
  	"id": "place_id_3",
	"description": "Local 3",
	"selected": true,
	"current": false
  }]
}

```

### Testando a aplicação

## Licença MIT
Direitos Reservados 2023 Lucas Anjos
