package com.meoca.gamelogic;

import com.meoca.objects.gamestate.ContraGame;
import reactor.core.publisher.*;

public class GameProcessor {

    /*--------------------------------------------------
    * Game Pipeline
    *
    * --------------------------------------------------*/
    public final ContraGame game;
    private final Calculator_New calculator;
    private final UnicastProcessor<String> messageIn = UnicastProcessor.create();
    private final UnicastProcessor<String> stateUpdates = UnicastProcessor.create();
    private final UnicastProcessor<String> criticalUpdates = UnicastProcessor.create();

    //hot flux 1
    //Message In Flux
    public final Flux<String> messageInFlux;

    //hot flux 2
    //Game State Updates Flux
    public final Flux<String> gameStateFlux;

    //hot flux 3
    //Critical Updates Flux
    public final Flux<String> criticalUpdateFlux;



    /*--------------------------------------------------
    * Start Up
    *
    * --------------------------------------------------*/
    public GameProcessor(ContraGame game){

        //Set up
        //New Game & Calculator
        this.game = game;
        this.calculator = new Calculator_New(
                game,
                gsu -> postGameStateUpdate(gsu),
                cu -> postCriticalUpdate(cu));


        //Set Up
        //Fluxes in the Pipeline
        this.messageInFlux = messageIn
                .publish()
                .autoConnect();

        this.messageInFlux.subscribe(gsm -> calculator.apply(gsm));


        this.gameStateFlux = stateUpdates
                .publish()
                .autoConnect();

        //this.gameStateFlux.subscribe(System.out::println);


        this.criticalUpdateFlux = criticalUpdates
                .publish()
                .autoConnect();

        //this.criticalUpdateFlux.subscribe(System.out::println);
    }

    /*--------------------------------------------------
    * Interact
    *
    * --------------------------------------------------*/
    public void postGameStateMessage(String message){
        this.messageIn.onNext(message);
    }

    void postCriticalUpdate(String message){
        this.criticalUpdates.onNext(message);
    }
    void postGameStateUpdate(String message){
        this.stateUpdates.onNext(message);
    }
}
