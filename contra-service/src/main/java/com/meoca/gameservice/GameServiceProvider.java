package com.meoca.gameservice;

import org.springframework.stereotype.Component;

@Component
public class GameServiceProvider {

    private static GameService service;
    public static GameService getService(){
        return service;
    }

    public GameServiceProvider(GameService gs){
        service = gs;
    }
}
