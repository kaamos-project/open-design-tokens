// GENERATO da open-design-tokens: non modificare a mano.
// Sorgente: tokens/*.json (formato W3C DTCG).

import 'package:flutter/widgets.dart';

/// Palette del tema scuro Kaamos.
abstract final class KaamosColors {
  static const Color transparent = Color(0x00000000);
  static const Color primary = Color(0xFFFFFFFF);
  static const Color primaryPressed = Color(0xFFE8E8E8);
  static const Color onPrimary = Color(0xFF000000);
  static const Color ink = Color(0xFFF4F4F6);
  static const Color body = Color(0xFFCDCDCD);
  static const Color charcoal = Color(0xFFD3D3D4);
  static const Color mute = Color(0xFF9C9C9D);
  static const Color ash = Color(0xFF6A6B6C);
  static const Color stone = Color(0xFF434345);
  static const Color onDark = Color(0xFFFFFFFF);
  static const Color onDarkMute = Color(0xB8FFFFFF);
  static const Color canvas = Color(0xFF07080A);
  static const Color surface = Color(0xFF0D0D0D);
  static const Color surfaceElevated = Color(0xFF101111);
  static const Color surfaceCard = Color(0xFF121212);
  static const Color buttonFg = Color(0xFF18191A);
  static const Color hairline = Color(0xFF242728);
  static const Color hairlineSoft = Color(0x14FFFFFF);
  static const Color hairlineStrong = Color(0x29FFFFFF);
  static const Color accentBlue = Color(0xFF57C1FF);
  static const Color accentBlueSoft = Color(0x2657C1FF);
  static const Color accentRed = Color(0xFFFF6161);
  static const Color accentRedSoft = Color(0x26FF6161);
  static const Color accentGreen = Color(0xFF59D499);
  static const Color accentGreenSoft = Color(0x2659D499);
  static const Color accentYellow = Color(0xFFFFC533);
  static const Color accentYellowSoft = Color(0x26FFC533);
  static const Color heroStripeStart = Color(0xFFFF5757);
  static const Color heroStripeEnd = Color(0xFFA1131A);
  static const Color keyBgStart = Color(0xFF121212);
  static const Color keyBgEnd = Color(0xFF0D0D0D);
}

/// Raggi degli angoli, in pixel logici.
abstract final class KaamosRadius {
  static const double none = 0;
  static const double xs = 4;
  static const double sm = 6;
  static const double md = 8;
  static const double lg = 10;
  static const double xl = 16;
  static const double full = 9999;
}

/// Spaziature, in pixel logici.
abstract final class KaamosSpacing {
  /// Unità della griglia: tutte le spaziature sono multipli di 4px (in Tailwind p-2 = 2 × base = 8px).
  static const double base = 4;
  /// Ritmo verticale tra le sezioni di una pagina.
  static const double section = 96;
}

/// Font del brand (Inter, incluso in questo pacchetto).
abstract final class KaamosFont {
  /// Nome del pacchetto che contiene il font: serve a TextStyle(package: ...).
  static const String package = 'kaamos_design_tokens';
  static const String family = 'Inter';

  /// Feature OpenType sempre attive (ss03 = 'g' alternativa del brand).
  static const List<FontFeature> features = [FontFeature.enable('calt'), FontFeature.enable('kern'), FontFeature.enable('liga'), FontFeature.enable('ss03')];

  static const FontWeight normal = FontWeight.w400;
  static const FontWeight medium = FontWeight.w500;
  static const FontWeight semibold = FontWeight.w600;
}

/// Stili di testo del design system.
///
/// Inter è un font variabile: su alcune piattaforme fontWeight da solo non
/// muove l'asse "wght", quindi ogni stile imposta anche fontVariations.
abstract final class KaamosTypography {
  static const TextStyle displayXl = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 64,
    height: 1.1,
    letterSpacing: 0,
    fontWeight: FontWeight.w600,
    fontVariations: [FontVariation('wght', 600)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle displayLg = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 56,
    height: 1.17,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle headingXl = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 24,
    height: 1.6,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle headingLg = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 22,
    height: 1.15,
    letterSpacing: 0,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle headingMd = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 20,
    height: 1.4,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle headingSm = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 18,
    height: 1.4,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle bodyLg = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 18,
    height: 1.6,
    letterSpacing: 0,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle bodyMd = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 16,
    height: 1.6,
    letterSpacing: 0,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle bodyStrong = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 16,
    height: 1.4,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle bodySm = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 14,
    height: 1.6,
    letterSpacing: 0,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle bodySmStrong = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 14,
    height: 1.6,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle captionMd = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 13,
    height: 1.4,
    letterSpacing: 0.1,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle captionSm = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 12,
    height: 1.5,
    letterSpacing: 0.4,
    fontWeight: FontWeight.w400,
    fontVariations: [FontVariation('wght', 400)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle linkMd = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 16,
    height: 1.4,
    letterSpacing: 0.3,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
  static const TextStyle buttonMd = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: 14,
    height: 1.6,
    letterSpacing: 0.2,
    fontWeight: FontWeight.w500,
    fontVariations: [FontVariation('wght', 500)],
    fontFeatures: KaamosFont.features,
  );
}

/// Durate delle animazioni.
abstract final class KaamosDuration {
  /// Durata standard delle transizioni (es. apertura del drawer di navigazione).
  static const Duration normal = Duration(milliseconds: 200);
}

/// Curve delle animazioni.
abstract final class KaamosEasing {
  /// Equivalente della parola chiave CSS ease-out.
  static const Cubic out = Cubic(0, 0, 0.58, 1);
}
