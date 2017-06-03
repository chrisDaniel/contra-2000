package com.meoca.utils;

import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Utils {

    final static String doublePattern = "(\\d*)(\\.\\d\\d)(\\d+)";

    /*---------------------------------------
    * Safe Extraction
    * of Messages with default values
    * -----------------------------------------*/
    public static String msg_extractString(final String[] msgFields, final int fieldNumber){

        try{
            return msgFields[fieldNumber];
        }
        catch(Exception e){
            throw new RuntimeException("Bad Value " + fieldNumber + " : " + printMsgArray(msgFields));
        }
    }
    public static int msg_extractInt(final String[] msgFields, final int fieldNumber){

        try{
            return Integer.valueOf(msgFields[fieldNumber]);
        }
        catch(Exception e){
            throw new RuntimeException("Bad Value " + fieldNumber + " : " + printMsgArray(msgFields));
        }
    }
    public static double msg_extractDouble(final String[] msgFields, final int fieldNumber){

        try{
            String field = msgFields[fieldNumber];

            if(field.matches(doublePattern)){
                field = field.replaceAll(doublePattern, "$1$2");
            }
            return Double.valueOf(field);
        }
        catch(Exception e){
            throw new RuntimeException("Bad Value " + fieldNumber + " : " + printMsgArray(msgFields));
        }
    }
    private static String printMsgArray(final String[] msgFields){
        if(msgFields == null){
            return "[]";
        }
        String s = "[ ";
        s += Arrays.asList(msgFields).stream().collect(Collectors.joining(", "));
        s += " ]";
        return s;
    }
}
