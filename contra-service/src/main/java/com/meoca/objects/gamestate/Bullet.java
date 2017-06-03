package com.meoca.objects.gamestate;


import com.meoca.utils.IdGenerator;
import lombok.Builder;
import lombok.NonNull;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.time.LocalDateTime;

@Builder
@Value
public class Bullet {

    public final Long createTimeStamp = IdGenerator.getTimestamp();

    @NonNull public final Integer id;
    @NonNull public final Integer playerId;
    @NonNull public final String team;

    @NonNull public Double fireX;
    @NonNull public Double fireY;
    @NonNull public int dirX;
    @NonNull public int dirY;
}
