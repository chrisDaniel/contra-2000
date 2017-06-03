package com.meoca.objects.updates;

import com.meoca.objects.gamestate.ContraPlayer;

import java.util.stream.Stream;

public class GameStateUpdate {

    /*---------------------------------------
    * Keys
    *
    *---------------------------------------*/
    public static final String KEY_PLAYER_UPD = "KP";



    /*---------------------------------------
    * player update
    * message = "KP|PID|TID|POSX|POSY|LIVES|SCORE|state.lc|state.dir|state.activity|state.aim"
    * -----------------------------------------*/
    public static final String playerUpdateMessage(ContraPlayer cp) {

        return UpdateMessageUtils.composeMessagePart(KEY_PLAYER_UPD,
                cp.id,
                cp.team,
                cp.posX,
                cp.posY,
                cp.lives,
                cp.score,
                cp.state_lifecycle,
                cp.state_dir,
                cp.state_activity,
                cp.state_aim);
    }

    /*---------------------------------------
     * Compose Helpers
     *
     *---------------------------------------*/
    public static final String composeMessageBundle(final Stream<String> messages){

        return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_STATE_UPDATE, messages);
    }
    public static final String composeNoUpdate(){

        return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_STATE_UPDATE, "NO-UPDATE");
    }
}
