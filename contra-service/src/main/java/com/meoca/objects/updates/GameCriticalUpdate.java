package com.meoca.objects.updates;

public final class GameCriticalUpdate {

    /*---------------------------------------
     * Keys
     *
     * ---------------------------------------*/
    public static final String KEY_NEW_PLAYER = "KNP";
    public static final String KEY_PLAYER_KILL = "KPK";
    public static final String KEY_PLAYER_REM = "KPR";
    public static final String KEY_BULLET_NEW = "KBN";

    /*---------------------------------------
    * player new
    *
    * message = "KNP|TS|PID|TID|"
    * -----------------------------------------*/
    public static PlayerNewBuilder PlayerNew(){
        return new PlayerNewBuilder();
    }

    public static final class PlayerNewBuilder{

        final Object[] u = new Object[2];

        private PlayerNewBuilder(){};

        public PlayerNewBuilder playerId(Integer pid)    {   u[0] = pid; return this;    }
        public PlayerNewBuilder teamId(String tid)       {   u[1] = tid; return this;    }

        public final String compose(){
            final String msg = UpdateMessageUtils.composeMessagePart(KEY_NEW_PLAYER, u);
            return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_CRITICAL_UPDATE, msg);
        }
    }

    /*---------------------------------------
    * player killed
    *
    * message = "KPR|PID|BID|SHOOTER-ID"
    * -----------------------------------------*/
    public final static PlayerKilledBuilder Player_Killed(){
        return new PlayerKilledBuilder();
    }

    public static final class PlayerKilledBuilder{

        final Object[] u = new Object[3];

        private PlayerKilledBuilder(){};

        public PlayerKilledBuilder playerId(Integer pid)    {   u[0] = pid; return this;    }
        public PlayerKilledBuilder bulletId(Integer bid)    {   u[1] = bid; return this;    }
        public PlayerKilledBuilder shooterId(Integer sid)   {   u[2] = sid; return this;    }


        public final String compose(){
            final String msg = UpdateMessageUtils.composeMessagePart(KEY_PLAYER_KILL, u);
            return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_CRITICAL_UPDATE, msg);
        }
    }


    /*---------------------------------------
    * player removed
    *
    * message = "KPR|PID"
    * -----------------------------------------*/
    public final static PlayerRemoveBuilder PlayerRemove(){
        return new PlayerRemoveBuilder();
    }

    public static final class PlayerRemoveBuilder{

        final Object[] u = new Object[1];

        private PlayerRemoveBuilder(){};

        public PlayerRemoveBuilder playerId(Integer pid)    {   u[0] = pid; return this;    }

        public final String compose(){
            final String msg = UpdateMessageUtils.composeMessagePart(KEY_PLAYER_REM, u);
            return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_CRITICAL_UPDATE, msg);
        }
    }
    
    /*---------------------------------------
    * bullet fired
    *
    * message = "NBF|BID|PID|TID|POSX|POSY|DIRX|DIRY"
    * -----------------------------------------*/
    public final static BulletFiredBuilder BulletFired(){
        return new BulletFiredBuilder();
    }

    public static final class BulletFiredBuilder{

        final Object[] u = new Object[7];

        private BulletFiredBuilder(){};

        public BulletFiredBuilder bulletId(int id)      {   u[0] = id; return this;    }
        public BulletFiredBuilder playerId(int s)       {   u[1] = s; return this;    }
        public BulletFiredBuilder teamId(String s)      {   u[2] = s; return this;    }
        public BulletFiredBuilder posX(String s)        {   u[3] = s; return this;    }
        public BulletFiredBuilder posY(String s)        {   u[4] = s; return this;    }
        public BulletFiredBuilder dirX(String s)        {   u[5] = s; return this;    }
        public BulletFiredBuilder dirY(String s)        {   u[6] = s; return this;    }

        public final String compose(){
            final String msg = UpdateMessageUtils.composeMessagePart(KEY_BULLET_NEW, u);
            return UpdateMessageUtils.composeMessageBundle(UpdateMessageUtils.MSGTYPE_CRITICAL_UPDATE, msg);
        }
    }
}
