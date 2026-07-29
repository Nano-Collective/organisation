"use client";

import { Minus, Plus, Settings } from "lucide-react";
import Head from "next/head";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  CoverImageSidebar,
  type SidebarState,
} from "@/components/cover-image/cover-image-sidebar";
import { CoverPreview } from "@/components/cover-image/cover-preview";
import { Button } from "@/components/ui/button";
import { DEFAULT_POST_BLOCKS } from "@/lib/cover-image/blocks";
import { buildFooter } from "@/lib/cover-image/footer";
import { buildItems } from "@/lib/cover-image/items";
import { DEFAULT_HUE, paletteFromHue } from "@/lib/cover-image/palette";
import { renderCoverToCanvas } from "@/lib/cover-image/render";
import { SPACING_VALUES } from "@/lib/cover-image/spacing";
import type {
  BgStyle,
  Mode,
  Pattern,
  Spacing,
  TextBlock,
  Theme,
} from "@/lib/cover-image/types";

export default function CoverImage() {
  const [mode, setMode] = useState<Mode>("post");
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Per-mode dimensions so switching gives a sensible default.
  const [coverWidth, setCoverWidth] = useState(1500);
  const [coverHeight, setCoverHeight] = useState(500);
  const [postWidth, setPostWidth] = useState(1200);
  const [postHeight, setPostHeight] = useState(750);
  const width = mode === "cover" ? coverWidth : postWidth;
  const height = mode === "cover" ? coverHeight : postHeight;
  const setWidth = mode === "cover" ? setCoverWidth : setPostWidth;
  const setHeight = mode === "cover" ? setCoverHeight : setPostHeight;

  // Layout
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    "center",
  );
  const [bottomPadding, setBottomPadding] = useState(40);
  const [sidePadding, setSidePadding] = useState(40);
  const [contentScale, setContentScale] = useState(100);
  // Inter-item gap preset. Mapped to pixels by SPACING_VALUES and then
  // scaled by contentScale so a 200% scale keeps the ratio.
  const [spacing, setSpacing] = useState<Spacing>("normal");

  // Cover content
  const [coverSubtitle, setCoverSubtitle] = useState("Join the collective");
  const [coverWebsite, setCoverWebsite] = useState("nanocollective.org");
  const [showCoverSubtitle, setShowCoverSubtitle] = useState(true);
  const [showCoverIcons, setShowCoverIcons] = useState(true);
  const [showCoverWebsite, setShowCoverWebsite] = useState(true);

  // Post content. An ordered array of text blocks — add, remove and
  // reorder freely — plus the separate tag list and social icons.
  const [postBlocks, setPostBlocks] =
    useState<TextBlock[]>(DEFAULT_POST_BLOCKS);
  const [showPostBadges, setShowPostBadges] = useState(false);
  const [showPostIcons, setShowPostIcons] = useState(false);
  const [postBadges, setPostBadges] = useState("open-source, typescript, cli");

  // Footer watermark
  const [showFooter, setShowFooter] = useState(true);

  // Theme
  const [pattern, setPattern] = useState<Pattern>("grid");
  const [bgStyle, setBgStyle] = useState<BgStyle>("gradient");
  const [hue, setHue] = useState(DEFAULT_HUE);
  const colors = useMemo(() => paletteFromHue(hue, theme), [hue, theme]);
  const primaryColor = colors.primary;
  const secondaryColor = colors.secondary;

  // Auto-fit the preview to the available width.
  const [autoFit, setAutoFit] = useState(1);
  const [zoom, setZoom] = useState(1);
  const scale = autoFit * zoom;
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const node = containerRef.current;
    const update = () => {
      const available = node.clientWidth;
      setAutoFit(Math.min(1, available / width));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width]);

  // Derive the rendered content stack from the current state. Both the
  // live preview and the canvas download consume the same output.
  const items = useMemo(
    () =>
      buildItems({
        mode,
        coverSubtitle,
        coverWebsite,
        showCoverSubtitle,
        showCoverIcons,
        showCoverWebsite,
        postBlocks,
        showPostIcons,
        postBadges,
        showPostBadges,
        colors,
        contentScale,
      }),
    [
      mode,
      coverSubtitle,
      coverWebsite,
      showCoverSubtitle,
      showCoverIcons,
      showCoverWebsite,
      postBlocks,
      showPostIcons,
      postBadges,
      showPostBadges,
      colors,
      contentScale,
    ],
  );

  // The watermark sits outside the content stack, so it's built separately.
  const footer = useMemo(
    () =>
      buildFooter({
        show: showFooter,
        colors,
        contentScale,
        sidePadding,
      }),
    [showFooter, colors, contentScale, sidePadding],
  );

  const cs = contentScale / 100;
  // Inter-item gap: pick the preset pixel value, then scale by the
  // content scale so a 200% scale keeps the visual ratio.
  const contentGap = SPACING_VALUES[spacing] * cs;
  // Post art reads better centered in the frame; cover banners are
  // bottom-anchored so the icons/url sit near the edge.
  const verticalCenter = mode === "post";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await document.fonts?.ready;
      const dataUrl = await renderCoverToCanvas({
        width,
        height,
        alignment,
        sidePadding,
        bottomPadding,
        contentGap,
        verticalCenter,
        bgStyle,
        pattern,
        colors,
        primaryColor,
        secondaryColor,
        items,
        footer,
        iconsContainerRef,
      });
      const link = document.createElement("a");
      const slug = mode === "cover" ? "cover" : "post";
      link.download = `nano-collective-${slug}-${width}x${height}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const sidebarState: SidebarState = {
    mode,
    width,
    height,
    setWidth,
    setHeight,
    alignment,
    setAlignment,
    sidePadding,
    bottomPadding,
    contentScale,
    setSidePadding,
    setBottomPadding,
    setContentScale,
    spacing,
    setSpacing,
    hue,
    setHue,
    primaryColor,
    secondaryColor,
    pattern,
    setPattern,
    bgStyle,
    setBgStyle,
    coverSubtitle,
    setCoverSubtitle,
    coverWebsite,
    setCoverWebsite,
    showCoverSubtitle,
    showCoverIcons,
    showCoverWebsite,
    setShowCoverSubtitle,
    setShowCoverIcons,
    setShowCoverWebsite,
    postBlocks,
    setPostBlocks,
    postBadges,
    setPostBadges,
    showPostBadges,
    showPostIcons,
    setShowPostBadges,
    setShowPostIcons,
    showFooter,
    setShowFooter,
  };

  return (
    <>
      <Head>
        <title>Asset Generator - Nano Collective</title>
      </Head>
      <div className="min-h-screen bg-background text-foreground flex">
        <div
          className={`flex-1 min-w-0 flex flex-col transition-[margin] duration-200 ${
            sidebarOpen ? "lg:mr-[360px]" : "mr-0"
          }`}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 bg-background/80 backdrop-blur border-b border-foreground/20">
            <div className="flex items-center gap-2">
              <ModeToggle mode={mode} onChange={setMode} />
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
            <div className="flex items-center gap-2">
              <ZoomControls
                scale={scale}
                onZoomIn={() => setZoom((z) => Math.min(20, z * 1.25))}
                onZoomOut={() => setZoom((z) => Math.max(0.05, z / 1.25))}
                onResetZoom={() => setZoom(1)}
              />
              <button
                type="button"
                className="text-sm font-semibold px-4 py-2 border border-foreground/20 bg-foreground text-background hover:bg-background hover:text-foreground transition-colors disabled:opacity-50"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading
                  ? "Rendering…"
                  : `Download ${width}×${height} PNG`}
              </button>
              <button
                type="button"
                className="p-2 border border-foreground/20 bg-background hover:bg-muted transition-colors flex items-center justify-center"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle controls"
              >
                <Settings className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 p-4 overflow-auto">
            <div ref={containerRef} className="flex justify-center min-w-fit">
              <div
                style={{
                  width: `${width * scale}px`,
                  height: `${height * scale}px`,
                }}
              >
                <div
                  className="origin-top-left"
                  style={{ transform: `scale(${scale})` }}
                >
                  <CoverPreview
                    width={width}
                    height={height}
                    alignment={alignment}
                    bottomPadding={bottomPadding}
                    sidePadding={sidePadding}
                    contentGap={contentGap}
                    verticalCenter={verticalCenter}
                    bgStyle={bgStyle}
                    pattern={pattern}
                    colors={colors}
                    items={items}
                    footer={footer}
                    iconsContainerRef={iconsContainerRef}
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground text-center">
              Preview is scaled to fit; download produces a {width}×{height} PNG
              rendered directly to canvas.
            </p>
          </div>
        </div>

        <CoverImageSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          state={sidebarState}
        />
      </div>
    </>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="inline-flex rounded-none border border-foreground/20 p-0.5 bg-muted/30">
      {(["cover", "post"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`px-3 py-1.5 text-sm font-semibold uppercase tracking-widest rounded-none ${
            mode === m
              ? "bg-[#0000EE] text-white dark:bg-foreground dark:text-background"
              : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {m === "cover" ? "Cover" : "Post"}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
}) {
  return (
    <div className="inline-flex rounded-none border border-foreground/20 p-0.5 bg-muted/30">
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`px-3 py-1.5 text-sm font-semibold uppercase tracking-widest rounded-none ${
            theme === t
              ? "bg-[#0000EE] text-white dark:bg-foreground dark:text-background"
              : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {t === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}

function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}) {
  return (
    <div className="flex items-center gap-1 mr-1">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <button
        type="button"
        onClick={onResetZoom}
        className="text-xs text-muted-foreground hover:text-foreground tabular-nums w-12 text-center"
        title="Reset zoom"
      >
        {Math.round(scale * 100)}%
      </button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
