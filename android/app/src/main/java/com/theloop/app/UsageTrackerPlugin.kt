package com.theloop.app

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Process
import android.util.Base64
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@CapacitorPlugin(name = "UsageTracker")
class UsageTrackerPlugin : Plugin() {

    private fun getUsageStatsManager(): UsageStatsManager {
        return context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    }

    @PluginMethod
    fun hasUsageAccess(call: PluginCall) {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.unsafeCheckOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.packageName
        )
        val ret = JSObject()
        ret.put("granted", mode == AppOpsManager.MODE_ALLOWED)
        call.resolve(ret)
    }

    @PluginMethod
    fun openUsageAccessSettings(call: PluginCall) {
        try {
            val intent = android.content.Intent(android.provider.Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("Unable to open usage access settings: ${e.message}")
        }
    }

    @PluginMethod
    fun getDailyUsage(call: PluginCall) {
        val dateStr = call.getString("date")
            ?: SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

        try {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = sdf.parse(dateStr) ?: Date()
            val cal = Calendar.getInstance()
            cal.time = date
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)
            val begin = cal.timeInMillis
            cal.add(Calendar.DAY_OF_MONTH, 1)
            val end = cal.timeInMillis

            val statsMap = getUsageStatsManager().queryAndAggregateUsageStats(begin, end)
            val pm = context.packageManager
            val perAppArray = JSArray()
            var totalMs = 0L

            for ((pkgName, stats) in statsMap.entries.sortedByDescending { it.value.totalTimeInForeground }) {
                if (stats.totalTimeInForeground <= 0) continue
                if (pkgName.startsWith("com.android.systemui") || pkgName == "com.android.settings") continue

                val appName = try {
                    val appInfo = pm.getApplicationInfo(pkgName, 0)
                    pm.getApplicationLabel(appInfo).toString()
                } catch (e: Exception) { pkgName }

                val entry = JSObject()
                entry.put("packageName", pkgName)
                entry.put("appName", appName)
                entry.put("totalTimeMs", stats.totalTimeInForeground)
                entry.put("lastTimeUsed", stats.lastTimeUsed)
                perAppArray.put(entry)
                totalMs += stats.totalTimeInForeground
            }

            val result = JSObject()
            result.put("date", dateStr)
            result.put("totalMs", totalMs)
            result.put("perApp", perAppArray)
            call.resolve(result)
        } catch (e: SecurityException) {
            call.reject("Usage access permission not granted")
        } catch (e: Exception) {
            call.reject("Failed to get usage stats: ${e.message}")
        }
    }

    @PluginMethod
    fun getWeeklyUsage(call: PluginCall) {
        try {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val weeklyArray = JSArray()
            val cal = Calendar.getInstance()
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)

            for (i in 6 downTo 0) {
                val dayCal = cal.clone() as Calendar
                dayCal.add(Calendar.DAY_OF_MONTH, -i)
                val begin = dayCal.timeInMillis
                dayCal.add(Calendar.DAY_OF_MONTH, 1)
                val end = dayCal.timeInMillis
                val dateStr = sdf.format(Date(begin))

                val statsMap = getUsageStatsManager().queryAndAggregateUsageStats(begin, end)
                val pm = context.packageManager
                val perAppArray = JSArray()
                var totalMs = 0L

                for ((pkgName, stats) in statsMap.entries.sortedByDescending { it.value.totalTimeInForeground }) {
                    if (stats.totalTimeInForeground <= 0) continue
                    if (pkgName.startsWith("com.android.systemui") || pkgName == "com.android.settings") continue

                    val appName = try {
                        val appInfo = pm.getApplicationInfo(pkgName, 0)
                        pm.getApplicationLabel(appInfo).toString()
                    } catch (e: Exception) { pkgName }

                    val entry = JSObject()
                    entry.put("packageName", pkgName)
                    entry.put("appName", appName)
                    entry.put("totalTimeMs", stats.totalTimeInForeground)
                    entry.put("lastTimeUsed", stats.lastTimeUsed)
                    perAppArray.put(entry)
                    totalMs += stats.totalTimeInForeground
                }

                val dayResult = JSObject()
                dayResult.put("date", dateStr)
                dayResult.put("totalMs", totalMs)
                dayResult.put("perApp", perAppArray)
                weeklyArray.put(dayResult)
            }

            val result = JSObject()
            result.put("weekly", weeklyArray)
            call.resolve(result)
        } catch (e: SecurityException) {
            call.reject("Usage access permission not granted")
        } catch (e: Exception) {
            call.reject("Failed to get weekly usage: ${e.message}")
        }
    }

    @PluginMethod
    fun getInstalledApps(call: PluginCall) {
        try {
            val pm = context.packageManager
            val mainIntent = android.content.Intent(android.content.Intent.ACTION_MAIN, null)
            mainIntent.addCategory(android.content.Intent.CATEGORY_LAUNCHER)
            val resolveInfos = pm.queryIntentActivities(mainIntent, 0)

            val appsList = mutableListOf<JSObject>()
            for (info in resolveInfos) {
                val pkgName = info.activityInfo.packageName
                if (pkgName == context.packageName) continue

                val appName = info.loadLabel(pm).toString()
                val iconBase64 = try {
                    drawableToBase64(info.loadIcon(pm))
                } catch (e: Exception) { null }

                val entry = JSObject()
                entry.put("packageName", pkgName)
                entry.put("name", appName)
                entry.put("iconBase64", iconBase64)
                appsList.add(entry)
            }

            appsList.sortBy { it.getString("name") }
            val appsArray = JSArray()
            for (app in appsList) appsArray.put(app)

            val result = JSObject()
            result.put("apps", appsArray)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Failed to get installed apps: ${e.message}")
        }
    }

    private fun drawableToBase64(drawable: Drawable): String? {
        return try {
            val bitmap = Bitmap.createBitmap(48, 48, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, 48, 48)
            drawable.draw(canvas)
            val stream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)
            Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)
        } catch (e: Exception) { null }
    }
}
