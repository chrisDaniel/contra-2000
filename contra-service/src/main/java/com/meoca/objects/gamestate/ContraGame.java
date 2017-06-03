package com.meoca.objects.gamestate;

import com.meoca.utils.IdGenerator;
import lombok.Builder;
import lombok.NonNull;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Builder
@Value
public class ContraGame {

    public final Long createTimeStamp = IdGenerator.getTimestamp();

    @NonNull public final Integer id;
    @NonNull public final Integer mapWidth;
    @NonNull public final Integer mapHeight;
    @NonNull public final Integer maxPlayers;
}
