package com.meoca.objects.gamestate;


import com.meoca.utils.IdGenerator;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.Value;
import lombok.experimental.NonFinal;
import reactor.util.function.Tuple3;

import java.time.LocalDateTime;

@Builder
public class ContraPlayer {

    public final Long createTimeStamp = IdGenerator.getTimestamp();

    @NonNull  public final Integer id;
    @NonNull  public final String name;
    @NonNull  public final String team;

    @NonFinal public double posX;
    @NonFinal public double posY;
    @NonFinal public int lives;
    @NonFinal public int score;
    @NonFinal public int state_lifecycle;
    @NonFinal public int state_dir;
    @NonFinal public int state_activity;
    @NonFinal public int state_aim;
}
