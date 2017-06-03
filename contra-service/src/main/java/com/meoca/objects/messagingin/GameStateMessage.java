package com.meoca.objects.messagingin;

public final class GameStateMessage {
    /*---------------------------------------
    * Keys
    *
    *---------------------------------------*/
    public static final String MSG_PLAYER_NEW = "PN";
    public static final String MSG_PLAYER_UPD = "PU";
    public static final String MSG_BULLET_NEW = "BN";
    public static final String MSG_PLAYER_HIT = "PH";

    /*---------------------------------------
    * messages
    *
    * admin - new game
    * message = "ADMIN.NEW|GID"
    *
    * player new message
    * message = "PN|GID|PID|PN|TID|POSX|POSY|DIR|AIM|MOT";
    *
    * player update message
    * message =  PU|GID|PID|PN|POSX|POSY|state.lc|state.dir|state.activity|state.aim
    *
    * player/bullet hit message
    * message = "PH|GID|PID|BID|POSX|POSY"
    *
    * bullet new message
    * message = "BN|GID|PID|TID|POSX|POSY|DIRX|DIRY"
    *
    * -----------------------------------------*/
    public static String extractType(String message){
        String[] segments = message.split("\\|");
        return segments[0];
    }
    public static String[] extractVals(String message){
        String[] segments = message.split("\\|");
        return segments;
    }


    /*---------------------------------------
    * Compose Helpers
    *
    *---------------------------------------*/
    public static String composeRaw(String MSG_TYPE, Object... values){

        String _message = MSG_TYPE;

        for(Object v : values){
            _message += "|" + v.toString();
        }
        return _message;
    }

}
