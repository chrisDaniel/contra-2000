package com.meoca.objects.updates;

import com.meoca.utils.IdGenerator;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UpdateMessageUtils {

    /*---------------------------------------
     * Message Types / Delim
     *---------------------------------------*/
    public static final String MSGTYPE_STATE_UPDATE = "GSU";
    public static final String MSGTYPE_CRITICAL_UPDATE = "GCU";

    public static final String MESSAGE_DELIM = "~";
    public static final String INMSG_FIELD_DELIM = "|";


    /*---------------------------------------
     * Compose Message
     *---------------------------------------*/
    public static String composeMessageBundle(String msgType, String singleMessge){
        return composeMessageBundle(msgType, Stream.of(singleMessge));
    }

    public static String composeMessageBundle(String msgType, Stream messages){
        final String s =
                msgType + MESSAGE_DELIM +
                Long.toString(IdGenerator.getTimestamp()) + MESSAGE_DELIM +
                messages.collect(Collectors.joining(MESSAGE_DELIM));
        return s;
    }

    public static String composeMessagePart(String key, Object...messagefields){
        final String s =
                key + INMSG_FIELD_DELIM +
                Stream.of(messagefields).map(Object::toString).collect(Collectors.joining(INMSG_FIELD_DELIM));

        return s;
    }
}
