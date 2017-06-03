package com.meoca.utils;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Teams {

    public static final String TEAM_BLUE    = "B";
    public static final String TEAM_RED     = "W";
    public static final String TEAM_YELLOW  = "Y";
    public static final String TEAM_ORANGE  = "O";

    public static final Set<String> Teams;

    static{
        Teams = Stream
                .of(TEAM_BLUE, TEAM_ORANGE, TEAM_YELLOW, TEAM_RED)
                .collect(Collectors.toSet());
    }
}
