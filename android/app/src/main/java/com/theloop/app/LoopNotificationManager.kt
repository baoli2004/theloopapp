package com.theloop.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

object LoopNotificationManager {

    private const val CHANNEL_ID = "loop_focus_channel"
    private const val CHANNEL_NAME = "Focus Sessions"

    fun createChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            )
            channel.description = "Focus session and usage limit notifications"
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    fun notifyFocusComplete(context: Context, durationMin: Int) {
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Focus Session Complete")
            .setContentText("Your $durationMin minute focus session has finished. Great work!")
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()
        nm.notify(1001, notification)
    }

    fun notifyUsageLimit(context: Context, appName: String, limitMin: Int) {
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("Usage Limit Reached")
            .setContentText("You've reached your ${limitMin}m limit for $appName. Consider taking a break.")
            .setAutoCancel(true)
            .build()
        nm.notify(1002, notification)
    }
}
