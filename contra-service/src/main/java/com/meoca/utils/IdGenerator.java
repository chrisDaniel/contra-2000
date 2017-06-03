package com.meoca.utils;


import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.concurrent.atomic.AtomicInteger;

public class IdGenerator {

    private static final AtomicInteger seq = new AtomicInteger();

    public static Integer getEntityId(){
        return seq.incrementAndGet();
    }
    public static long getTimestamp(){
        Instant i = Instant.now();
        return i.toEpochMilli();
    }
}
