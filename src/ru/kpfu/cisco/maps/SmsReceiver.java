package ru.kpfu.cisco.maps;

import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.widget.Toast;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SmsReceiver extends BroadcastReceiver {
    // All available column names in SMS table
    // [_id, thread_id, address,
    // person, date, protocol, read,
    // status, type, reply_path_present,
    // subject, body, service_center,
    // locked, error_code, seen]

    public static final String SMS_EXTRA_NAME = "pdus";
    public static final String SMS_URI = "content://sms";

    public static final String ADDRESS = "address";
    public static final String PERSON = "person";
    public static final String DATE = "date";
    public static final String READ = "read";
    public static final String STATUS = "status";
    public static final String TYPE = "type";
    public static final String BODY = "body";
    public static final String SEEN = "seen";

    public static final int MESSAGE_TYPE_INBOX = 1;
    public static final int MESSAGE_TYPE_SENT = 2;

    public static final int MESSAGE_IS_NOT_READ = 0;
    public static final int MESSAGE_IS_READ = 1;

    public static final int MESSAGE_IS_NOT_SEEN = 0;
    public static final int MESSAGE_IS_SEEN = 1;

    // Change the password here or give a user possibility to change it
    public static final byte[] PASSWORD = new byte[]{0x20, 0x32, 0x34, 0x47, (byte) 0x84, 0x33, 0x58};

    public void onReceive(Context context, Intent intent) {
        Bundle extras = intent.getExtras();
        String messages = "";
        if (extras != null) {
            Object[] smsExtra = (Object[]) extras.get(SMS_EXTRA_NAME);
            ContentResolver contentResolver = context.getContentResolver();
            SmsMessage sms  = null;
            for (int i = 0; i < smsExtra.length; ++i) {
                sms = SmsMessage.createFromPdu((byte[]) smsExtra[i]);

                String body = sms.getMessageBody().toString();
                String address = sms.getOriginatingAddress();


                //messages += "SMS from " + address + " :\n";
                //messages += body + "\n";
                messages = body;

            }
            if (checkMessage(sms)){
                MyActivity.newSms = true;
                MyActivity.smsText = messages;
                abortBroadcast();
            }
            //Toast.makeText(context, messages, Toast.LENGTH_SHORT).show();

            //    contentResolver.delete(Uri.parse("content://sms/"));
        }

    }

    private boolean checkMessage(SmsMessage sms){
        Pattern pattern = Pattern.compile("[0-3]");
        Matcher matcher = pattern.matcher(sms.getMessageBody());
        if(matcher.matches()){
 //           MyActivity.makeStaticToast(sms.getDisplayOriginatingAddress(), true);
            if(sms.getDisplayOriginatingAddress().equals("5559")){
                return true;
            }
            else{
                return false;
            }
        }
        return  false;
    }
}