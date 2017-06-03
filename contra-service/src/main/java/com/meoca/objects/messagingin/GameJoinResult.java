package com.meoca.objects.messagingin;

import lombok.Builder;
import lombok.NonNull;
import lombok.ToString;
import lombok.Value;

@Builder
@Value
@ToString
public class GameJoinResult {

    @NonNull public final String gameId;
    @NonNull public final String playerId;
    @NonNull public final String playerName;
    @NonNull public final String team;
    @NonNull public final String posX;
    @NonNull public final String posY;
}
