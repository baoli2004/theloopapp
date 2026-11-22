package com.theloop.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UsageTrackerPlugin.class);
        registerPlugin(AppSelectorPlugin.class);
        registerPlugin(FocusLockPlugin.class);
        super.onCreate(savedInstanceState);
        LoopNotificationManager.createChannel(this);
    }
}
