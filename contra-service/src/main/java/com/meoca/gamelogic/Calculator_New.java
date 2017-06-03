package com.meoca.gamelogic;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.RemovalListener;
import com.google.common.cache.RemovalNotification;
import com.meoca.objects.gamestate.Bullet;
import com.meoca.objects.gamestate.ContraGame;
import com.meoca.objects.gamestate.ContraPlayer;
import com.meoca.objects.messagingin.GameStateMessage;
import com.meoca.objects.updates.GameCriticalUpdate;
import com.meoca.objects.updates.GameStateUpdate;
import com.meoca.utils.IdGenerator;
import com.meoca.utils.Utils;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Stream;

public class Calculator_New implements RemovalListener<Integer, ContraPlayer>{


    /* ------------------------------------------------- *
     * Data Caches
     * https://github.com/google/guava/wiki/CachesExplained#interruption
     * ------------------------------------------------- */
    private final Cache<Integer, Bullet> bullets;
    private final Cache<Integer, ContraPlayer> players;

    private final ContraGame game;
    private final Consumer<String> gameUpdateConsumer;
    private final Consumer<String> criticalMessageConsumer;

    private boolean continueUpdating = true;
    private Thread gameUpdateThread;

    public Calculator_New(ContraGame game, Consumer<String> gameUpdateConsumer, Consumer<String> criticalMessageConsumer){

        this.game = game;
        this.gameUpdateConsumer = gameUpdateConsumer;
        this.criticalMessageConsumer = criticalMessageConsumer;

        players = CacheBuilder.newBuilder()
                .maximumSize(100)
                .expireAfterAccess(15000, TimeUnit.MILLISECONDS)
                .removalListener(this)
                .build();

        bullets = CacheBuilder.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(5000, TimeUnit.MILLISECONDS)
                .build();

        gameUpdateThread = new Thread(() -> apply_composeGameStateUpdate());
        gameUpdateThread.start();
    }
    public void shutDown(){
        this.continueUpdating = false;
    }

    public void apply(String message) {

        try {
            final String[] msgA = GameStateMessage.extractVals(message);
            final String msgType = Utils.msg_extractString(msgA, 0);

            switch (msgType) {

                case GameStateMessage.MSG_PLAYER_NEW:
                    apply_playerNew(msgA);
                    break;

                case GameStateMessage.MSG_PLAYER_UPD:
                    apply_playerUpdate(msgA);
                    break;

                case GameStateMessage.MSG_PLAYER_HIT:
                    apply_playerHit(msgA);
                    break;

                case GameStateMessage.MSG_BULLET_NEW:
                    apply_bulletNew(msgA);
                    break;
            }
        }
        catch (Exception e) {
            System.out.println("Calculation Error : " + e.getMessage());
            //e.printStackTrace();
        }
    }


    private void apply_composeGameStateUpdate(){

        while(continueUpdating) {

            try {
                Thread.sleep(12);
                players.cleanUp();
                bullets.cleanUp();

                final Stream<String> messageStream = players.asMap().values()
                        .stream()
                        .map(GameStateUpdate::playerUpdateMessage);

                final String gameStateMessage = GameStateUpdate.composeMessageBundle(messageStream);
                this.gameUpdateConsumer.accept(gameStateMessage);
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }
    }


    /*---------------------------------------
    * player new message
    * message = "PN|GID|PID|PN|TID|POSX|POSY";
    * -----------------------------------------*/
    private void apply_playerNew(final String[] msgs){

        final int pid = Utils.msg_extractInt(msgs, 2);
        if(pid <= 0){
            return;
        }
        final ContraPlayer cp = ContraPlayer.builder()
                .id(pid)
                .name(msgs[3])
                .team(msgs[4])
                .posX(Utils.msg_extractInt(msgs, 5))
                .posY(Utils.msg_extractInt(msgs, 6))
                .lives(3)
                .build();

        this.players.put(pid, cp);

        this.criticalMessageConsumer.accept(GameCriticalUpdate.PlayerNew()
                .playerId(cp.id)
                .teamId(cp.team).compose());
    }

    /*---------------------------------------
    * player hit message
    * message = "PH|GID|PID|BID|POSX|POSY"
    * -----------------------------------------*/
    private void apply_playerHit(final String[] msgs){

        final int pid = Utils.msg_extractInt(msgs, 2);
        final ContraPlayer cp = retrievePlayer(pid);

        final int bid = Utils.msg_extractInt(msgs, 3);
        final Bullet b = retrieveBullet(bid);

        final ContraPlayer sp = retrievePlayer(b.getPlayerId());

        cp.lives--;
        sp.score++;

        final String cm = GameCriticalUpdate.Player_Killed()
                .playerId(cp.id)
                .bulletId(bid)
                .shooterId(sp.id)
                .compose();
        this.criticalMessageConsumer.accept(cm);

        if(cp.lives < 1){
            this.players.invalidate(pid);
        }
    }

    /*---------------------------------------
    * player update message
    * message = "PU|GID|PID|POSX|POSY|state.lc|state.dir|state.activity|state.aim
    * -----------------------------------------*/
    private void apply_playerUpdate(final String[] msgs){

        int pid = Utils.msg_extractInt(msgs, 2);
        final ContraPlayer cp = retrievePlayer(pid);

        cp.posX = Utils.msg_extractDouble(msgs, 3);
        cp.posY = Utils.msg_extractDouble(msgs, 4);
        cp.state_lifecycle = Utils.msg_extractInt(msgs, 5);
        cp.state_dir = Utils.msg_extractInt(msgs, 5);
        cp.state_activity = Utils.msg_extractInt(msgs, 5);
        cp.state_aim = Utils.msg_extractInt(msgs, 5);
    }

    /*---------------------------------------
    * bullet new message
    * message = "BN|GID|PID|TID|POSX|POSY|DIRX|DIRY"
    * -----------------------------------------*/
    private void apply_bulletNew(final String[] msgs){

        final int bid = IdGenerator.getEntityId();

        final Bullet b = Bullet.builder()
                .id(bid)
                .playerId(Integer.valueOf(msgs[2]))
                .team(msgs[3])
                .fireX(Double.valueOf(msgs[4]))
                .fireY(Double.valueOf(msgs[5]))
                .dirX(Integer.valueOf(msgs[6]))
                .dirY(Integer.valueOf(msgs[7]))
                .build();

        bullets.put(bid, b);

        final String newBulletMessage = GameCriticalUpdate.BulletFired()
                .bulletId(bid)
                .playerId(b.playerId)
                .teamId(b.team)
                .posX(msgs[4])
                .posY(msgs[5])
                .dirX(msgs[6])
                .dirY(msgs[7])
                .compose();
        this.criticalMessageConsumer.accept(newBulletMessage);
    }


    /*---------------------------------------
    * Critical Updates with Caches
    * Trigger certain events
    * -----------------------------------------*/
    private ContraPlayer retrievePlayer(final Integer pid){

        return Optional
                .ofNullable(this.players.getIfPresent(pid))
                .orElseThrow(() -> new RuntimeException("Player Update Fail : playerNotFound"));
    }
    private Bullet retrieveBullet(final Integer bid){

        return Optional
                .ofNullable(this.bullets.getIfPresent(bid))
                .orElseThrow(() -> new RuntimeException("Bullet Update Fail : playerNotFound"));
    }
    @Override
    public void onRemoval(final RemovalNotification<Integer, ContraPlayer> removed){

        final String playerRemoved = GameCriticalUpdate.PlayerRemove()
                .playerId(removed.getKey())
                .compose();
        this.criticalMessageConsumer.accept(playerRemoved);
    }
}
