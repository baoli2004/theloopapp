package com.theloop.app

import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class FocusLockOverlayActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val blockedPackage = intent.getStringExtra("blocked_package") ?: "this app"

        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        layout.gravity = Gravity.CENTER
        layout.setPadding(64, 128, 64, 128)
        layout.setBackgroundColor(0xFF08080D.toInt())

        val title = TextView(this)
        title.text = "Focus Lock Active"
        title.textSize = 24f
        title.gravity = Gravity.CENTER
        title.setTextColor(0xFFF8F7FC.toInt())

        val message = TextView(this)
        message.text = "This app is temporarily restricted during your focus session.\n\nBlocked: $blockedPackage"
        message.textSize = 16f
        message.gravity = Gravity.CENTER
        message.setPadding(0, 32, 0, 64)
        message.setTextColor(0xFFA1A1AA.toInt())

        val backButton = Button(this)
        backButton.text = "Go Back"
        backButton.setOnClickListener { finish() }

        layout.addView(title)
        layout.addView(message)
        layout.addView(backButton)
        setContentView(layout)
    }
}
