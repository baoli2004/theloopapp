package com.theloop.app

import android.content.Context
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.util.Base64
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.ByteArrayOutputStream

@CapacitorPlugin(name = "AppSelector")
class AppSelectorPlugin : Plugin() {

    private val prefs: SharedPreferences
        get() = context.getSharedPreferences("loop_app_selector", Context.MODE_PRIVATE)

    @PluginMethod
    fun getLaunchableApps(call: PluginCall) {
        try {
            val pm = context.packageManager
            val mainIntent = android.content.Intent(android.content.Intent.ACTION_MAIN, null)
            mainIntent.addCategory(android.content.Intent.CATEGORY_LAUNCHER)
            val resolveInfos = pm.queryIntentActivities(mainIntent, PackageManager.MATCH_DEFAULT_ONLY)

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
            call.reject("Failed to get launchable apps: ${e.message}")
        }
    }

    @PluginMethod
    fun getSelectedApps(call: PluginCall) {
        val packagesJson = prefs.getString("selected_packages", "[]") ?: "[]"
        val arr = org.json.JSONArray(packagesJson)
        val jsArr = JSArray()
        for (i in 0 until arr.length()) {
            jsArr.put(arr.getString(i))
        }
        val result = JSObject()
        result.put("packages", jsArr)
        call.resolve(result)
    }

    @PluginMethod
    fun setSelectedApps(call: PluginCall) {
        val packagesArray = call.getArray("packages")
        if (packagesArray == null) {
            call.reject("packages array is required")
            return
        }

        val list = mutableListOf<String>()
        for (i in 0 until packagesArray.length()) {
            list.add(packagesArray.getString(i))
        }

        val jsonArr = org.json.JSONArray(list)
        prefs.edit().putString("selected_packages", jsonArr.toString()).apply()
        call.resolve()
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
