package com.theloop.app

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

@CapacitorPlugin(name = "FocusLockNative")
class FocusLockPlugin : Plugin() {

    private val prefs: SharedPreferences
        get() = context.getSharedPreferences("loop_focus_session", Context.MODE_PRIVATE)

    @PluginMethod
    fun hasAccessibilityPermission(call: PluginCall) {
        val ret = JSObject()
        ret.put("granted", isAccessibilityServiceEnabled())
        call.resolve(ret)
    }

    @PluginMethod
    fun openAccessibilitySettings(call: PluginCall) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("Unable to open accessibility settings: ${e.message}")
        }
    }

    @PluginMethod
    fun startSession(call: PluginCall) {
        val durationMin = call.getInt("durationMin", 25) ?: 25
        val goal = call.getString("goal") ?: ""

        val restrictedArray = call.getArray("restrictedPackages")
        val restrictedList = mutableListOf<String>()
        if (restrictedArray != null) {
            for (i in 0 until restrictedArray.length()) {
                restrictedList.add(restrictedArray.getString(i))
            }
        }

        val sessionId = UUID.randomUUID().toString()
        val startedAt = System.currentTimeMillis()

        val sessionJson = JSONObject()
        sessionJson.put("id", sessionId)
        sessionJson.put("startedAt", startedAt)
        sessionJson.put("durationMin", durationMin)
        sessionJson.put("restrictedPackages", JSONArray(restrictedList))
        sessionJson.put("goal", goal)
        sessionJson.put("paused", false)
        sessionJson.put("pausedAt", 0L)
        sessionJson.put("pausedTotalMs", 0L)

        prefs.edit()
            .putString("active_session", sessionJson.toString())
            .putStringSet("restricted_packages", restrictedList.toSet())
            .putBoolean("session_active", true)
            .apply()

        FocusLockAccessibilityService.setSessionActive(true)
        FocusLockAccessibilityService.updateRestrictedPackages(restrictedList.toSet())

        val result = JSObject()
        val session = JSObject()
        session.put("id", sessionId)
        session.put("startedAt", startedAt)
        session.put("durationMin", durationMin)
        session.put("remainingMs", durationMin * 60 * 1000L)
        session.put("restrictedPackages", JSArray(restrictedList))
        session.put("paused", false)
        result.put("session", session)
        call.resolve(result)
    }

    @PluginMethod
    fun stopSession(call: PluginCall) {
        prefs.edit()
            .remove("active_session")
            .remove("restricted_packages")
            .putBoolean("session_active", false)
            .apply()

        FocusLockAccessibilityService.setSessionActive(false)
        FocusLockAccessibilityService.updateRestrictedPackages(emptySet())

        call.resolve()
    }

    @PluginMethod
    fun pauseSession(call: PluginCall) {
        val sessionJson = prefs.getString("active_session", null)
        if (sessionJson == null) { call.reject("No active session"); return }
        try {
            val session = JSONObject(sessionJson)
            session.put("paused", true)
            session.put("pausedAt", System.currentTimeMillis())
            prefs.edit().putString("active_session", session.toString()).apply()
            call.resolve()
        } catch (e: Exception) {
            call.reject("Failed to pause session: ${e.message}")
        }
    }

    @PluginMethod
    fun resumeSession(call: PluginCall) {
        val sessionJson = prefs.getString("active_session", null)
        if (sessionJson == null) { call.reject("No active session"); return }
        try {
            val session = JSONObject(sessionJson)
            val pausedAt = session.optLong("pausedAt", 0)
            val prevTotal = session.optLong("pausedTotalMs", 0)
            val now = System.currentTimeMillis()
            session.put("paused", false)
            session.put("pausedAt", 0L)
            session.put("pausedTotalMs", prevTotal + (now - pausedAt))
            prefs.edit().putString("active_session", session.toString()).apply()
            call.resolve()
        } catch (e: Exception) {
            call.reject("Failed to resume session: ${e.message}")
        }
    }

    @PluginMethod
    fun getActiveSession(call: PluginCall) {
        val sessionJson = prefs.getString("active_session", null)
        if (sessionJson == null) {
            val result = JSObject()
            result.put("session", JSONObject.NULL)
            call.resolve(result)
            return
        }
        try {
            val session = JSONObject(sessionJson)
            val startedAt = session.getLong("startedAt")
            val durationMin = session.getInt("durationMin")
            val paused = session.optBoolean("paused", false)
            val pausedTotalMs = session.optLong("pausedTotalMs", 0)
            val pausedAt = session.optLong("pausedAt", 0)

            val now = System.currentTimeMillis()
            val elapsed = if (paused) {
                (pausedAt - startedAt) - pausedTotalMs
            } else {
                (now - startedAt) - pausedTotalMs
            }
            val durationMs = durationMin * 60 * 1000L
            val remainingMs = (durationMs - elapsed).coerceAtLeast(0)

            val result = JSObject()
            val sessionResult = JSObject()
            sessionResult.put("id", session.getString("id"))
            sessionResult.put("startedAt", startedAt)
            sessionResult.put("durationMin", durationMin)
            sessionResult.put("remainingMs", remainingMs)
            sessionResult.put("paused", paused)

            val restrictedArr = session.optJSONArray("restrictedPackages")
            val jsArr = JSArray()
            if (restrictedArr != null) {
                for (i in 0 until restrictedArr.length()) {
                    jsArr.put(restrictedArr.getString(i))
                }
            }
            sessionResult.put("restrictedPackages", jsArr)
            result.put("session", sessionResult)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Failed to get active session: ${e.message}")
        }
    }

    @PluginMethod
    fun isAppRestricted(call: PluginCall) {
        val packageName = call.getString("packageName")
        if (packageName == null) { call.reject("packageName is required"); return }
        val restrictedSet = prefs.getStringSet("restricted_packages", emptySet()) ?: emptySet()
        val result = JSObject()
        result.put("restricted", restrictedSet.contains(packageName))
        call.resolve(result)
    }

    private fun isAccessibilityServiceEnabled(): Boolean {
        val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val enabledServices = am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)
        for (service in enabledServices) {
            if (service.resolveInfo.serviceInfo.packageName == context.packageName &&
                service.resolveInfo.serviceInfo.name == "com.theloop.app.FocusLockAccessibilityService"
            ) {
                return true
            }
        }
        return false
    }
}
