import 'dart:async';
import 'dart:collection';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  final prefs = await SharedPreferences.getInstance();
  final String lastUrl = prefs.getString('last_visited_url') ?? 'https://official.doearno.in';

  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(DoearnoApp(initialUrl: lastUrl));
}

class DoearnoApp extends StatelessWidget {
  final String initialUrl;
  const DoearnoApp({super.key, required this.initialUrl});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Doearno',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: WebViewScreen(initialUrl: initialUrl),
    );
  }
}

class _EagerGestureRecognizer extends OneSequenceGestureRecognizer {
  @override
  void addAllowedPointer(PointerDownEvent event) {
    super.addAllowedPointer(event);
    resolve(GestureDisposition.accepted);
    stopTrackingPointer(event.pointer);
  }

  @override
  String get debugDescription => 'eager';

  @override
  void didStopTrackingLastPointer(int pointer) {}

  @override
  void handleEvent(PointerEvent event) {}
}

class WebViewScreen extends StatefulWidget {
  final String initialUrl;
  const WebViewScreen({super.key, required this.initialUrl});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  InAppWebViewController? _webViewController;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    serverClientId: '114505652248-dbn0feoihnjrhjvhfv3rqon7i15dmsb7.apps.googleusercontent.com',
    scopes: ['email', 'openid', 'profile'],
  );

  bool _isOffline = false;
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;

  static const String _userAgent =
      'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) '
      'AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/124.0.6367.82 Mobile Safari/537.36';
  static const String _smartScrollFixJs = '''
    (function() {
      if (window.__doearnoSmartFix) return;
      window.__doearnoSmartFix = true;

      function applySmartFix() {
        if (document.readyState === 'loading') return;
        
        var meta = document.querySelector('meta[name="viewport"]');
        var contentStr = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = contentStr;
          document.head.appendChild(meta);
        } else if (meta.content !== contentStr) {
          meta.content = contentStr;
        }

        if (document.documentElement.style.touchAction !== 'pan-y') {
          document.documentElement.style.touchAction = 'pan-y';
          document.body.style.touchAction = 'pan-y';
        }

        const style = document.createElement('style');
        style.innerHTML = `
          * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
          }
          input, textarea, [contenteditable="true"] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
          }
        `;
        document.head.appendChild(style);
        
        const preventDefault = (e) => e.preventDefault();
        document.addEventListener('copy', preventDefault);
        document.addEventListener('cut', preventDefault);
        document.addEventListener('contextmenu', preventDefault);
        document.addEventListener('selectstart', preventDefault);
      }

      document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      }, { passive: false });

      applySmartFix();
    })();
  ''';

  Future<void> _handleGoogleSignIn(WebUri uri) async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      
      if (account != null && _webViewController != null) {
        final GoogleSignInAuthentication auth = await account.authentication;
        final String? idToken = auth.idToken;
        
        if (idToken != null) {
          const String supabaseUrl = 'https://bguvrbsopcrzaizmhjij.supabase.co';
          const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndXZyYnNvcGNyemFpem1oamlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTEwNDQsImV4cCI6MjA4ODUyNzA0NH0.919kebXCzEKIS0dT4UtQp8zZ7oJlWf62aXL-5m16q7A';
          const String storageKey = 'sb-bguvrbsopcrzaizmhjij-auth-token';

          final String loginJs = '''
            (async function() {
              try {
                console.log("Starting direct seamless login...");
                
                const response = await fetch('$supabaseUrl/auth/v1/token?grant_type=id_token', {
                  method: 'POST',
                  headers: {
                    'apikey': '$supabaseAnonKey',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    provider: 'google',
                    id_token: '$idToken'
                  })
                });
                
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error_description || errorData.error || "API failure");
                }
                
                const session = await response.json();
                
                localStorage.setItem('$storageKey', JSON.stringify(session));
                
                console.log("Seamless Login Success - Session stored!");
                
                await new Promise(r => setTimeout(r, 100));
                
                window.location.replace("/home"); 
              } catch (err) {
                console.error("Critical Seamless Login Error:", err.message);
                alert("Login Error: " + err.message);
                window.location.reload();
              }
            })();
          ''';
          
          await _webViewController!.evaluateJavascript(source: loginJs);
        } else {
        }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Seamless Login Error: $error'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Future<void> _launchExternal(WebUri? uri) async {
    if (uri == null) return;
    final String url = uri.toString();
    
    if (uri.host.contains('official.doearno.in') || uri.host.contains('supabase.co')) {
      _webViewController?.loadUrl(urlRequest: URLRequest(url: uri));
      return;
    }

    try {
      bool launched = false;
      if (await canLaunchUrl(uri)) {
        launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      } 
      else if (url.startsWith('intent://')) {
        final fallbackUrl = _extractIntentFallback(url);
        if (fallbackUrl != null) {
          launched = await launchUrl(WebUri(fallbackUrl), mode: LaunchMode.externalApplication);
        }
      } 
      else if (url.startsWith('http')) {
        launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
      if (launched) {
        await Future.delayed(const Duration(milliseconds: 500));
        SystemNavigator.pop();
      }
    } catch (e) {
    }
  }

  String? _extractIntentFallback(String url) {
    try {
      final fallbackMatch = RegExp(r'S\.browser_fallback_url=([^;]+)').firstMatch(url);
      if (fallbackMatch != null) {
        return Uri.decodeFull(fallbackMatch.group(1)!);
      }
    } catch (_) {}
    return null;
  }

  @override
  void initState() {
    super.initState();
    _initConnectivity();
  }

  Future<void> _initConnectivity() async {
    final results = await Connectivity().checkConnectivity();
    _updateConnectionStatus(results);

    _connectivitySubscription = Connectivity().onConnectivityChanged.listen(_updateConnectionStatus);
  }

  void _updateConnectionStatus(List<ConnectivityResult> results) {
    final bool wasOffline = _isOffline;
    final bool nowOffline = results.contains(ConnectivityResult.none);

    if (mounted) {
      setState(() {
        _isOffline = nowOffline;
      });
    }

    if (wasOffline && !nowOffline && _webViewController != null) {
      _webViewController!.setSettings(
        settings: InAppWebViewSettings(cacheMode: CacheMode.LOAD_DEFAULT),
      );
      _webViewController!.reload();
    }
    else if (!wasOffline && nowOffline && _webViewController != null) {
      _webViewController!.setSettings(
        settings: InAppWebViewSettings(cacheMode: CacheMode.LOAD_CACHE_ELSE_NETWORK),
      );
    }
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;

        if (_webViewController != null) {
          final canGoBack = await _webViewController!.canGoBack();
          if (canGoBack) {
            await _webViewController!.goBack();
            return;
          }
        }
        SystemNavigator.pop();
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Stack(
          children: [
            InAppWebView(
          gestureRecognizers: <Factory<OneSequenceGestureRecognizer>>{
            Factory<OneSequenceGestureRecognizer>(() => _EagerGestureRecognizer()),
          },
          initialUrlRequest: URLRequest(url: WebUri(widget.initialUrl)),
          initialUserScripts: UnmodifiableListView<UserScript>([
            UserScript(
              source: """
                const style = document.createElement('style');
                style.innerHTML = `
                  * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
                  }
                  input, textarea, [contenteditable="true"] {
                    -webkit-user-select: auto !important;
                    -moz-user-select: auto !important;
                    -ms-user-select: auto !important;
                    user-select: auto !important;
                  }
                `;
                document.documentElement.appendChild(style);
                
                document.addEventListener('copy', (e) => e.preventDefault(), true);
                document.addEventListener('cut', (e) => e.preventDefault(), true);
                document.addEventListener('contextmenu', (e) => e.preventDefault(), true);
                document.addEventListener('selectstart', (e) => {
                  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                  }
                }, true);
              """,
              injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START,
            ),
          ]),
          initialSettings: InAppWebViewSettings(
            hardwareAcceleration: true,
            allowsBackForwardNavigationGestures: true,
            useShouldOverrideUrlLoading: true, 
            userAgent: _userAgent,
            cacheEnabled: true,
            cacheMode: CacheMode.LOAD_CACHE_ELSE_NETWORK,
            domStorageEnabled: true,
            databaseEnabled: true,
            supportZoom: false,
            builtInZoomControls: false,
            displayZoomControls: false,
            verticalScrollBarEnabled: false,
            horizontalScrollBarEnabled: false,
            overScrollMode: OverScrollMode.NEVER,
            disableDefaultErrorPage: true,
            disableContextMenu: true,
            javaScriptEnabled: true,
            javaScriptCanOpenWindowsAutomatically: true,
            allowsInlineMediaPlayback: true,
            mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
            transparentBackground: false,
            supportMultipleWindows: false,
            preferredContentMode: UserPreferredContentMode.MOBILE,
          ),
          onWebViewCreated: (controller) {
            _webViewController = controller;
          },
          onPermissionRequest: (controller, request) async {
            return PermissionResponse(
              resources: request.resources,
              action: PermissionResponseAction.GRANT,
            );
          },
          shouldOverrideUrlLoading: (controller, navigationAction) async {
            final uri = navigationAction.request.url;
            if (uri == null) return NavigationActionPolicy.ALLOW;

            final String url = uri.toString();
            
            if (uri.host == 'accounts.google.com' && uri.path.contains('/o/oauth2/v2/auth')) {
              _handleGoogleSignIn(uri);
              return NavigationActionPolicy.CANCEL;
            }

            if (!uri.host.contains('official.doearno.in') && 
                !uri.host.contains('supabase.co')) {
              await _launchExternal(uri);
              return NavigationActionPolicy.CANCEL;
            }

            if (!url.startsWith('http')) {
              await _launchExternal(uri);
              return NavigationActionPolicy.CANCEL;
            }

            return NavigationActionPolicy.ALLOW;
          },
          onDownloadStartRequest: (controller, downloadStartRequest) async {
            await _launchExternal(downloadStartRequest.url);
          },
          onCreateWindow: (controller, createWindowAction) async {
            final request = createWindowAction.request;
            final url = request.url;
            
            if (url != null && 
                !url.host.contains('official.doearno.in') && 
                !url.host.contains('supabase.co')) {
              await _launchExternal(url);
            } else if (url != null) {
              controller.loadUrl(urlRequest: URLRequest(url: url));
            }
            
            return true;
          },
          onLoadStop: (controller, url) async {
            await controller.evaluateJavascript(source: _smartScrollFixJs);
          },
          onUpdateVisitedHistory: (controller, url, isReload) async {
            if (url != null && url.toString().contains('official.doearno.in')) {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString('last_visited_url', url.toString());
            }
            await controller.evaluateJavascript(source: _smartScrollFixJs);
          },
          onReceivedError: (controller, request, error) {
            if (_isOffline && request.url.toString().contains('official.doearno.in')) {
              controller.setSettings(
                settings: InAppWebViewSettings(cacheMode: CacheMode.LOAD_CACHE_ONLY),
              );
              controller.loadUrl(urlRequest: URLRequest(url: request.url));
            }
          },
        ),
            if (_isOffline)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.orange.shade700,
                          Colors.red.shade600,
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const SafeArea(
                      bottom: false,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.wifi_off_rounded,
                            color: Colors.white,
                            size: 16,
                          ),
                          SizedBox(width: 8),
                          Text(
                            'Offline — Please connect with internet',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
