package com.meoca.gameservice;

import com.meoca.gamelogic.GameProcessor;
import com.meoca.objects.gamestate.ContraGame;
import com.meoca.objects.messagingin.GameStateMessage;
import com.meoca.objects.messagingin.GameJoinRequest;
import com.meoca.objects.messagingin.GameJoinResult;
import com.meoca.utils.IdGenerator;
import com.meoca.utils.Teams;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class GameService {


    /*--------------------------------------------------
    * Game Service
    *
    * --------------------------------------------------*/
    public ContraGame contraGame;
    public GameProcessor gameProcessor;

    public GameService(){
        resetGame();
    }

    public void resetGame(){

        this.contraGame = ContraGame.builder()
                .id(IdGenerator.getEntityId())
                .mapHeight(1280)
                .mapWidth(960)
                .maxPlayers(25)
                .build();


        gameProcessor = new GameProcessor(contraGame);
    }


    /*--------------------------------------------------
    * Connect
    *
    * --------------------------------------------------*/
    public ContraGame getGame(final String id){
        return gameProcessor.game;
    }

    public Flux<String> watchMessagesIn(){
        return Flux.from(gameProcessor.messageInFlux);
    }
    public Flux<String> watchState(){
        return Flux.from(gameProcessor.gameStateFlux);
    }
    public Flux<String> watchCriticalUpdates(){
        return Flux.from(gameProcessor.criticalUpdateFlux);
    }


    /*--------------------------------------------------
    * Actions
    *
    * --------------------------------------------------*/
    public void postStateMessage(final String message) {

        this.gameProcessor.postGameStateMessage(message);
    }

    public GameJoinResult joinGame(final GameJoinRequest req){

        final int playerId = IdGenerator.getEntityId();
        final String teamId = Teams.TEAM_BLUE;
        final String x = "250";
        final String y = "275";

        final String message = GameStateMessage.composeRaw(
                GameStateMessage.MSG_PLAYER_NEW,
                this.contraGame.getId(),
                playerId,
                req.playerName,
                teamId,
                x,
                y
        );
        this.postStateMessage(message);

        return GameJoinResult.builder()
                .gameId(Integer.toString(contraGame.getId()))
                .playerId(Integer.toString(playerId))
                .playerName(req.playerName)
                .team(teamId)
                .posX(x)
                .posY(y)
                .build();
    }
}
