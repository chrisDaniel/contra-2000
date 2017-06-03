package com.meoca.services;

import com.meoca.gameservice.GameService;
import com.meoca.gameservice.GameServiceProvider;
import com.meoca.objects.updates.GameStateUpdate;
import com.meoca.utils.IdGenerator;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.List;

public class GameSockets implements WebSocketHandler {

    final static DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();

    @Override
    public Mono<Void> handle(WebSocketSession session) {

        session.receive().subscribe(GameSockets::processInput);

        return session.send(
                GameServiceProvider.getService().watchState()
                    .map(GameSockets::prepareGameStateResponse));
    }

    private static void processInput(final WebSocketMessage message){
        try {
            String msg = message.getPayloadAsText();
            GameServiceProvider.getService().postStateMessage(msg);
        }catch (Exception e){
            //System.out.println(e.getStackTrace());
        }
    }
    private static WebSocketMessage prepareGameStateResponse(String gsr){ //} final List<String> gsrList){

        byte[] bytes;

        if(gsr == null || gsr.length() == 0){
            bytes = GameStateUpdate.composeNoUpdate().getBytes();
        }
        else{
            final String update = gsr;
            bytes = update.getBytes();
        }
        final DataBuffer buffer = dataBufferFactory.wrap(bytes);
        return new WebSocketMessage(WebSocketMessage.Type.TEXT, buffer);
    }
}
