# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Capacitor WebView için ek kurallar
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep class org.apache.cordova.** { *; }

# HTML lint hatalarını yok say
-dontwarn org.jsoup.**
-keep class org.jsoup.** { *; }

# Web içeriği için
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**

# Google AdMob SDK rules - Updated for 24.5.0
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# AdMob mediation
-keep class com.google.ads.** { *; }
-dontwarn com.google.ads.**

# AdMob specific rules for better ad matching
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient { *; }
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info { *; }

# For banner ads specifically
-keep class com.google.android.gms.ads.AdView { *; }
-keep class com.google.android.gms.ads.AdRequest { *; }
-keep class com.google.android.gms.ads.AdSize { *; }
-keep class com.google.android.gms.ads.AdListener { *; }

# For video ads and hardware acceleration
-keep class com.google.android.gms.ads.VideoController { *; }
-keep class com.google.android.gms.ads.VideoOptions { *; }

# Missing classes from newer Android versions
-dontwarn android.media.LoudnessCodecController
-dontwarn android.media.LoudnessCodecController$OnLoudnessCodecUpdateListener

# Kotlin metadata
-dontwarn kotlin.Metadata
