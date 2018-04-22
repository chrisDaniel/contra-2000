package com.meoca.services;

import com.meoca.gameservice.GameService;
import com.meoca.objects.gamestate.ContraGame;
import com.meoca.objects.messagingin.GameJoinRequest;
import com.meoca.objects.messagingin.GameJoinResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;

    @Autowired
    GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/{gameId}")
    public ContraGame getGame(String id){
        return gameService.getGame(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/reset")
    public void resetGame() {gameService.resetGame();}

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/game-join/{playerName}")
    public GameJoinResult joinGame(@PathVariable String playerName){
        GameJoinRequest gjr = new GameJoinRequest();
        gjr.setPlayerName(playerName);
        return gameService.joinGame(gjr);
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/in-messages", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> watchGameUpdateMessages() {return gameService.watchMessagesIn();}

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/game-state", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> watchGameState() {return gameService.watchState();}

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/game-events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> watchGameEvents() {return gameService.watchCriticalUpdates();}

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/sse-flow-test", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> testGameFlow() {
        return Flux.range(1, 1000).map(i -> "Send# " + Integer.toString(i)).delayElements(Duration.ofMillis(10));
    }
}
