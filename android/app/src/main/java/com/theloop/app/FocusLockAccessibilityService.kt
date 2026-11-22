package com.theloop.app

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class FocusLockAccessibilityService : AccessibilityService() {

    companion object {
        @Volatile
        private var restrictedPackages: Set<String> = emptySet()

        @Volatile
        private var sessionActive: Boolean = false

        fun updateRestrictedPackages(packages: Set<String>) {
            restrictedPackages = packages
        }

        fun setSessionActive(active: Boolean) {
            sessionActive = active
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        val info = AccessibilityServiceInfo()
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
        info.flags = AccessibilityServiceInfo.FLAG_DEFAULT
        info.notificationTimeout = 100
        serviceInfo = info

        val prefs = getSharedPreferences("loop_focus_session", Context.MODE_PRIVATE)
        sessionActive = prefs.getBoolean("session_active", false)
        restrictedPackages = prefs.getStringSet("restricted_packages", emptySet()) ?: emptySet()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (!sessionActive) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return

        if (restrictedPackages.contains(packageName)) {
            val intent = Intent(this, FocusLockOverlayActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
            intent.putExtra("blocked_package", packageName)
            startActivity(intent)
        }
    }

    override fun onInterrupt() {
        // No-op
    }
}
